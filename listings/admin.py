from django.contrib import admin
from listings.models import (
    Listing, Images, Amenities, Owner, OwnerFile,
    ShortTermListing, ShortTermImages, ShortTermPriceOverride,
    ShortTermSeasonalPrice
)
from django.utils.html import format_html
from .forms import ImagesAdminForm, ListingLoacationAdminForm
from django.core.exceptions import ValidationError
from django import forms


@admin.register(Listing)
class ListingAdmin(admin.ModelAdmin):
    form = ListingLoacationAdminForm
    change_form_template = "admin/listings/shortterm_change_form.html"

    def get_form(self, request, obj=None, **kwargs):
        form = super().get_form(request, obj, **kwargs)
        form.request = request  # ✅ Attach request manually
        return form

    def render_change_form(self, request, context, *args, **kwargs):
        form = context['adminform'].form
        if hasattr(form, "render_location_json"):
            context["location_json_script"] = form.render_location_json()
        return super().render_change_form(request, context, *args, **kwargs)

    def get_fields(self, request, obj=None):
        return [
            "agent_name",
            "listing_owner",
            "sale_type",
            "type",
            "sub_type",
            "language",
            "region_display",
            "county_display",
            "municipality_display",
            "municipality_gr",
            "region_id",
            "county_id",
            "municipality_id",
            "latitude",
            "longitude",
            "description",
            "description_gr",
            "address_number",
            "address_street",
            "address_street_gr",
            "postcode",
            "price",
            "currency",
            "floor_area",
            "bedrooms",
            "floor",
            "kitchens",
            "bathrooms",
            "wc",
            "living_rooms",
            "heating_system",
            "energy_class",
            "construction_year",
            "availability",
            "longitude",
            "latitude",
            "service_charge",
            "featured",
            "distance_from_sea",
            "distance_from_city",
            "distance_from_airport",
            "distance_from_village",
            "distance_from_port",
            "cover_coefficient",
            "building_coefficient",
            "length_of_facade",
            "renovation_year",
            "opening_frames",
            "type_of_glass",
            "orientation",
            "zone",
            "floor_type",
            "amenities",
            "approved",
        ]

    list_display = ("id", "type", "sub_type", "sale_type", "price",
                    "approved", "agent_name", "featured")
    list_filter = ("agent_name", "type", "sale_type", "price", "approved")
    search_fields = ("type", "description",
                     "price", "agent_name", "sale_type")
    list_per_page = 25
    actions = ["approve_listings", "approve_featured_listings"]

    def approve_listings(self, request, queryset):
        queryset.update(approved=True)

    def approve_featured_listings(self, request, queryset):
        queryset.update(featured=True)


class ImagesAdmin(admin.ModelAdmin):
    form = ImagesAdminForm
    list_display = ("listing", "url", "is_first")
    list_filter = ("listing", "url")
    search_fields = ("listing", "url")
    list_per_page = 25


class AmenitiesAdmin(admin.ModelAdmin):
    list_display = ("id", "name")
    list_filter = ("id", "name")
    search_fields = ("id", "name")
    list_per_page = 50


class OwnerFileInline(admin.TabularInline):
    model = OwnerFile
    extra = 1


class OwnerAdmin(admin.ModelAdmin):
    inlines = [OwnerFileInline]
    list_display = ("id", "first_name", "last_name",
                    "email", "phone", "phone_2", "display_files")
    fields = ("first_name", "last_name", "email", "phone", "phone_2")
    list_filter = ("id", "first_name", "last_name",
                   "email", "phone", "phone_2")
    search_fields = ("id", "first_name", "last_name",
                     "email", "phone", "phone_2")
    list_per_page = 50

    def display_files(self, obj):
        files = obj.files.all()  # Get all the files associated with the owner
        file_links = []

        # Loop through files and generate links to them
        for file in files:
            file_url = file.file.url  # Get the URL of the file
            file_name = file.file.name  # Get the file name
            # Create an HTML link for the file
            file_links.append(
                f'<a href="{file_url}" target="_blank">{file_name}</a>')

        # Return a concatenated string of file links
        return format_html(', '.join(file_links)) if file_links else 'No files'

    # Label for the field in the admin list display
    display_files.short_description = 'Uploaded Files'


class ShortTermListingForm(forms.ModelForm):
    class Meta:
        model = ShortTermListing
        fields = '__all__'


class ShortTermPriceOverrideInline(admin.TabularInline):
    model = ShortTermPriceOverride
    extra = 0
    ordering = ("date",)


class ShortTermSeasonalPriceInline(admin.TabularInline):
    model = ShortTermSeasonalPrice
    extra = 0
    ordering = ("start_date",)


@admin.register(ShortTermListing)
class ShortTermListingAdmin(admin.ModelAdmin):
    form = ListingLoacationAdminForm
    change_form_template = "admin/listings/shortterm_change_form.html"
    inlines = [ShortTermPriceOverrideInline, ShortTermSeasonalPriceInline]

    def get_form(self, request, obj=None, **kwargs):
        form = super().get_form(request, obj, **kwargs)
        form.request = request  # ✅ Attach request manually
        return form

    def render_change_form(self, request, context, *args, **kwargs):
        form = context['adminform'].form
        if hasattr(form, "render_location_json"):
            context["location_json_script"] = form.render_location_json()
        return super().render_change_form(request, context, *args, **kwargs)

    list_display = ('id', 'agent_name', 'price', 'approved', 'max_guests')
    search_fields = ('agent_name__username', 'municipality', 'description')

    def get_fields(self, request, obj=None):
        return [
            "agent_name",
            "listing_owner",
            "language",
            "region_display",
            "county_display",
            "municipality_display",
            "municipality_gr",
            "region_id",
            "county_id",
            "municipality_id",
            "latitude",
            "longitude",
            "description",
            "description_gr",
            "address_number",
            "address_street",
            "postcode",
            "price",
            "currency",
            "floor_area",
            "bedrooms",
            "floor",
            "kitchens",
            "bathrooms",
            "wc",
            "living_rooms",
            "approved",
            "max_guests",
            "max_adults",
            "max_children",
            "amenities",
        ]

    def save_model(self, request, obj, form, change):
        try:
            obj.full_clean()  # This runs the model's .clean() method
        except ValidationError as e:
            form.add_error(None, e)
            return
        super().save_model(request, obj, form, change)


admin.site.register(Amenities, AmenitiesAdmin)
admin.site.register(Images, ImagesAdmin)
admin.site.register(Owner, OwnerAdmin)
admin.site.register(OwnerFile)
admin.site.register(ShortTermImages)
