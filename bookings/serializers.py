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
            'check_in',
            'check_out',
            'created_at',
            'confirmed',
            'token',
            'user',
            'language',
            'admin_confirmed',
        ]

    def validate(self, data):
        listing = data['listing']
        check_in = data['check_in']
        check_out = data['check_out']

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
        return data
