from django.contrib import admin
from .models import ShortTermBooking, ShortTermBookingNight


class ShortTermBookingNightInline(admin.TabularInline):
    model = ShortTermBookingNight
    extra = 0
    readonly_fields = ("date", "price")
    can_delete = False

    def has_add_permission(self, request, obj=None):
        return False

    def has_change_permission(self, request, obj=None):
        return False


@admin.register(ShortTermBooking)
class ShortTermBookingAdmin(admin.ModelAdmin):
    inlines = [ShortTermBookingNightInline]

    list_display = ('listing', 'first_name', 'last_name', 'email', 'check_in',
                    'check_out', 'created_at', 'reference_number',
                    'admin_confirmed', 'total_nights', 'total_price')
    list_filter = ('listing', 'user',
                   'admin_confirmed', 'check_in')
    search_fields = ('first_name', 'last_name',
                     'email', 'listing__description')
    ordering = ('-created_at',)
    readonly_fields = (
        'created_at',
        'reference_number',
        'total_price',
        'total_nights',
    )

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

    def get_readonly_fields(self, request, obj=None):
        if obj and obj.admin_confirmed:
            return self.readonly_fields + (
                'listing',
                'check_in',
                'check_out',
                'adults',
                'children',
                'total_price',
                'total_nights',
                'reference_number',
                'created_at',
            )
        return self.readonly_fields
