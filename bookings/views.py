from rest_framework import generics
from .models import ShortTermBooking
from .serializers import ShortTermBookingSerializer
from rest_framework.response import Response
from rest_framework.views import APIView


class ShortTermBookingCreateView(generics.ListCreateAPIView):
    """
    API view to retrieve and create short term bookings.
    """
    queryset = ShortTermBooking.objects.all()
    serializer_class = ShortTermBookingSerializer

    def perform_create(self, serializer):
        booking = serializer.save()

        if self.request.user.is_authenticated:
            booking.user = self.request.user
            booking.save()


class ShortTermBookingDetailView(generics.RetrieveUpdateDestroyAPIView):
    """
    API view to retrieve, update or delete a short term booking.
    """
    queryset = ShortTermBooking.objects.all()
    serializer_class = ShortTermBookingSerializer


class UnavailableDatesView(APIView):

    def get(self, request, *args, **kwargs):
        listing_id = request.query_params.get("listing")
        if not listing_id:
            return Response(
                {"error": "Missing 'listing' parameter"},
                status=400
            )

        bookings = ShortTermBooking.objects.filter(listing_id=listing_id)

        data = [
            {
                "check_in": booking.check_in,
                "check_out": booking.check_out
            }
            for booking in bookings
        ]
        return Response(data)
