from django.contrib import admin
from listings.models import Listing, Images


class ListingAdmin(admin.ModelAdmin):
    list_display = ("type", "sale_type", "price", "approved", "owner")
    list_filter = ("owner", "type", "sale_type", "price", "approved")
    search_fields = ("type", "description", "city", "price", "owner", "sale_type")
    list_per_page = 25
    actions = ["approve_listings"]

    def approve_listings(self, request, queryset):
        queryset.update(approved=True)


admin.site.register(Listing, ListingAdmin)
admin.site.register(Images)
