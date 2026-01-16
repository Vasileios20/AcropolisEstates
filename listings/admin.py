from django.contrib import admin
from django.utils.html import format_html

from listings.models import (
    Listing,
    Images,
    Amenities,
    Owner,
    OwnerFile,
    ShortTermListing,
    ShortTermImages,
    ShortTermSeasonalPrice
)
from .forms import ImagesAdminForm, ListingLocationAdminForm


# ============================================================================
# INLINE ADMIN CLASSES
# ============================================================================

class ShortTermSeasonalPriceInline(admin.TabularInline):
    """Inline editor for seasonal pricing periods."""
    model = ShortTermSeasonalPrice
    extra = 0
    ordering = ("start_date",)
    fields = ('start_date', 'end_date', 'price')
    verbose_name = "Seasonal Price"
    verbose_name_plural = "Seasonal Pricing"

    def get_formset(self, request, obj=None, **kwargs):
        """Customize formset display."""
        formset = super().get_formset(request, obj, **kwargs)
        formset.can_delete = True
        return formset


class OwnerFileInline(admin.TabularInline):
    """Inline editor for owner documents."""
    model = OwnerFile
    extra = 1
    fields = ('file', 'uploaded_at')
    readonly_fields = ('uploaded_at',)


# ============================================================================
# LISTING ADMINS
# ============================================================================

@admin.register(Listing)
class ListingAdmin(admin.ModelAdmin):
    """Admin interface for long-term property listings."""
    form = ListingLocationAdminForm
    change_form_template = "admin/listings/shortterm_change_form.html"

    list_display = (
        "id",
        "type",
        "sub_type",
        "sale_type",
        "price",
        "approved",
        "agent_name",
        "featured"
    )

    list_filter = (
        "agent_name",
        "type",
        "sale_type",
        "approved",
        "featured"
    )

    search_fields = (
        "type",
        "description",
        "agent_name__username",
        "municipality_gr"
    )

    list_per_page = 25
    actions = ["approve_listings", "make_featured"]

    fieldsets = (
        ('Basic Information', {
            'fields': (
                'agent_name',
                'listing_owner',
                'sale_type',
                'type',
                'sub_type',
                'approved',
                'featured',
            ),
        }),
        ('Location', {
            'fields': (
                'language',
                'region_display',
                'county_display',
                'municipality_display',
                'municipality_gr',
                'region_id',
                'county_id',
                'municipality_id',
                'address_street',
                'address_street_gr',
                'address_number',
                'postcode',
                'latitude',
                'longitude',
            ),
        }),
        ('Property Details', {
            'fields': (
                'description',
                'description_gr',
                'floor_area',
                'bedrooms',
                'bathrooms',
                'wc',
                'kitchens',
                'living_rooms',
                'floor',
                'heating_system',
                'energy_class',
            ),
        }),
        ('Additional Information', {
            'fields': (
                'construction_year',
                'renovation_year',
                'availability',
                'opening_frames',
                'type_of_glass',
                'orientation',
                'zone',
                'floor_type',
            ),
            'classes': ('collapse',)
        }),
        ('Distances', {
            'fields': (
                'distance_from_sea',
                'distance_from_city',
                'distance_from_airport',
                'distance_from_village',
                'distance_from_port',
            ),
            'classes': ('collapse',)
        }),
        ('Pricing', {
            'fields': (
                'price',
                'currency',
                'service_charge',
            ),
        }),
        ('Building Coefficients', {
            'fields': (
                'cover_coefficient',
                'building_coefficient',
                'length_of_facade',
            ),
            'classes': ('collapse',)
        }),
        ('Amenities', {
            'fields': ('amenities',),
            'classes': ('collapse',)
        }),
    )

    def get_form(self, request, obj=None, **kwargs):
        """Attach request to form for language detection."""
        form = super().get_form(request, obj, **kwargs)
        form.request = request
        return form

    def render_change_form(self, request, context, *args, **kwargs):
        """Inject location JSON data into template."""
        form = context['adminform'].form
        if hasattr(form, "render_location_json"):
            context["location_json_script"] = form.render_location_json()
        return super().render_change_form(request, context, *args, **kwargs)

    @admin.action(description="Approve selected listings")
    def approve_listings(self, request, queryset):
        """Bulk approve listings."""
        updated = queryset.update(approved=True)
        self.message_user(
            request,
            f"{updated} listing(s) successfully approved."
        )

    @admin.action(description="Mark as featured")
    def make_featured(self, request, queryset):
        """Bulk mark listings as featured."""
        updated = queryset.update(featured=True)
        self.message_user(
            request,
            f"{updated} listing(s) marked as featured."
        )


@admin.register(ShortTermListing)
class ShortTermListingAdmin(admin.ModelAdmin):
    """Admin interface for short-term rental listings."""
    form = ListingLocationAdminForm
    change_form_template = "admin/listings/shortterm_change_form.html"
    inlines = [ShortTermSeasonalPriceInline]

    list_display = (
        'id',
        'agent_name',
        'municipality_gr',
        'price',
        'display_vat_rate',
        'approved',
        'created_on'
    )

    list_filter = (
        'approved',
        'region_id',
        'created_on',
    )

    search_fields = (
        'agent_name__username',
        'municipality_gr',
        'description',
        'description_gr'
    )

    readonly_fields = ('created_on', 'updated_on')

    fieldsets = (
        ('Basic Information', {
            'fields': (
                'agent_name',
                'listing_owner',
                'approved',
            ),
            'classes': ('wide',)
        }),
        ('Language & Location', {
            'fields': (
                'language',
                'region_display',
                'county_display',
                'municipality_display',
                'municipality_gr',
                'region_id',
                'county_id',
                'municipality_id',
                'address_street',
                'address_number',
                'postcode',
                'latitude',
                'longitude',
            ),
            'classes': ('wide',),
            'description': (
                'Select language first to load location data '
                'in the correct language.'
            )
        }),
        ('Property Description', {
            'fields': (
                'description',
                'description_gr',
            ),
            'classes': ('wide',)
        }),
        ('Property Details', {
            'fields': (
                'bedrooms',
                'bathrooms',
                'wc',
                'kitchens',
                'living_rooms',
                'floor',
                'floor_area',
            ),
            'classes': ('wide',)
        }),
        ('Guest Capacity', {
            'fields': (
                'max_guests',
                'max_adults',
                'max_children',
            ),
            'classes': ('collapse',)
        }),
        ('Pricing', {
            'fields': (
                'price',
                'currency',
            ),
            'classes': ('wide',),
            'description': (
                'Base nightly rate. Use inline forms below for '
                'seasonal pricing and special dates.'
            )
        }),
        ('Taxes & Fees', {
            'fields': (
                'vat_rate',
                'municipality_tax_rate',
                'climate_crisis_fee_per_night',
                'cleaning_fee',
                'service_fee_rate',
            ),
            'classes': ('collapse',),
            'description': format_html(
                '<div style="background: #000; padding: 10px; '
                'border-radius: 4px; margin-bottom: 10px;">'
                '<strong>📋 Tax Configuration Guide:</strong><br>'
                '<ul style="margin: 5px 0; padding-left: 20px;">'
                '<li><strong>VAT Rate:</strong> Standard is 13% '
                'for short-term rentals in Greece</li>'
                '<li><strong>Municipality Tax:</strong> 0.5% - 4% '
                '(varies by location and property type)</li>'
                '<li><strong>Climate Crisis Fee:</strong> '
                '€0.50 - €10.00 per night'
                '<ul style="font-size: 0.9em; color: #666;">'
                '<li>€0.50/night: 1-2 star hotels, rooms to let</li>'
                '<li>€1.50/night: 3-star hotels</li>'
                '<li>€3.00/night: 4-star hotels</li>'
                '<li>€4.00/night: 5-star hotels</li>'
                '<li>€10.00/night: Luxury suites</li>'
                '</ul></li>'
                '<li><strong>Cleaning Fee:</strong> '
                'One-time charge (optional)</li>'
                '<li><strong>Service Fee:</strong> '
                'Platform/booking commission % (optional)</li>'
                '</ul>'
                '<em style="color: #856404;">⚠️ Consult with your '
                'accountant for the correct rates for your property type.'
                '</em></div>'
            )
        }),
        ('Amenities', {
            'fields': ('amenities',),
            'classes': ('collapse',)
        }),
        ('Metadata', {
            'fields': ('created_on', 'updated_on'),
            'classes': ('collapse',)
        }),
    )

    def get_form(self, request, obj=None, **kwargs):
        """Attach request to form for language detection."""
        form = super().get_form(request, obj, **kwargs)
        form.request = request
        return form

    def render_change_form(self, request, context, *args, **kwargs):
        """Inject location JSON data into template."""
        form = context['adminform'].form
        if hasattr(form, "render_location_json"):
            context["location_json_script"] = form.render_location_json()
        return super().render_change_form(request, context, *args, **kwargs)

    def display_vat_rate(self, obj):
        """Display VAT rate with percentage sign."""
        return f"{obj.vat_rate}%"
    display_vat_rate.short_description = "VAT Rate"

    def save_model(self, request, obj, form, change):
        """Add custom logic before saving if needed."""
        super().save_model(request, obj, form, change)

    class Media:
        css = {
            'all': ('listings/admin_custom.css',)
        }
        js = ('listings/chained_location.js',)


# ============================================================================
# OTHER ADMINS
# ============================================================================

@admin.register(Images)
class ImagesAdmin(admin.ModelAdmin):
    """Admin interface for listing images."""
    form = ImagesAdminForm
    list_display = ("id", "listing", "is_first", "order")
    list_filter = ("listing", "is_first")
    search_fields = ("listing__id",)
    list_per_page = 25
    ordering = ('listing', 'order')


@admin.register(Amenities)
class AmenitiesAdmin(admin.ModelAdmin):
    """Admin interface for property amenities."""
    list_display = ("id", "name", "icon")
    search_fields = ("name",)
    list_per_page = 50
    ordering = ('name',)

    def icon(self, obj):
        """Display icon if available."""
        # You can add icon field to Amenities model
        return "🏠"  # Placeholder
    icon.short_description = "Icon"


@admin.register(Owner)
class OwnerAdmin(admin.ModelAdmin):
    """Admin interface for property owners."""
    inlines = [OwnerFileInline]

    list_display = (
        "id",
        "full_name",
        "email",
        "phone",
        "phone_2",
        "file_count"
    )

    fields = (
        "first_name",
        "last_name",
        "email",
        "phone",
        "phone_2"
    )

    search_fields = (
        "first_name",
        "last_name",
        "email",
        "phone"
    )

    list_per_page = 50

    def full_name(self, obj):
        """Display full name."""
        return f"{obj.first_name} {obj.last_name}"
    full_name.short_description = "Name"

    def file_count(self, obj):
        """Display count of uploaded files."""
        count = obj.files.count()
        if count > 0:
            return format_html(
                '<span style="color: green;">📎 {}</span>',
                count
            )
        return format_html('<span style="color: gray;">-</span>')
    file_count.short_description = "Files"


@admin.register(OwnerFile)
class OwnerFileAdmin(admin.ModelAdmin):
    """Admin interface for owner files."""
    list_display = ("id", "owner", "file_link", "uploaded_at")
    list_filter = ("uploaded_at",)
    search_fields = ("owner__first_name", "owner__last_name")
    readonly_fields = ("uploaded_at",)

    def file_link(self, obj):
        """Display clickable file link."""
        if obj.file:
            return format_html(
                '<a href="{}" target="_blank">View File</a>',
                obj.file.url
            )
        return "No file"
    file_link.short_description = "File"


@admin.register(ShortTermImages)
class ShortTermImagesAdmin(admin.ModelAdmin):
    """Admin interface for short-term listing images."""
    list_display = ("id", "listing", "is_first", "order")
    list_filter = ("listing", "is_first")
    search_fields = ("listing__id",)
    ordering = ('listing', 'order')
