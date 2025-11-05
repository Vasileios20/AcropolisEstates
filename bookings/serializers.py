from rest_framework import serializers
from .models import ShortTermBooking


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
                "These dates are already booked.")

        if total_guests < 1:
            raise serializers.ValidationError(
                "Total guests must be at least 1.")

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

        return data
