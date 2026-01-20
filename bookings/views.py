from datetime import timedelta
from rest_framework import generics, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from rest_framework.response import Response
from rest_framework.views import APIView
from django.shortcuts import get_object_or_404
from django.core.exceptions import ValidationError as DjangoValidationError

from .models import ShortTermBooking, ShortTermBookingNight
from .serializers import (
    ShortTermBookingSerializer,
    ShortTermBookingDiscountSerializer,
    ShortTermBookingStatusSerializer
)


class ShortTermBookingCreateView(generics.ListCreateAPIView):
    """
    API view to retrieve and create short term bookings.

    GET: List all bookings (admin only)
    POST: Create new booking (anyone)
    """
    queryset = ShortTermBooking.objects.all()
    serializer_class = ShortTermBookingSerializer

    def get_queryset(self):
        """Filter bookings based on user permissions"""
        if self.request.user.is_staff:
            # Admin sees all bookings
            return ShortTermBooking.objects.all().select_related(
                'listing',
                'user',
                'discount_applied_by'
            ).order_by('-created_at')
        elif self.request.user.is_authenticated:
            # Users see only their own bookings
            return ShortTermBooking.objects.filter(
                user=self.request.user
            ).select_related('listing').order_by('-created_at')
        else:
            # Anonymous users see nothing on list
            return ShortTermBooking.objects.none()

    def perform_create(self, serializer):
        """Set user if authenticated"""
        booking = serializer.save()

        if self.request.user.is_authenticated:
            booking.user = self.request.user
            booking.save()


class ShortTermBookingDetailView(generics.RetrieveUpdateDestroyAPIView):
    """
    API view to retrieve, update or delete a short term booking.

    GET: Anyone with booking reference can view
    PUT/PATCH: Only pending bookings can be modified
    DELETE: Admin only
    """
    queryset = ShortTermBooking.objects.all()
    serializer_class = ShortTermBookingSerializer

    def get_queryset(self):
        """Optimize with related data"""
        return ShortTermBooking.objects.select_related(
            'listing',
            'user',
            'discount_applied_by'
        ).prefetch_related('nights')

    def update(self, request, *args, **kwargs):
        """Prevent updates to confirmed bookings"""
        instance = self.get_object()

        if instance.status not in ['pending']:
            return Response(
                {
                    'error': (
                        f'Cannot modify booking in'
                        f'"{instance.get_status_display()}" status')

                },
                status=status.HTTP_400_BAD_REQUEST
            )

        return super().update(request, *args, **kwargs)


class UnavailableDatesView(APIView):
    """
    Returns blocked date ranges based on booking nights.
    Used by frontend calendar to show unavailable dates.
    """

    def get(self, request, *args, **kwargs):
        listing_id = request.query_params.get("listing")
        if not listing_id:
            return Response(
                {"error": "Missing 'listing' parameter"},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Get all booked nights for this listing (exclude cancelled)
        nights = (
            ShortTermBookingNight.objects
            .filter(
                booking__listing_id=listing_id
            )
            .exclude(booking__status='cancelled')
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


# ============================================================================
# ADMIN-ONLY ENDPOINTS FOR DISCOUNT MANAGEMENT
# ============================================================================

@api_view(['POST'])
@permission_classes([IsAuthenticated, IsAdminUser])
def apply_discount_to_booking(request, booking_id):
    """
    Admin-only endpoint to apply discount to a booking.

    POST /api/bookings/{id}/apply-discount/
    Body: {
        "discount_type": "percentage" | "fixed",
        "discount_value": 10.00,
        "discount_reason": "Early bird discount" (optional)
    }
    """
    booking = get_object_or_404(ShortTermBooking, pk=booking_id)

    # Validate discount data
    serializer = ShortTermBookingDiscountSerializer(data=request.data)
    if not serializer.is_valid():
        return Response(
            serializer.errors,
            status=status.HTTP_400_BAD_REQUEST
        )

    # Check if booking can have discount
    if not booking.can_apply_discount:
        return Response(
            {
                'error': (
                    f'Cannot apply discount to booking in'
                    f' "{booking.get_status_display()}" status'
                )
            },
            status=status.HTTP_400_BAD_REQUEST
        )

    # Apply discount
    try:
        booking.apply_discount(
            discount_type=serializer.validated_data['discount_type'],
            discount_value=serializer.validated_data['discount_value'],
            reason=serializer.validated_data.get('discount_reason', ''),
            applied_by=request.user
        )
        booking.save()

        # Return updated booking
        response_serializer = ShortTermBookingSerializer(booking)
        return Response(
            {
                'message': 'Discount applied successfully',
                'booking': response_serializer.data
            },
            status=status.HTTP_200_OK
        )

    except DjangoValidationError as e:
        return Response(
            {'error': str(e)},
            status=status.HTTP_400_BAD_REQUEST
        )


@api_view(['POST'])
@permission_classes([IsAuthenticated, IsAdminUser])
def remove_discount_from_booking(request, booking_id):
    """
    Admin-only endpoint to remove discount from a booking.

    POST /api/bookings/{id}/remove-discount/
    """
    booking = get_object_or_404(ShortTermBooking, pk=booking_id)

    if not booking.has_discount:
        return Response(
            {'error': 'This booking has no discount to remove'},
            status=status.HTTP_400_BAD_REQUEST
        )

    # Remove discount
    booking.remove_discount()
    booking.save()

    # Return updated booking
    serializer = ShortTermBookingSerializer(booking)
    return Response(
        {
            'message': 'Discount removed successfully',
            'booking': serializer.data
        },
        status=status.HTTP_200_OK
    )


@api_view(['PATCH'])
@permission_classes([IsAuthenticated, IsAdminUser])
def update_booking_status(request, booking_id):
    """
    Admin-only endpoint to update booking status.

    PATCH /api/bookings/{id}/status/
    Body: {
        "status": "confirmed" | "checked_in" | "completed" | "cancelled"
    }
    """
    booking = get_object_or_404(ShortTermBooking, pk=booking_id)

    # Validate status
    serializer = ShortTermBookingStatusSerializer(data=request.data)
    if not serializer.is_valid():
        return Response(
            serializer.errors,
            status=status.HTTP_400_BAD_REQUEST
        )

    new_status = serializer.validated_data['status']
    old_status = booking.status

    # Update status
    booking.status = new_status

    # Sync admin_confirmed for backward compatibility
    if new_status == 'confirmed':
        booking.admin_confirmed = True
    elif new_status in ['pending', 'cancelled']:
        booking.admin_confirmed = False

    try:
        booking.save()

        # Return updated booking
        response_serializer = ShortTermBookingSerializer(booking)
        return Response(
            {
                'message': (f'Status updated from "{old_status}"'
                            f' to "{new_status}"'),
                'booking': response_serializer.data
            },
            status=status.HTTP_200_OK
        )

    except DjangoValidationError as e:
        return Response(
            {'error': str(e)},
            status=status.HTTP_400_BAD_REQUEST
        )


@api_view(['GET'])
@permission_classes([IsAuthenticated, IsAdminUser])
def booking_statistics(request):
    """
    Admin-only endpoint for booking statistics.

    GET /api/bookings/statistics/
    """
    from django.db.models import Sum, Avg

    stats = {
        'total_bookings': ShortTermBooking.objects.count(),
        'by_status': {
            status_code: ShortTermBooking.objects.filter(
                status=status_code).count()
            for status_code, _ in ShortTermBooking.STATUS_CHOICES
        },
        'with_discount': ShortTermBooking.objects.filter(
            discount_type__isnull=False
        ).count(),
        'total_revenue': ShortTermBooking.objects.exclude(
            status='cancelled'
        ).aggregate(
            total=Sum('total_price')
        )['total'] or 0,
        'total_discounts_given': ShortTermBooking.objects.aggregate(
            total=Sum('discount_amount')
        )['total'] or 0,
        'average_booking_value': ShortTermBooking.objects.exclude(
            status='cancelled'
        ).aggregate(
            avg=Avg('total_price')
        )['avg'] or 0,
    }

    return Response(stats)
