import uuid
from django.db import models
from django.contrib.auth.models import User
from listings.models import ShortTermListing
from phonenumber_field.modelfields import PhoneNumberField
from django.core.exceptions import ValidationError
from decimal import Decimal
from .utils import calculate_booking_price


def generate_booking_reference():
    return str(uuid.uuid4()).replace('-', '').upper()[:8]


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
    total_nights = models.PositiveIntegerField(default=0)
    total_price = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        default=Decimal("0.00")
    )
    created_at = models.DateTimeField(auto_now_add=True)
    admin_confirmed = models.BooleanField(default=False)
    reference_number = models.CharField(
        max_length=20, unique=True, editable=False)
    user = models.ForeignKey(
        User, on_delete=models.SET_NULL, null=True, blank=True)
    language = models.CharField(
        max_length=2,
        choices=LANUGAGE_CHOICES,
        default='en',
    )
    adults = models.PositiveIntegerField(default=1)
    children = models.PositiveIntegerField(default=0)
    message = models.TextField(blank=True)

    @property
    def total_guests(self):
        return self.adults + self.children

    def clean(self):
        super().clean()

        total = self.total_guests
        if total > self.listing.max_guests:
            raise ValidationError("Total guests exceed maximum allowed.")
        if self.adults > self.listing.max_adults:
            raise ValidationError("Too many adults.")
        if self.children > self.listing.max_children:
            raise ValidationError("Too many children.")

        # Lock confirmed bookings
        if self.pk:
            old = ShortTermBooking.objects.get(pk=self.pk)
            if old.admin_confirmed:
                if (
                    old.check_in != self.check_in or
                    old.check_out != self.check_out or
                    old.listing_id != self.listing_id
                ):
                    raise ValidationError(
                        "Confirmed bookings cannot have their dates "
                        "or listing changed."
                    )

        # Prevent overlaps (admin included)
        overlapping = ShortTermBooking.objects.filter(
            listing=self.listing,
            check_in__lt=self.check_out,
            check_out__gt=self.check_in,
        )

        if self.pk:
            overlapping = overlapping.exclude(pk=self.pk)

        if overlapping.exists():
            raise ValidationError(
                "This listing is already booked for the selected dates."
            )

    def can_recalculate_price(self):
        """
        Only allow recalculation if booking is not admin-confirmed
        """
        return not self.admin_confirmed

    def save(self, *args, **kwargs):
        creating = self.pk is None

        if not self.reference_number:
            self.reference_number = generate_booking_reference()

        nights = []

        if creating:
            if self.listing and self.check_in and self.check_out:
                nights_count, total_price, nights = calculate_booking_price(
                    self.listing,
                    self.check_in,
                    self.check_out
                )
                self.total_nights = nights_count
                self.total_price = total_price

        else:
            old = ShortTermBooking.objects.get(pk=self.pk)

            if old.admin_confirmed:
                if (
                    old.check_in != self.check_in or
                    old.check_out != self.check_out or
                    old.listing_id != self.listing_id
                ):
                    raise ValidationError(
                        "Confirmed bookings cannot be modified."
                    )

            elif self.can_recalculate_price():
                if (
                    old.check_in != self.check_in or
                    old.check_out != self.check_out
                ):
                    (
                        nights_count,
                        total_price,
                        nights
                    ) = calculate_booking_price(
                        self.listing,
                        self.check_in,
                        self.check_out
                    )
                    self.total_nights = nights_count
                    self.total_price = total_price

        super().save(*args, **kwargs)

        # Create booking nights ONLY on creation
        if creating and nights:
            from .models import ShortTermBookingNight
            ShortTermBookingNight.objects.bulk_create([
                ShortTermBookingNight(
                    booking=self,
                    date=date,
                    price=price
                )
                for date, price in nights
            ])

    def __str__(self):
        return (
            f"{self.first_name} {self.last_name} - {self.listing} "
            f"({self.check_in} to {self.check_out})"
        )


class ShortTermBookingNight(models.Model):
    booking = models.ForeignKey(
        "ShortTermBooking",
        on_delete=models.CASCADE,
        related_name="nights",
    )
    date = models.DateField()
    price = models.DecimalField(max_digits=10, decimal_places=2)

    class Meta:
        ordering = ["date"]
        unique_together = ("booking", "date")

    def save(self, *args, **kwargs):
        if self.pk:
            raise ValidationError("Booking nights cannot be modified.")
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.booking.id} – {self.date} – {self.price}"
