import uuid
from django.db import models
from django.contrib.auth.models import User
from listings.models import ShortTermListing
from phonenumber_field.modelfields import PhoneNumberField
from django.core.exceptions import ValidationError


class ShortTermBooking(models.Model):
    LANUGAGE_CHOICES = (
        ('en', 'English'),
        ('el', 'Greek'),
    )
    listing = models.ForeignKey(
        ShortTermListing, on_delete=models.CASCADE, related_name='bookings')
    first_name = models.CharField(max_length=255)
    last_name = models.CharField(max_length=255)
    phone_number = PhoneNumberField()
    email = models.EmailField()
    check_in = models.DateField()
    check_out = models.DateField()
    created_at = models.DateTimeField(auto_now_add=True)
    confirmed = models.BooleanField(default=False)
    admin_confirmed = models.BooleanField(default=False)
    token = models.UUIDField(default=uuid.uuid4, editable=False, unique=True)
    user = models.ForeignKey(
        User, on_delete=models.SET_NULL, null=True, blank=True)
    language = models.CharField(
        max_length=2,
        choices=LANUGAGE_CHOICES,
        default='en',
    )
    adults = models.PositiveIntegerField(default=1)
    children = models.PositiveIntegerField(default=0)

    @property
    def total_guests(self):
        return self.adults + self.children

    def clean(self):
        total = self.adults + self.children
        if total > self.listing.max_guests:
            raise ValidationError("Total guests exceed maximum allowed.")
        if self.adults > self.listing.max_adults:
            raise ValidationError("Too many adults.")
        if self.children > self.listing.max_children:
            raise ValidationError("Too many children.")

    def __str__(self):
        return (
            f"{self.first_name} {self.last_name} - {self.listing} "
            f"({self.check_in} to {self.check_out})"
        )
