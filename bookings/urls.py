# bookings/urls.py
from django.urls import path
from .views import (
    ShortTermBookingCreateView,
    ShortTermBookingDetailView,
    UnavailableDatesView,
    apply_discount_to_booking,
    remove_discount_from_booking,
    update_booking_status,
    booking_statistics,
)

urlpatterns = [
    # Public endpoints
    path(
        'short-term-bookings/',
        ShortTermBookingCreateView.as_view(),
        name='short-term-booking-list-create'
    ),
    path(
        'short-term-bookings/<int:pk>/',
        ShortTermBookingDetailView.as_view(),
        name='short-term-booking-detail'
    ),
    path(
        'short-term-bookings/unavailable-dates/',
        UnavailableDatesView.as_view(),
        name='unavailable-dates'
    ),

    # Admin-only discount endpoints
    path(
        'short-term-bookings/<int:booking_id>/apply-discount/',
        apply_discount_to_booking,
        name='apply-discount'
    ),
    path(
        'short-term-bookings/<int:booking_id>/remove-discount/',
        remove_discount_from_booking,
        name='remove-discount'
    ),

    # Admin-only status management
    path(
        'short-term-bookings/<int:booking_id>/status/',
        update_booking_status,
        name='update-booking-status'
    ),

    # Admin-only statistics
    path(
        'short-term-bookings/statistics/',
        booking_statistics,
        name='booking-statistics'
    ),
]
