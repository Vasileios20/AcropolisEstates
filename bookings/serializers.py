from rest_framework import serializers
from .models import ShortTermBooking
from bookings.utils import calculate_booking_price


class ShortTermBookingSerializer(serializers.ModelSerializer):
    class Meta:
        model = ShortTermBooking
        fields = [
            'id',
            'listing',
            'first_name',
            'last_name',
            'email',
            'phone_number',
            'check_in',
            'check_out',
            'created_at',
            'reference_number',
            'user',
            'language',
            'admin_confirmed',
            'adults',
            'children',
            'message',
            'total_price',
            'total_nights',
        ]
        read_only_fields = (
            'total_price',
            'total_nights',
            'reference_number',
            'created_at',
        )

    def validate(self, data):
        listing = data['listing']
        check_in = data['check_in']
        check_out = data['check_out']
        adults = data.get('adults', 0)
        children = data.get('children', 0)
        total_guests = adults + children

        overlapping = ShortTermBooking.objects.filter(
            listing=listing,
            check_in__lt=check_out,
            check_out__gt=check_in
        )
        if self.context['request'].method == 'PUT':
            overlapping = overlapping.exclude(id=self.instance.id)

        if overlapping.exists():
            raise serializers.ValidationError(
                "These dates are already booked."
            )

        if total_guests < 1:
            raise serializers.ValidationError(
                "Total guests must be at least 1."
            )

        if total_guests > listing.max_guests:
            raise serializers.ValidationError(
                f"Total guests exceed maximum allowed ({listing.max_guests})."
            )

        if adults > listing.max_adults:
            raise serializers.ValidationError(
                f"Adults exceed maximum allowed ({listing.max_adults})."
            )

        if children > listing.max_children:
            raise serializers.ValidationError(
                f"Children exceed maximum allowed ({listing.max_children})."
            )

        if self.instance and self.instance.admin_confirmed:
            if (
                self.instance.check_in != check_in or
                self.instance.check_out != check_out
            ):
                raise serializers.ValidationError(
                    "Confirmed bookings cannot change dates."
                )

        return data

    def create(self, validated_data):
        listing = validated_data['listing']
        check_in = validated_data['check_in']
        check_out = validated_data['check_out']

        total_nights, total_price, _ = calculate_booking_price(
            listing, check_in, check_out
        )

        validated_data['total_nights'] = total_nights
        validated_data['total_price'] = total_price

        return super().create(validated_data)
