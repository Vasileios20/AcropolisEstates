from django.contrib import admin
from .models import ContactForm


class ContactFormAdmin(admin.ModelAdmin):
    list_display = ("id", "first_name", "last_name", "email",
                    "phone_number", "subject", "created_on")
    list_filter = ("first_name", "last_name", "email",
                   "phone_number", "subject", "created_on")
    search_fields = ("first_name", "last_name", "email",
                     "phone_number", "subject", "created_on")
    list_per_page = 50


admin.site.register(ContactForm, ContactFormAdmin)
