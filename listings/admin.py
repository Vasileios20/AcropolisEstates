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
    ShortTermSeasonalPrice,
    ListingFile,
    ShortTermListingFile,
)
from .forms import ImagesAdminForm, ListingLocationAdminForm
from decimal import Decimal


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
# FILE INLINE ADMINS
# ============================================================================

class ListingFileInline(admin.TabularInline):
    """Inline editor for listing files."""
    model = ListingFile
    extra = 1
    fields = ('file', 'file_type', 'description', 'uploaded_by', 'uploaded_at')
    readonly_fields = ('uploaded_at', 'uploaded_by')

    def get_formset(self, request, obj=None, **kwargs):
        """Customize formset display."""
        formset = super().get_formset(request, obj, **kwargs)
        formset.can_delete = True
        return formset


class ShortTermListingFileInline(admin.TabularInline):
    """Inline editor for short-term listing files."""
    model = ShortTermListingFile
    extra = 1
    fields = ('file', 'file_type', 'description', 'uploaded_by', 'uploaded_at')
    readonly_fields = ('uploaded_at', 'uploaded_by')

    def get_formset(self, request, obj=None, **kwargs):
        """Customize formset display."""
        formset = super().get_formset(request, obj, **kwargs)
        formset.can_delete = True
        return formset


# ============================================================================
# LISTING ADMINS
# ============================================================================

@admin.register(Listing)
class ListingAdmin(admin.ModelAdmin):
    """Admin interface for long-term property listings."""
    form = ListingLocationAdminForm
    change_form_template = "admin/listings/shortterm_change_form.html"
    inlines = [ListingFileInline]

    list_display = (
        "id",
        "type",
        "sub_type",
        "sale_type",
        "municipality_gr",
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
        "municipality_gr",
        "id"
    )

    readonly_fields = (
        'created_on',
        'updated_on',
        'municipality',
        'municipality_gr',
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
                'municipality',
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
    inlines = [ShortTermSeasonalPriceInline, ShortTermListingFileInline]

    list_display = (
        'id',
        'title_display',
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

    readonly_fields = (
        'created_on',
        'updated_on',
        'municipality',
        'municipality_gr',
    )

    fieldsets = (
        ('Basic Information', {
            'fields': (
                'agent_name',
                'listing_owner',
                'title',
                'title_gr',
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
                'municipality',
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
                'service_fee',
            ),
            'classes': ('collapse',)
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

    def title_display(self, obj):
        """Display title with fallback"""
        if obj.title:
            return obj.title
        return f"ST{str(obj.id).zfill(6)}"
    title_display.short_description = "Title"
    title_display.admin_order_field = 'title'

    def display_vat_rate(self, obj):
        """Display VAT rate with percentage sign and proper formatting."""
        if obj.vat_rate:
            # Normalize to 2 decimal places
            normalized = Decimal(str(obj.vat_rate)).quantize(Decimal('0.01'))
            return f"{normalized:.2f}%"
        return "-"
    display_vat_rate.short_description = "VAT Rate"

    def save_model(self, request, obj, form, change):
        """Normalize decimal fields before saving."""
        decimal_fields = [
            'vat_rate', 'municipality_tax_rate', 'service_fee',
            'climate_crisis_fee_per_night', 'cleaning_fee', 'price'
        ]

        for field_name in decimal_fields:
            value = getattr(obj, field_name, None)
            if value is not None:
                normalized = Decimal(str(value)).quantize(Decimal('0.01'))
                setattr(obj, field_name, normalized)

        super().save_model(request, obj, form, change)

    class Media:
        css = {
            'all': ('listings/admin_custom.css',)
        }
        js = ('listings/chained_location.js',)

    def get_queryset(self, request):
        """
        Filter queryset based on user permissions.
        Regular agents cannot see ShortTermListings.
        """
        qs = super().get_queryset(request)

        # Superusers can see all
        if request.user.is_superuser:
            return qs

        # Regular agents (staff but not superuser) cannot see
        # short-term listings
        if request.user.is_staff and not request.user.is_superuser:
            return qs.none()

        return qs

    def has_view_permission(self, request, obj=None):
        """Regular agents cannot view short-term listings."""
        if request.user.is_superuser:
            return True
        # Hide from non-superuser staff
        if request.user.is_staff:
            return False
        return False

    def has_change_permission(self, request, obj=None):
        """Regular agents cannot change short-term listings."""
        if request.user.is_superuser:
            return True
        return False

    def has_add_permission(self, request):
        """Regular agents cannot add short-term listings."""
        if request.user.is_superuser:
            return True
        return False

    def has_delete_permission(self, request, obj=None):
        """Regular agents cannot delete short-term listings."""
        if request.user.is_superuser:
            return True
        return False


# ============================================================================
# OTHER ADMINS
# ============================================================================

@admin.register(Images)
class ImagesAdmin(admin.ModelAdmin):
    """Admin interface for listing images."""
    form = ImagesAdminForm
    list_display = ("id", "listing", "is_first", "order", "description")
    list_filter = ("listing", "is_first")
    search_fields = ("listing__id",)
    list_per_page = 25
    ordering = ('listing', 'order')

    fieldsets = (
        ('Image Details', {
            'fields': (
                'listing',
                'url',
                'is_first',
                'order',
                'description',
            ),
        }),
    )


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

    fieldsets = (
        ('Image Details', {
            'fields': (
                'listing',
                'url',
                'is_first',
                'order',
                'description',
            ),
        }),
    )

    def get_queryset(self, request):
        """Regular agents cannot see short-term images."""
        qs = super().get_queryset(request)
        if request.user.is_superuser:
            return qs
        if request.user.is_staff and not request.user.is_superuser:
            return qs.none()
        return qs

    def has_view_permission(self, request, obj=None):
        return request.user.is_superuser

    def has_change_permission(self, request, obj=None):
        return request.user.is_superuser

    def has_add_permission(self, request):
        return request.user.is_superuser

    def has_delete_permission(self, request, obj=None):
        return request.user.is_superuser


# ============================================================================
# FILE ADMINS (Add at the end of the file)
# ============================================================================

@admin.register(ListingFile)
class ListingFileAdmin(admin.ModelAdmin):
    """Admin interface for listing files."""
    list_display = (
        'id',
        'listing',
        'file_name',
        'file_type_badge',
        'uploaded_by',
        'uploaded_at',
        'file_link'
    )
    list_filter = ('file_type', 'uploaded_at', 'uploaded_by')
    search_fields = (
        'listing__id',
        'file_name',
        'description',
        'uploaded_by__username'
    )
    readonly_fields = ('uploaded_at', 'file_name', 'uploaded_by')

    fieldsets = (
        ('File Information', {
            'fields': ('listing', 'file', 'file_name', 'file_type')
        }),
        ('Details', {
            'fields': ('description', 'uploaded_by', 'uploaded_at')
        }),
    )

    list_per_page = 25
    date_hierarchy = 'uploaded_at'

    def file_type_badge(self, obj):
        """Display file type as colored badge."""
        colors = {
            'offer': '#28a745',
            'contract': '#007bff',
            'inspection': '#ffc107',
            'note': '#6c757d',
            'legal': '#dc3545',
        }
        color = colors.get(obj.file_type, '#17a2b8')
        return format_html(
            '<span style="background-color: {}; color: white; '
            'padding: 3px 8px; border-radius: 3px; '
            'font-size: 11px;">{}</span>',
            color,
            obj.get_file_type_display()
        )
    file_type_badge.short_description = 'Type'

    def file_link(self, obj):
        """Display clickable download link."""
        if obj.file:
            return format_html(
                '<a href="{}" target="_blank" download>📥 Download</a>',
                obj.file.url
            )
        return format_html('<span style="color: gray;">No file</span>')
    file_link.short_description = 'Download'

    def save_model(self, request, obj, form, change):
        """Auto-set uploaded_by to current user if not set."""
        if not obj.uploaded_by:
            obj.uploaded_by = request.user
        super().save_model(request, obj, form, change)


@admin.register(ShortTermListingFile)
class ShortTermListingFileAdmin(admin.ModelAdmin):
    """Admin interface for short-term listing files."""
    list_display = (
        'id',
        'listing',
        'file_name',
        'file_type_badge',
        'uploaded_by',
        'uploaded_at',
        'file_link'
    )
    list_filter = ('file_type', 'uploaded_at', 'uploaded_by')
    search_fields = (
        'listing__id',
        'file_name',
        'description',
        'uploaded_by__username'
    )
    readonly_fields = ('uploaded_at', 'file_name', 'uploaded_by')

    fieldsets = (
        ('File Information', {
            'fields': ('listing', 'file', 'file_name', 'file_type')
        }),
        ('Details', {
            'fields': ('description', 'uploaded_by', 'uploaded_at')
        }),
    )

    list_per_page = 25
    date_hierarchy = 'uploaded_at'

    def file_type_badge(self, obj):
        """Display file type as colored badge."""
        colors = {
            'offer': '#28a745',
            'contract': '#007bff',
            'inspection': '#ffc107',
            'note': '#6c757d',
            'legal': '#dc3545',
        }
        color = colors.get(obj.file_type, '#17a2b8')
        return format_html(
            '<span style="background-color: {}; color: white; '
            'padding: 3px 8px; border-radius: 3px; '
            'font-size: 11px;">{}</span>',
            color,
            obj.get_file_type_display()
        )
    file_type_badge.short_description = 'Type'

    def file_link(self, obj):
        """Display clickable download link."""
        if obj.file:
            return format_html(
                '<a href="{}" target="_blank" download>📥 Download</a>',
                obj.file.url
            )
        return format_html('<span style="color: gray;">No file</span>')
    file_link.short_description = 'Download'

    def save_model(self, request, obj, form, change):
        """Auto-set uploaded_by to current user if not set."""
        if not obj.uploaded_by:
            obj.uploaded_by = request.user
        super().save_model(request, obj, form, change)

    def get_queryset(self, request):
        """
        Filter queryset based on user permissions.
        Regular agents cannot see ShortTermListingFiles.
        """
        qs = super().get_queryset(request)

        # Superusers can see all
        if request.user.is_superuser:
            return qs

        # Regular agents (staff but not superuser) cannot see short-term files
        if request.user.is_staff and not request.user.is_superuser:
            return qs.none()

        return qs

    def has_view_permission(self, request, obj=None):
        """Regular agents cannot view short-term listing files."""
        if request.user.is_superuser:
            return True
        return False

    def has_change_permission(self, request, obj=None):
        """Regular agents cannot change short-term listing files."""
        if request.user.is_superuser:
            return True
        return False

    def has_add_permission(self, request):
        """Regular agents cannot add short-term listing files."""
        if request.user.is_superuser:
            return True
        return False

    def has_delete_permission(self, request, obj=None):
        """Regular agents cannot delete short-term listing files."""
        if request.user.is_superuser:
            return True
        return False
