from django.contrib import admin
from django.utils.html import format_html
from django.utils.safestring import mark_safe
from django.urls import reverse, path
from django.contrib import messages
from django.shortcuts import redirect, get_object_or_404
from django.core.exceptions import ValidationError
from .models import ShortTermBooking, ShortTermBookingNight
from decimal import Decimal
from .admin_helpers import render_discount_form
from . import admin_templates


class ShortTermBookingNightInline(admin.TabularInline):
    model = ShortTermBookingNight
    extra = 0
    can_delete = False
    fields = ('date', 'price')
    readonly_fields = ('date', 'price')

    def has_add_permission(self, request, obj=None):
        # Discount nights are created automatically
        return False


@admin.register(ShortTermBooking)
class ShortTermBookingAdmin(admin.ModelAdmin):

    list_display = (
        'reference_number',
        'listing_link',
        'guest_name',
        'check_in',
        'check_out',
        'total_nights',
        'status_badge',
        'discount_badge',
        'total_price_display',
    )

    list_filter = (
        'status',
        'check_in',
        'created_at',
        'discount_type'
    )

    search_fields = (
        'reference_number',
        'first_name',
        'last_name',
        'email'
    )

    readonly_fields = (
        'reference_number',
        'user',
        'created_at',
        'updated_at',
        'price_breakdown_display',
        'discount_controls',
        'discount_applied_by',
        'discount_applied_at',
        'total_nights',
        'subtotal',
        'discount_amount',
        'vat',
        'municipality_tax',
        'climate_crisis_fee',
        'cleaning_fee',
        'service_fee',
        'total_price',
    )

    fieldsets = (
        ('Booking', {
            'fields': (
                'reference_number',
                'listing',
                'status',
                'user',
                'admin_confirmed',
            )
        }),
        ('Guest', {
            'fields': (
                'first_name',
                'last_name',
                'email',
                'phone_number',
                'language'
            )
        }),
        ('Stay', {
            'fields': (
                'check_in',
                'check_out',
                'total_nights',
                'adults',
                'children',
                'message'
            )
        }),
        ('Pricing', {
            'fields': ('price_breakdown_display',)
        }),
        ('Discount', {
            'fields': ('discount_controls',)
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )

    inlines = [ShortTermBookingNightInline]

    actions = [
        'confirm_bookings',
        'apply_discount_action',
        'remove_discount_action'
    ]

    def get_urls(self):
        """Add custom URLs for discount management"""
        urls = super().get_urls()
        custom_urls = [
            path(
                '<int:booking_id>/discount/',
                self.admin_site.admin_view(
                    self.discount_view
                ),
                name='bookings_shorttermbooking_discount'
            ),
        ]
        return custom_urls + urls

    def discount_view(self, request, booking_id):
        """Handle discount application and removal - SIMPLEST VERSION"""
        booking = get_object_or_404(ShortTermBooking, pk=booking_id)

        if request.method == 'POST':
            action = request.POST.get('action')

            if action == 'remove':
                # Use the model's built-in remove_discount method
                booking.remove_discount()
                booking.save()

                messages.success(
                    request,
                    (
                        f'✅ Discount removed! New total: '
                        f'{booking.listing.currency}{booking.total_price:.2f}'
                    )
                )
                return redirect(
                    'admin:bookings_shorttermbooking_change',
                    booking_id
                )

            elif action == 'apply':
                try:
                    discount_type = request.POST.get('discount_type')
                    discount_value = Decimal(
                        request.POST.get(
                            'discount_value'
                        )
                    )
                    reason = request.POST.get('discount_reason', '')

                    booking.apply_discount(
                        discount_type,
                        discount_value,
                        reason,
                        request.user
                    )
                    booking.save()

                    messages.success(
                        request,
                        f'✅ Discount applied! New total: '
                        f'{booking.listing.currency}{booking.total_price:.2f}'
                    )
                    return redirect(
                        'admin:bookings_shorttermbooking_change',
                        booking_id
                    )
                except (ValueError, ValidationError) as e:
                    messages.error(request, f'❌ Error: {str(e)}')
                    return redirect(
                        'admin:bookings_shorttermbooking_change',
                        booking_id
                    )

        # GET request - show discount form
        return render_discount_form(request, booking)

    def discount_controls(self, obj):
        """Display discount controls with inline form"""
        if not obj.pk:
            return mark_safe(admin_templates.get_unsaved_booking_message())

        url = reverse(
            'admin:bookings_shorttermbooking_discount',
            args=[obj.pk]
        )

        html_parts = [
            admin_templates.get_discount_styles(),
            '<div class="discount-container">',
        ]

        # Show current discount if exists
        if obj.has_discount:
            html_parts.extend([
                admin_templates.get_active_discount_html(obj),
                admin_templates.get_remove_discount_button_html(obj, url),
            ])
        else:
            html_parts.append(admin_templates.get_no_discount_html())

        # Show form or blocked message
        if obj.can_apply_discount:
            html_parts.extend([
                admin_templates.get_discount_form_html(obj, url),
                admin_templates.get_discount_form_javascript(obj, url),
            ])
        else:
            html_parts.append(admin_templates.get_discount_blocked_html(obj))

        html_parts.append('</div>')

        return mark_safe(''.join(html_parts))

    discount_controls.short_description = 'Discount Management'

    def changeform_view(self, request, object_id=None,
                        form_url='', extra_context=None):
        """Capture request for CSRF token"""
        self._current_request = request
        return super().changeform_view(
            request,
            object_id,
            form_url,
            extra_context
        )

    def listing_link(self, obj):
        """Link to listing in admin"""
        url = reverse(
            'admin:listings_shorttermlisting_change',
            args=[obj.listing.pk]
        )
        return format_html('<a href="{}">{}</a>', url, obj.listing)

    listing_link.short_description = 'Listing'

    def guest_name(self, obj):
        """Display guest full name"""
        return f"{obj.first_name} {obj.last_name}"

    def status_badge(self, obj):
        """Display colored status badge"""
        colors = {
            'pending': '#ffc107',
            'confirmed': '#28a745',
            'checked_in': '#17a2b8',
            'completed': '#6c757d',
            'cancelled': '#dc3545'
        }
        color = colors.get(obj.status, '#6c757d')
        badge_html = (
            f'<span style="background: {color}; color: white; '
            f'padding: 3px 10px; border-radius: 3px;">'
            f'{obj.get_status_display().upper()}</span>'
        )
        return mark_safe(badge_html)

    status_badge.short_description = 'Status'

    def discount_badge(self, obj):
        """Display discount badge in list view"""
        if obj.has_discount:
            symbol = '%' if obj.discount_type == 'percentage' else '€'
            text = f"-{obj.discount_value}{symbol}"
            badge_html = (
                f'<span style="background: #e74c3c; color: white; '
                f'padding: 3px 8px; border-radius: 3px;">{text}</span>'
            )
            return mark_safe(badge_html)
        return '—'

    discount_badge.short_description = 'Discount'

    def total_price_display(self, obj):
        """Display total price with strikethrough if discounted"""
        if obj.has_discount:
            orig = float(
                obj.subtotal + obj.vat + obj.municipality_tax +
                obj.climate_crisis_fee + obj.cleaning_fee +
                obj.service_fee
            )
            price_html = (
                f'<span style="text-decoration: line-through; '
                f'color: #999;">€{orig:.2f}</span><br>'
                f'<strong style="color: #e74c3c;">'
                f'€{float(obj.total_price):.2f}</strong>'
            )
            return mark_safe(price_html)
        return f'€{float(obj.total_price):.2f}'

    total_price_display.short_description = 'Total'

    def price_breakdown_display(self, obj):
        """Display detailed price breakdown table"""
        html = '<table style="width: 100%; border-collapse: collapse;">'

        # Base price
        html += (
            f'<tr><td style="padding: 8px;">'
            f'Base ({obj.total_nights} nights)</td>'
            f'<td style="text-align: right;">{obj.listing.currency}'
            f'{obj.subtotal:.2f}</td></tr>'
        )

        # Discount row
        if obj.has_discount:
            html += (
                f'<tr style="background: #ffe6e6;">'
                f'<td style="padding: 8px; color: #e74c3c;">'
                f'<strong>Discount</strong></td>'
                f'<td style="text-align: right; color: #e74c3c;">'
                f'<strong>-{obj.listing.currency}'
                f'{obj.discount_amount:.2f}</strong></td></tr>'
            )
            html += (
                f'<tr><td style="padding: 8px;">'
                f'Subtotal After Discount</td>'
                f'<td style="text-align: right;">'
                f'€{obj.discounted_subtotal:.2f}</td></tr>'
            )

        # Taxes and fees
        html += (
            f'<tr><td style="padding: 8px;">'
            f'VAT ({round(obj.listing.vat_rate, 2)}%)</td>'
            f'<td style="text-align: right;">{obj.listing.currency}'
            f'{obj.vat:.2f}</td></tr>'
        )
        html += (
            f'<tr><td style="padding: 8px;">Municipality Tax</td>'
            f'<td style="text-align: right;">'
            f'{obj.listing.currency}{obj.municipality_tax:.2f}</td></tr>'
        )
        html += (
            f'<tr><td style="padding: 8px;">Climate Fee</td>'
            f'<td style="text-align: right;">'
            f'{obj.listing.currency}{obj.climate_crisis_fee:.2f}</td></tr>'
        )
        html += (
            f'<tr><td style="padding: 8px;">Cleaning Fee</td>'
            f'<td style="text-align: right;">'
            f'{obj.listing.currency}{obj.cleaning_fee:.2f}</td></tr>'
        )
        html += (
            f'<tr><td style="padding: 8px;">Service Fee</td>'
            f'<td style="text-align: right;">'
            f'{obj.listing.currency}{obj.service_fee:.2f}</td></tr>'
        )

        # Total
        html += (
            f'<tr style="border-top: 2px solid #333; '
            f'background: #f0f0f0;">'
            f'<td style="padding: 8px; color: #212529;">'
            f'<strong>TOTAL</strong></td>'
            f'<td style="text-align: right; color: #212529;">'
            f'<strong>{obj.listing.currency}{obj.total_price:.2f}'
            f'</strong></td></tr>'
        )
        html += '</table>'

        # Savings box
        if obj.has_discount:
            html += (
                f'<div style="margin-top: 15px; background: #d4edda; '
                f'padding: 10px; border-left: 4px solid #28a745; '
                f'color: #155724;"><strong>Savings: '
                f'{obj.listing.currency}{obj.discount_amount:.2f}'
                f'</strong></div>'
            )

        return mark_safe(html)

    price_breakdown_display.short_description = 'Breakdown'

    def confirm_bookings(self, request, queryset):
        """Bulk action to confirm bookings"""
        queryset.filter(status='pending').update(
            status='confirmed',
            admin_confirmed=True
        )
        self.message_user(request, 'Bookings confirmed.')

    confirm_bookings.short_description = "Confirm selected bookings"

    def apply_discount_action(self, request, queryset):
        """Bulk action to apply 10% discount"""
        count = 0
        eligible = queryset.filter(status__in=['pending', 'confirmed'])

        for booking in eligible:
            booking.apply_discount(
                'percentage',
                Decimal('10.00'),
                'Bulk 10% discount',
                request.user
            )
            booking.save()
            count += 1

        self.message_user(
            request,
            f'10%% discount applied to {count} bookings.'
        )

    apply_discount_action.short_description = (
        "Apply 10 percent discount to selected"
    )

    def remove_discount_action(self, request, queryset):
        """Bulk action to remove discounts"""
        count = 0
        discounted = queryset.filter(discount_type__isnull=False)

        for booking in discounted:
            # Clear discount fields manually
            booking.discount_type = None
            booking.discount_value = None
            booking.discount_amount = None
            booking.discount_reason = None
            booking.discount_applied_by = None
            booking.discount_applied_at = None

            # Recalculate
            booking.calculate_pricing()
            booking.save()
            count += 1

        self.message_user(
            request,
            f'Discount removed from {count} bookings.'
        )

    remove_discount_action.short_description = (
        "Remove discount from selected"
    )

    class Media:
        css = {
            'all': ('bookings/admin_custom.css',)
        }


@admin.register(ShortTermBookingNight)
class ShortTermBookingNightAdmin(admin.ModelAdmin):
    """Admin for individual booking nights"""

    list_display = ('booking_ref', 'date', 'price')
    readonly_fields = ('booking', 'date', 'price')

    def booking_ref(self, obj):
        """Display booking reference number"""
        return obj.booking.reference_number

    def has_add_permission(self, request):
        """Prevent manual addition of booking nights"""
        return False
