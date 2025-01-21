from django.contrib import admin
from listings.models import Listing, Images, Amenities, Owner, OwnerFile
from django.utils.html import format_html


class ListingAdmin(admin.ModelAdmin):
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


admin.site.register(Amenities, AmenitiesAdmin)
admin.site.register(Images, ImagesAdmin)
admin.site.register(Listing, ListingAdmin)
admin.site.register(Owner, OwnerAdmin)
