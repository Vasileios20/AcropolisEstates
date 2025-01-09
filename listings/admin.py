from django.contrib import admin
from listings.models import Listing, Images, Amenities, Owner


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


class OwnerAdmin(admin.ModelAdmin):
    list_display = ("id", "first_name", "last_name",
                    "email", "phone", "phone_2")
    list_filter = ("id", "first_name", "last_name",
                   "email", "phone", "phone_2")
    search_fields = ("id", "first_name", "last_name",
                     "email", "phone", "phone_2")
    list_per_page = 50


admin.site.register(Amenities, AmenitiesAdmin)
admin.site.register(Images, ImagesAdmin)
admin.site.register(Listing, ListingAdmin)
admin.site.register(Owner, OwnerAdmin)
