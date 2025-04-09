from rest_framework import serializers
from .models import ShortTermBooking


class ShortTermBookingSerializer(serializers.ModelSerializer):
    class Meta:
        model = ShortTermBooking
        fields = [
            'id',
            'listing',
            'name',
            'email',
            'check_in',
            'check_out',
            'created_at',
            'confirmed',
            'token',
            'user'
        ]
