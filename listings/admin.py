from django.contrib import admin
from listings.models import Listing, Images, amenities


class ListingAdmin(admin.ModelAdmin):
    list_display = ("type", "sale_type", "price", "approved", "owner")
    list_filter = ("owner", "type", "sale_type", "price", "approved")
    search_fields = ("type", "description", "city",
                     "price", "owner", "sale_type")
    list_per_page = 25
    actions = ["approve_listings"]

    def approve_listings(self, request, queryset):
        queryset.update(approved=True)


class ImagesAdmin(admin.ModelAdmin):
    list_display = ("listing", "url")
    list_filter = ("listing", "url")
    search_fields = ("listing", "url")
    list_per_page = 25


class amenitiesAdmin(admin.ModelAdmin):
    list_display = ("name", "description")
    list_filter = ("name", "description")
    search_fields = ("name", "description")
    list_per_page = 25


admin.site.register(Listing, ListingAdmin)
admin.site.register(Images, ImagesAdmin)
admin.site.register(amenities)
