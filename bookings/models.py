import uuid
from django.db import models
from django.contrib.auth.models import User
from listings.models import ShortTermListing
from phonenumber_field.modelfields import PhoneNumberField
from django.core.exceptions import ValidationError
from decimal import Decimal
from django.utils import timezone
from .utils import calculate_booking_price


def generate_booking_reference():
    return str(uuid.uuid4()).replace('-', '').upper()[:8]


class ShortTermBooking(models.Model):
    """
    Short-term rental booking model with discount support and status tracking.

    Price Calculation Flow:
    1. Base subtotal calculated from nightly rates
    2. Discount applied to subtotal (if any)
    3. Taxes/fees calculated on discounted subtotal
    4. Final total = discounted_subtotal + all taxes/fees

    Status Workflow:
    pending -> confirmed -> checked_in -> completed
                        -> cancelled (can happen at any stage)
    """

    STATUS_CHOICES = [
        ('pending', 'Pending Confirmation'),
        ('confirmed', 'Confirmed'),
        ('checked_in', 'Checked In'),
        ('completed', 'Completed'),
        ('cancelled', 'Cancelled'),
    ]

    DISCOUNT_TYPE_CHOICES = [
        ('percentage', 'Percentage'),
        ('fixed', 'Fixed Amount'),
    ]

    LANGUAGE_CHOICES = [
        ('en', 'English'),
        ('el', 'Greek'),
    ]

    # Basic Information
    listing = models.ForeignKey(
        ShortTermListing, on_delete=models.CASCADE, related_name='bookings'
    )
    reference_number = models.CharField(
        max_length=20, unique=True, editable=False
    )
    user = models.ForeignKey(
        User, on_delete=models.SET_NULL, null=True, blank=True,
        related_name='bookings'
    )

    # Guest Information
    first_name = models.CharField(max_length=255)
    last_name = models.CharField(max_length=255)
    phone_number = PhoneNumberField()
    email = models.EmailField()

    # Booking Details
    check_in = models.DateField()
    check_out = models.DateField()
    adults = models.PositiveIntegerField(default=1)
    children = models.PositiveIntegerField(default=0)
    message = models.TextField(blank=True)
    language = models.CharField(
        max_length=2,
        choices=LANGUAGE_CHOICES,
        default='en',
    )

    # Status & Confirmation
    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default='pending'
    )
    admin_confirmed = models.BooleanField(
        default=False,
        help_text="Legacy field - use 'status' instead"
    )

    # Pricing Components (all before discount)
    total_nights = models.PositiveIntegerField(default=0)
    subtotal = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        default=Decimal('0.00'),
        help_text="Base accommodation cost before discount and taxes"
    )

    # Discount Information
    discount_type = models.CharField(
        max_length=20,
        choices=DISCOUNT_TYPE_CHOICES,
        null=True,
        blank=True,
        help_text="Type of discount: percentage or fixed amount"
    )
    discount_value = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        null=True,
        blank=True,
        default=Decimal('0.00'),
        help_text="Discount value (e.g., 10 for 10% or 50 for €50)"
    )
    discount_amount = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        default=Decimal('0.00'),
        help_text="Calculated discount amount in currency"
    )
    discount_reason = models.CharField(
        max_length=255,
        blank=True,
        help_text="Optional reason for discount"
    )
    discount_applied_by = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='discounts_applied',
        help_text="Admin who applied the discount"
    )
    discount_applied_at = models.DateTimeField(
        null=True,
        blank=True,
        help_text="Timestamp when discount was applied"
    )

    # Taxes and Fees (calculated on discounted subtotal)
    vat = models.DecimalField(
        max_digits=10,
        decimal_places=3,
        default=Decimal('0.000'),
        help_text="VAT (calculated on discounted subtotal)"
    )
    municipality_tax = models.DecimalField(
        max_digits=10,
        decimal_places=3,
        default=Decimal('0.000'),
        help_text="Municipality accommodation tax"
    )
    climate_crisis_fee = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        default=Decimal('0.00'),
        help_text="Climate Crisis Resilience Fee"
    )
    cleaning_fee = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        default=Decimal('0.00'),
        help_text="One-time cleaning fee"
    )
    service_fee = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        default=Decimal('0.00'),
        help_text="Platform/service fee"
    )

    # Final Total
    total_price = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        default=Decimal("0.00"),
        help_text="Final total including discount and all taxes/fees"
    )

    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']
        verbose_name = 'Short-Term Booking'
        verbose_name_plural = 'Short-Term Bookings'

    @property
    def total_guests(self):
        """Total number of guests (adults + children)"""
        return self.adults + self.children

    @property
    def has_discount(self):
        """Check if booking has a discount applied"""
        return (
            self.discount_type is not None and
            self.discount_value and self.discount_value > 0
        )

    @property
    def discounted_subtotal(self):
        """Subtotal after discount applied"""
        return self.subtotal - self.discount_amount

    @property
    def is_confirmed(self):
        """Check if booking is confirmed"""
        return self.status == 'confirmed'

    @property
    def is_modifiable(self):
        """Check if booking can be modified (dates/guests)"""
        return self.status in ['pending', 'confirmed']

    @property
    def can_apply_discount(self):
        """Check if discount can be applied/modified"""
        # Allow discount on pending or confirmed bookings
        return self.status in ['pending', 'confirmed']

    def calculate_discount_amount(self):
        """
        Calculate the actual discount amount based on type and value.
        Returns Decimal of the discount amount in currency.
        """
        if not self.discount_type or not self.discount_value:
            return Decimal('0.00')

        if self.discount_type == 'percentage':
            # Percentage discount on subtotal
            discount_decimal = self.discount_value / Decimal('100')
            return (self.subtotal * discount_decimal).quantize(Decimal('0.01'))

        elif self.discount_type == 'fixed':
            # Fixed amount discount
            # Ensure discount doesn't exceed subtotal
            return min(self.discount_value, self.subtotal)

        return Decimal('0.00')

    def apply_discount(
        self, discount_type, discount_value, reason='', applied_by=None
    ):
        """
        Apply a discount to the booking and recalculate total.

        Args:
            discount_type: 'percentage' or 'fixed'
            discount_value: Decimal value (e.g., 10 for 10% or 50 for €50)
            reason: Optional reason for discount
            applied_by: User who applied the discount

        Returns:
            bool: True if discount applied successfully

        Raises:
            ValidationError: If discount cannot be applied
        """
        if not self.can_apply_discount:
            raise ValidationError(
                f"Cannot apply discount to booking in '{self.status}' status"
            )

        # Validate discount value
        if discount_value <= 0:
            raise ValidationError("Discount value must be greater than 0")

        if discount_type == 'percentage' and discount_value > 100:
            raise ValidationError("Percentage discount cannot exceed 100%")

        if discount_type == 'fixed' and discount_value > self.subtotal:
            raise ValidationError(
                f"Fixed discount (€{discount_value}) cannot exceed "
                f"subtotal (€{self.subtotal})"
            )

        # Set discount fields
        self.discount_type = discount_type
        self.discount_value = discount_value
        self.discount_reason = reason
        self.discount_applied_by = applied_by
        self.discount_applied_at = timezone.now()

        # Recalculate pricing with discount
        self._recalculate_price_with_discount()

        return True

    def remove_discount(self):
        """Remove discount and recalculate total"""
        if not self.has_discount:
            return False

        self.discount_type = None
        self.discount_value = None
        self.discount_amount = Decimal('0.00')
        self.discount_reason = ''
        self.discount_applied_by = None
        self.discount_applied_at = None

        # Recalculate without discount
        self._recalculate_price_with_discount()

        return True

    def _recalculate_price_with_discount(self):
        """
        Internal method to recalculate all pricing components with discount.
        This maintains the listing's tax rates but applies discount.
        """
        # Calculate discount amount
        self.discount_amount = self.calculate_discount_amount()

        # Get discounted subtotal
        discounted_subtotal = self.subtotal - self.discount_amount

        # Get tax rates from listing
        listing = self.listing
        vat_rate = Decimal(listing.vat_rate) / Decimal('100')
        municipality_tax_rate = Decimal(
            listing.municipality_tax_rate) / Decimal('100')

        # Recalculate taxes on discounted subtotal
        self.vat = discounted_subtotal * vat_rate
        self.municipality_tax = discounted_subtotal * municipality_tax_rate

        # Climate crisis fee and cleaning fee remain the same
        # (they're not based on subtotal)

        # Recalculate total
        self.total_price = (
            discounted_subtotal +
            self.vat +
            self.municipality_tax +
            self.climate_crisis_fee +
            self.cleaning_fee +
            self.service_fee
        )

    def clean(self):
        """Validation before save"""
        super().clean()

        # Validate guest counts
        total = self.total_guests
        if total > self.listing.max_guests:
            raise ValidationError("Total guests exceed maximum allowed.")
        if self.adults > self.listing.max_adults:
            raise ValidationError("Too many adults.")
        if self.children > self.listing.max_children:
            raise ValidationError("Too many children.")

        # Lock confirmed bookings from date changes
        if self.pk:
            old = ShortTermBooking.objects.get(pk=self.pk)

            # Prevent date/listing changes for confirmed/completed bookings
            if old.status in ['confirmed', 'checked_in', 'completed']:
                if (
                    old.check_in != self.check_in or
                    old.check_out != self.check_out or
                    old.listing_id != self.listing_id
                ):
                    raise ValidationError(
                        (f"Cannot change dates/listing for "
                         f"'{old.status}' bookings.")
                    )

        # Prevent overlaps (excluding cancelled bookings)
        overlapping = ShortTermBooking.objects.filter(
            listing=self.listing,
            check_in__lt=self.check_out,
            check_out__gt=self.check_in,
        ).exclude(status='cancelled')

        if self.pk:
            overlapping = overlapping.exclude(pk=self.pk)

        if overlapping.exists():
            raise ValidationError(
                "This listing is already booked for the selected dates."
            )

    def save(self, *args, **kwargs):
        """
        Save booking with automatic price calculation and status syncing.
        """
        creating = self.pk is None

        # Generate reference number
        if not self.reference_number:
            self.reference_number = generate_booking_reference()

        # Sync admin_confirmed with status for backward compatibility
        if self.status == 'confirmed':
            self.admin_confirmed = True
        elif self.status in ['pending', 'cancelled']:
            self.admin_confirmed = False

        # Calculate prices on creation
        if creating:
            if self.listing and self.check_in and self.check_out:
                price_data = calculate_booking_price(
                    self.listing,
                    self.check_in,
                    self.check_out
                )

                # Set all price components
                self.total_nights = price_data['nights']
                self.subtotal = price_data['subtotal']
                self.vat = price_data['vat']
                self.municipality_tax = price_data['municipality_tax']
                self.climate_crisis_fee = price_data['climate_crisis_fee']
                self.cleaning_fee = price_data['cleaning_fee']
                self.service_fee = price_data['service_fee']
                self.total_price = price_data['total']

                # Store nights for later
                self._nights_data = price_data.get('breakdown', [])

        # If dates changed on pending booking, recalculate
        elif self.status == 'pending' and not self.has_discount:
            old = ShortTermBooking.objects.get(pk=self.pk)
            if (
                old.check_in != self.check_in or
                old.check_out != self.check_out
            ):
                price_data = calculate_booking_price(
                    self.listing,
                    self.check_in,
                    self.check_out
                )

                self.total_nights = price_data['nights']
                self.subtotal = price_data['subtotal']
                self.vat = price_data['vat']
                self.municipality_tax = price_data['municipality_tax']
                self.climate_crisis_fee = price_data['climate_crisis_fee']
                self.cleaning_fee = price_data['cleaning_fee']
                self.service_fee = price_data['service_fee']
                self.total_price = price_data['total']

                self._nights_data = price_data.get('breakdown', [])

        super().save(*args, **kwargs)

        # Create booking nights ONLY on creation
        if creating and hasattr(self, '_nights_data'):
            from .models import ShortTermBookingNight
            ShortTermBookingNight.objects.bulk_create([
                ShortTermBookingNight(
                    booking=self,
                    date=date,
                    price=price
                )
                for date, price in self._nights_data
            ])

    def __str__(self):
        return (
            f"{self.reference_number} - {self.listing} "
            f"({self.check_in} to {self.check_out}) - "
            f"{self.get_status_display()}"
        )


class ShortTermBookingNight(models.Model):
    """
    Individual night of a booking with its specific price.
    Immutable once created - cannot be modified.
    """
    booking = models.ForeignKey(
        ShortTermBooking,
        on_delete=models.CASCADE,
        related_name="nights",
    )
    date = models.DateField()
    price = models.DecimalField(max_digits=10, decimal_places=2)

    class Meta:
        ordering = ["date"]
        unique_together = ("booking", "date")
        verbose_name = 'Booking Night'
        verbose_name_plural = 'Booking Nights'

    def save(self, *args, **kwargs):
        """Prevent modification of existing booking nights"""
        if self.pk:
            raise ValidationError("Booking nights cannot be modified.")
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.booking.reference_number} – {self.date} – €{self.price}"
