from django.urls import path
from .views import (
    ShortTermBookingCreateView,
    ShortTermBookingDetailView,
    ConfirmBookingView
)

urlpatterns = [
    path('bookings/', ShortTermBookingCreateView.as_view(),
         name='shortterm-booking-create'),
    path('bookings/<int:pk>/', ShortTermBookingDetailView.as_view(),
         name='shortterm-booking-detail'),
    path('confirm/<uuid:token>/', ConfirmBookingView.as_view(),
         name='shortterm-booking-confirm'),
]
