from datetime import timedelta
from rest_framework import generics
from .models import ShortTermBooking, ShortTermBookingNight
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
    """
    Backward-compatible endpoint.
    Returns blocked date ranges based on booking nights.
    """

    def get(self, request, *args, **kwargs):
        listing_id = request.query_params.get("listing")
        if not listing_id:
            return Response(
                {"error": "Missing 'listing' parameter"},
                status=400
            )

        nights = (
            ShortTermBookingNight.objects
            .filter(booking__listing_id=listing_id)
            .select_related("booking")
            .order_by("date")
        )

        # Convert nights → ranges (frontend-friendly)
        ranges = []
        current_start = None
        last_date = None

        for night in nights:
            if current_start is None:
                current_start = night.date
                last_date = night.date
                continue

            if night.date == last_date + timedelta(days=1):
                last_date = night.date
            else:
                ranges.append({
                    "check_in": current_start,
                    "check_out": last_date + timedelta(days=1),
                })
                current_start = night.date
                last_date = night.date

        if current_start:
            ranges.append({
                "check_in": current_start,
                "check_out": last_date + timedelta(days=1),
            })

        return Response(ranges)
