from rest_framework import generics
from .models import ShortTermBooking
from .serializers import ShortTermBookingSerializer


class ShortTermBookingCreateView(generics.ListCreateAPIView):
    """
    API view to retrieve and create short term bookings.
    """
    queryset = ShortTermBooking.objects.all()
    serializer_class = ShortTermBookingSerializer


class ShortTermBookingDetailView(generics.RetrieveUpdateDestroyAPIView):
    """
    API view to retrieve, update or delete a short term booking.
    """
    queryset = ShortTermBooking.objects.all()
    serializer_class = ShortTermBookingSerializer
