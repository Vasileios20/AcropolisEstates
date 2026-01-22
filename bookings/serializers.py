from rest_framework import serializers
from .models import ShortTermBooking
from bookings.utils import calculate_booking_price
from decimal import Decimal


class ShortTermBookingSerializer(serializers.ModelSerializer):
    """
    Serializer for ShortTermBooking with full discount support.

    Read-only fields include all calculated pricing components and
    discount info.
    """

    # Price breakdown (read-only)
    subtotal = serializers.DecimalField(
        max_digits=10,
        decimal_places=2,
        read_only=True
    )
    discount_amount = serializers.DecimalField(
        max_digits=10,
        decimal_places=2,
        read_only=True
    )
    discounted_subtotal = serializers.SerializerMethodField()
    vat = serializers.DecimalField(
        max_digits=10,
        decimal_places=2,
        read_only=True
    )
    municipality_tax = serializers.DecimalField(
        max_digits=10,
        decimal_places=2,
        read_only=True
    )
    climate_crisis_fee = serializers.DecimalField(
        max_digits=10,
        decimal_places=2,
        read_only=True
    )
    cleaning_fee = serializers.DecimalField(
        max_digits=10,
        decimal_places=2,
        read_only=True
    )
    service_fee = serializers.DecimalField(
        max_digits=10,
        decimal_places=2,
        read_only=True
    )
    total_price = serializers.DecimalField(
        max_digits=10,
        decimal_places=2,
        read_only=True
    )

    # Discount info (read-only for API, admin applies via separate endpoint)
    has_discount = serializers.BooleanField(read_only=True)
    discount_type_display = serializers.SerializerMethodField()
    discount_applied_by_name = serializers.SerializerMethodField()

    # Status display
    status_display = serializers.CharField(
        source='get_status_display', read_only=True)

    class Meta:
        model = ShortTermBooking
        fields = [
            'id',
            'listing',
            'reference_number',
            'user',

            # Guest info
            'first_name',
            'last_name',
            'email',
            'phone_number',

            # Booking details
            'check_in',
            'check_out',
            'adults',
            'children',
            'message',
            'language',

            # Status
            'status',
            'status_display',
            'admin_confirmed',  # Kept for backward compatibility

            # Pricing
            'total_nights',
            'subtotal',
            'discount_type',
            'discount_value',
            'discount_amount',
            'discount_reason',
            'has_discount',
            'discount_type_display',
            'discounted_subtotal',
            'vat',
            'municipality_tax',
            'climate_crisis_fee',
            'cleaning_fee',
            'service_fee',
            'total_price',

            # Audit
            'discount_applied_by',
            'discount_applied_by_name',
            'discount_applied_at',
            'created_at',
            'updated_at',
        ]
        read_only_fields = [
            'reference_number',
            'total_nights',
            'subtotal',
            'vat',
            'municipality_tax',
            'climate_crisis_fee',
            'cleaning_fee',
            'service_fee',
            'total_price',
            'discount_amount',
            'discount_type',
            'discount_value',
            'discount_reason',
            'discount_applied_by',
            'discount_applied_at',
            'created_at',
            'updated_at',
            'admin_confirmed',  # Synced with status
        ]

    def get_discounted_subtotal(self, obj):
        """Calculate subtotal after discount"""
        return float(obj.discounted_subtotal)

    def get_discount_type_display(self, obj):
        """Human-readable discount type"""
        if obj.discount_type == 'percentage':
            return f"{obj.discount_value}% off"
        elif obj.discount_type == 'fixed':
            return f"€{obj.discount_value} off"
        return None

    def get_discount_applied_by_name(self, obj):
        """Name of admin who applied discount"""
        if obj.discount_applied_by:
            return obj.discount_applied_by.username
        return None

    def validate(self, data):
        """
        Validate booking data including guest counts and date overlaps.
        """
        listing = data.get(
            'listing', self.instance.listing if self.instance else None)
        check_in = data.get(
            'check_in', self.instance.check_in if self.instance else None)
        check_out = data.get(
            'check_out', self.instance.check_out if self.instance else None)
        adults = data.get('adults', 0)
        children = data.get('children', 0)
        total_guests = adults + children

        # Validate dates
        if check_in and check_out and check_out <= check_in:
            raise serializers.ValidationError({
                "check_out": "Check-out must be after check-in."
            })

        # Check for overlapping bookings (exclude cancelled)
        overlapping = ShortTermBooking.objects.filter(
            listing=listing,
            check_in__lt=check_out,
            check_out__gt=check_in
        ).exclude(status='cancelled')

        if self.instance:
            overlapping = overlapping.exclude(id=self.instance.id)

        if overlapping.exists():
            raise serializers.ValidationError({
                "check_in": "These dates are already booked.",
                "check_out": "These dates are already booked."
            })

        # Validate guest counts
        if total_guests < 1:
            raise serializers.ValidationError({
                "adults": "Total guests must be at least 1."
            })

        if total_guests > listing.max_guests:
            raise serializers.ValidationError({
                "adults": (
                    f"Total guests exceed maximum allowed"
                    f"({listing.max_guests})."
                ),
                "children": (
                    f"Total guests exceed maximum allowed"
                    f"({listing.max_guests})."
                ),
            })

        if adults > listing.max_adults:
            raise serializers.ValidationError({
                "adults": (
                    f"Adults exceed maximum allowed"
                    f"({listing.max_adults})."
                )
            })

        if children > listing.max_children:
            raise serializers.ValidationError({
                "children": (
                    f"Children exceed maximum allowed"
                    f"({listing.max_children})."
                )
            })

        # Prevent date changes on confirmed bookings
        if (
            self.instance and
            self.instance.status in
            ['confirmed', 'checked_in', 'completed']
        ):
            if (
                self.instance.check_in != check_in or
                self.instance.check_out != check_out
            ):
                raise serializers.ValidationError({
                    "check_in": "Cannot change dates for confirmed bookings.",
                    "check_out": "Cannot change dates for confirmed bookings."
                })

        return data

    def create(self, validated_data):
        """
        Create booking with automatic price calculation.
        """
        listing = validated_data['listing']
        check_in = validated_data['check_in']
        check_out = validated_data['check_out']

        # Calculate all pricing components
        price_data = calculate_booking_price(listing, check_in, check_out)

        # Add calculated values to validated data
        validated_data['total_nights'] = price_data['nights']
        validated_data['subtotal'] = price_data['subtotal']
        validated_data['vat'] = price_data['vat']
        validated_data['municipality_tax'] = price_data['municipality_tax']
        validated_data['climate_crisis_fee'] = price_data['climate_crisis_fee']
        validated_data['cleaning_fee'] = price_data['cleaning_fee']
        validated_data['service_fee'] = price_data['service_fee']
        validated_data['total_price'] = price_data['total']

        # Default status
        if 'status' not in validated_data:
            validated_data['status'] = 'pending'

        return super().create(validated_data)

    def update(self, instance, validated_data):
        """
        Update booking with price recalculation if dates changed.
        """
        # Check if dates changed
        dates_changed = (
            'check_in' in validated_data and
            validated_data['check_in'] != instance.check_in
        ) or (
            'check_out' in validated_data and
            validated_data['check_out'] != instance.check_out
        )

        # Recalculate prices if dates changed and booking is still
        # pending without discount
        if (
            dates_changed and
            instance.status == 'pending' and not
            instance.has_discount
        ):
            listing = validated_data.get('listing', instance.listing)
            check_in = validated_data.get('check_in', instance.check_in)
            check_out = validated_data.get('check_out', instance.check_out)

            price_data = calculate_booking_price(listing, check_in, check_out)

            validated_data['total_nights'] = price_data['nights']
            validated_data['subtotal'] = price_data['subtotal']
            validated_data['vat'] = price_data['vat']
            validated_data['municipality_tax'] = price_data['municipality_tax']
            validated_data['climate_crisis_fee'] = price_data[
                'climate_crisis_fee']
            validated_data['cleaning_fee'] = price_data['cleaning_fee']
            validated_data['service_fee'] = price_data['service_fee']
            validated_data['total_price'] = price_data['total']

        return super().update(instance, validated_data)

    def to_representation(self, instance):
        """
        Add computed fields to response.
        """
        data = super().to_representation(instance)

        # Ensure all decimal fields are properly formatted
        decimal_fields = [
            'subtotal', 'discount_amount', 'discounted_subtotal',
            'vat', 'municipality_tax', 'climate_crisis_fee',
            'cleaning_fee', 'service_fee', 'total_price'
        ]

        for field in decimal_fields:
            if field in data and data[field] is not None:
                data[field] = f"{float(data[field]):.2f}"

        return data


class ShortTermBookingDiscountSerializer(serializers.Serializer):
    """
    Serializer for applying/removing discounts to bookings.
    Used by admin-only endpoints.
    """

    discount_type = serializers.ChoiceField(
        choices=['percentage', 'fixed'],
        required=True
    )
    discount_value = serializers.DecimalField(
        max_digits=10,
        decimal_places=2,
        required=True,
        min_value=Decimal('0.01')
    )
    discount_reason = serializers.CharField(
        max_length=255,
        required=False,
        allow_blank=True
    )

    def validate(self, data):
        """Validate discount values"""
        discount_type = data['discount_type']
        discount_value = data['discount_value']

        if discount_type == 'percentage':
            if discount_value > 100:
                raise serializers.ValidationError({
                    "discount_value": "Percentage discount cannot exceed 100%"
                })

        return data


class ShortTermBookingStatusSerializer(serializers.Serializer):
    """
    Serializer for updating booking status.
    Used by admin-only endpoints.
    """

    status = serializers.ChoiceField(
        choices=['pending', 'confirmed',
                 'checked_in', 'completed', 'cancelled'],
        required=True
    )

    def validate_status(self, value):
        """Validate status transitions"""
        # Could add logic here to prevent invalid transitions
        # e.g., cannot go from completed to pending
        return value
