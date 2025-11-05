from django.urls import path
from .views import (
    ShortTermBookingCreateView,
    ShortTermBookingDetailView,
    UnavailableDatesView,
)

urlpatterns = [
    path('bookings/', ShortTermBookingCreateView.as_view(),
         name='shortterm-booking-create'),
    path('bookings/<int:pk>/', ShortTermBookingDetailView.as_view(),
         name='shortterm-booking-detail'),
    path("bookings/unavailable-dates/",
         UnavailableDatesView.as_view(), name="unavailable-dates"),
]
