from rest_framework import generics
from .models import ShortTermBooking
from .serializers import ShortTermBookingSerializer
from django.core.mail import send_mail
from django.urls import reverse
from django.conf import settings
from rest_framework.response import Response
from rest_framework.views import APIView
from django.utils.translation import get_language


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

        # build confirmation link
        confirm_url = self.request.build_absolute_uri(
            reverse('shortterm-booking-confirm',
                    kwargs={'token': str(booking.token)})
        )

        language = get_language()

        if language == 'el':
            subject = 'Επιβεβαίωση Κράτησης – Acropolis Estates'
            message = (
                f"Γεια σας {booking.first_name} {booking.last_name},\n\n"
                f"Σας ευχαριστούμε για την κράτησή σας από "
                f"{booking.check_in} έως {booking.check_out}.\n"
                f"Παρακαλούμε επιβεβαιώστε την κράτησή σας κάνοντας κλικ "
                f"στον παρακάτω σύνδεσμο:\n\n{confirm_url}"
            )
        else:
            subject = 'Confirm Your Booking – Acropolis Estates'
            message = (
                f"Hi {booking.first_name} {booking.last_name},\n\n"
                f"Thank you for your booking from "
                f"{booking.check_in} to {booking.check_out}.\n"
                f"Please confirm your booking by clicking "
                f"the link below:\n\n{confirm_url}"
            )

            send_mail(subject, message,
                      settings.DEFAULT_FROM_EMAIL, [booking.email])


class ShortTermBookingDetailView(generics.RetrieveUpdateDestroyAPIView):
    """
    API view to retrieve, update or delete a short term booking.
    """
    queryset = ShortTermBooking.objects.all()
    serializer_class = ShortTermBookingSerializer


class ConfirmBookingView(APIView):
    def get(self, request, token):
        try:
            booking = ShortTermBooking.objects.get(token=token)
            if booking.confirmed:
                return Response({'message': 'Booking already confirmed.'})
            booking.confirmed = True
            booking.save()
            return Response({'message': 'Booking confirmed successfully!'})
        except ShortTermBooking.DoesNotExist:
            return Response(
                {'error': 'Invalid or expired confirmation link.'},
                status=404
            )


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
