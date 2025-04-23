from django.contrib import admin
from .models import ShortTermBooking


@admin.register(ShortTermBooking)
class ShortTermBookingAdmin(admin.ModelAdmin):
    list_display = ('listing', 'first_name', 'last_name', 'email', 'check_in',
                    'check_out', 'created_at', 'reference_number',
                    'admin_confirmed')
    list_filter = ('listing', 'user',
                   'admin_confirmed', 'check_in')
    search_fields = ('first_name', 'last_name',
                     'email', 'listing__description')
    ordering = ('-created_at',)
    readonly_fields = ('created_at', 'reference_number')

    actions = ['mark_as_admin_confirmed']

    def mark_as_admin_confirmed(self, request, queryset):
        """
        Custom action to mark selected bookings as admin confirmed.
        """
        for booking in queryset:
            booking.admin_confirmed = True
            booking.save()
        self.message_user(
            request, f"{queryset.count()} bookings marked as admin confirmed.")
    mark_as_admin_confirmed.short_description = (
        "Mark selected bookings as admin confirmed"
    )
