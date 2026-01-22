from django.db import models
from django.contrib.auth.models import User
from datetime import datetime
from django.core.exceptions import ValidationError
from decimal import Decimal
from django.utils.translation import gettext_lazy as _


class Owner(models.Model):
    first_name = models.CharField(max_length=255)
    last_name = models.CharField(max_length=255)
    phone = models.CharField(max_length=50)
    phone_2 = models.CharField(max_length=50, blank=True)
    email = models.EmailField(max_length=255)
    notes = models.TextField(blank=True)

    def __str__(self):
        return f"{self.first_name} {self.last_name}"

    class Meta:
        verbose_name_plural = "Owners"


class OwnerFile(models.Model):
    owner = models.ForeignKey(
        Owner, related_name="files", on_delete=models.CASCADE)
    file = models.FileField(
        upload_to="owners/%Y/%m/%d/", blank=True, null=True
    )
    uploaded_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"File for {self.owner} uploaded on {self.uploaded_at}"

    class Meta:
        verbose_name_plural = "Owner Files"


class Amenities(models.Model):
    """
    Amenities model
    """
    name = models.CharField(max_length=255, blank=True, default="")

    def __str__(self):
        return self.name

    class Meta:
        verbose_name_plural = "Amenities"


def validate_zero(value):
    """
    Validate that the value is not zero
    """
    if value < 0:
        raise ValidationError(_("This field must be a positive number"))


class Listing(models.Model):
    """
    Listing model
    Filters: By type, by sale type, by energy class
    """

    sale_type_filter_choices = [
        ("sale", "Sale"),
        ("rent", "Rent"),
    ]

    type_filter_choices = [
        ("residential", "Residential"),
        ("land", "Land"),
        ("commercial", "Commercial"),
    ]

    sub_type_filter_choices = [
        ("apartment", "Apartment"),
        ("house", "House"),
        ("maisonette", "Maisonette"),
        ("bungalow", "Bungalow"),
        ("villa", "Villa"),
        ("hotel", "Hotel"),
        ("office", "Office"),
        ("retail", "Retail"),
        ("warehouse", "Warehouse"),
        ("mixed_use", "Mixed Use"),
        ("industrial", "Industrial"),
        ("other", "Other"),
    ]

    energy_class_filter_choices = [
        ("A+", "A+"),
        ("A", "A"),
        ("B+", "B+"),
        ("B", "B"),
        ("C", "C"),
        ("D", "D"),
        ("E", "E"),
        ("F", "F"),
        ("G", "G"),
        ("to_be_issued", "To be issued")
    ]

    opening_frames_filter_choices = [
        ("aluminium", "Aluminium"),
        ("wooden", "Wooden"),
        ("iron", "Iron"),
        ("PVC", "PVC"),
    ]

    type_of_glass_filter_choices = [
        ("single", "Single"),
        ("double", "Double"),
        ("triple", "Triple"),
        ("quadruple", "Quadruple"),
    ]

    orientation_choices = [
        ("north", "North"),
        ("north_east", "North East"),
        ("east", "East"),
        ("south_east", "South East"),
        ("south", "South"),
        ("south_west", "South West"),
        ("west", "West"),
        ("north_west", "North West"),
    ]

    zone_choices = [
        ("residential", "Residential"),
        ("commercial", "Commercial"),
        ("industrial", "Industrial"),
        ("agricultural", "Agricultural"),
        ("tourist", "Tourist"),
        ("mixed", "Mixed"),
        ("redevelopment", "Redevelopment"),
        ("other", "Other"),
    ]

    view_choices = [
        ("sea", "Sea"),
        ("mountain", "Mountain"),
        ("city", "City"),
        ("other", "Other"),
    ]

    slope_choices = [
        ("level", "Level"),
        ("view", "View"),
        ("incline", "Incline"),
    ]

    floor_choices = [
        ("marble", "Marble"),
        ("tile", "Tile"),
        ("wooden", "Wooden"),
        ("granite", "Granite"),
        ("mosaic", "Mosaic"),
        ("stone", "Stone"),
        ("laminate", "Laminate"),
        ("parquet", "Parquet"),
        ("carpet", "Carpet"),
        ("cement", "Cement"),
        ("industrial_floor", "Industrial Floor"),
        ("other", "Other"),
    ]

    power_type_choices = [
        ("electricity", "Electricity"),
        ("gas", "Gas"),
        ("natural_gas", "Natural Gas"),
        ("heat_pump", "Heat Pump"),
        ("other", "Other"),
        ("n/a", "N/A"),
    ]

    heating_system_choices = [
        ("autonomous", "Autonomous"),
        ("central", "Central"),
        ("air_condition", "Air Condition"),
        ("fireplace", "Fireplace"),
        ("solar", "Solar"),
        ("geothermal", "Geothermal"),
        ("other", "Other"),
        ("n/a", "N/A"),
    ]

    construction_year_choices = [(i, i)
                                 for i in range(1900, datetime.now().year + 1)]

    currency_choices = [
        ("€", "Euro (€)"),
        ("$", "US Dollar ($)"),
        ("£", "British Pound (£)"),
    ]

    agent_name = models.ForeignKey(User, on_delete=models.CASCADE)
    listing_owner = models.ForeignKey(
        Owner, on_delete=models.CASCADE, related_name="listings",
        null=True, blank=True
    )
    type = models.CharField(
        choices=type_filter_choices, default="residential",
        max_length=255, blank=True
    )
    sub_type = models.CharField(
        choices=sub_type_filter_choices, default="apartment",
        max_length=255, blank=True
    )
    sale_type = models.CharField(
        choices=sale_type_filter_choices, default="sale",
        max_length=255, blank=True
    )
    price = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        validators=[validate_zero],
        null=True,
        blank=True,
        default=Decimal("0.00")
    )
    currency = models.CharField(
        max_length=255, default="€", blank=True,
        choices=currency_choices
    )
    description = models.TextField(blank=True)
    description_gr = models.TextField(blank=True)
    address_number = models.IntegerField(
        validators=[validate_zero], null=True, blank=True)
    address_street = models.CharField(max_length=255, blank=True)
    address_street_gr = models.CharField(max_length=255, blank=True)
    postcode = models.CharField(max_length=255, blank=True)
    municipality_id = models.IntegerField(null=True, blank=True)
    municipality = models.CharField(max_length=255, blank=True)
    municipality_gr = models.CharField(max_length=255, blank=True)
    county_id = models.IntegerField(null=True, blank=True)
    region_id = models.IntegerField(null=True, blank=True)
    floor_area = models.FloatField(
        validators=[validate_zero], null=True, blank=True)
    land_area = models.FloatField(
        validators=[validate_zero], default=0, null=True, blank=True)
    levels = models.IntegerField(
        validators=[validate_zero], null=True, blank=True)
    bedrooms = models.IntegerField(
        validators=[validate_zero], null=True, blank=True)
    wc = models.IntegerField(
        validators=[validate_zero], default=0, null=True, blank=True)
    floor = models.IntegerField(null=True, blank=True)
    kitchens = models.IntegerField(
        validators=[validate_zero], null=True, blank=True)
    bathrooms = models.IntegerField(
        validators=[validate_zero], null=True, blank=True)
    living_rooms = models.IntegerField(
        validators=[validate_zero], null=True, blank=True)
    rooms = models.IntegerField(
        validators=[validate_zero], default=0, null=True, blank=True)
    power_type = models.CharField(
        choices=power_type_choices,
        max_length=255,
        blank=True,
        default="N/A")
    heating_system = models.CharField(
        choices=heating_system_choices,
        max_length=255,
        blank=True,
        default="N/A"
    )
    energy_class = models.CharField(
        choices=energy_class_filter_choices, default="A", max_length=255,
        blank=True
    )
    floor_type = models.CharField(
        choices=floor_choices, default="marble", max_length=255, blank=True
    )
    construction_year = models.IntegerField(
        choices=construction_year_choices, default=datetime.now().year,
        null=True, blank=True
    )
    availability = models.DateField(null=True, blank=True)
    latitude = models.FloatField(default=0.0, null=True, blank=True)
    longitude = models.FloatField(default=0.0, null=True, blank=True)
    service_charge = models.FloatField(
        validators=[validate_zero], default=0, null=True, blank=True)
    renovation_year = models.IntegerField(
        choices=construction_year_choices, default=datetime.now().year,
        null=True, blank=True
    )
    opening_frames = models.CharField(
        choices=opening_frames_filter_choices,
        default="aluminium",
        max_length=255,
        blank=True
    )
    type_of_glass = models.CharField(
        choices=type_of_glass_filter_choices,
        default="single",
        max_length=255,
        blank=True
    )
    building_coefficient = models.IntegerField(
        default=0, null=True, blank=True)
    cover_coefficient = models.IntegerField(default=0, null=True, blank=True)
    length_of_facade = models.IntegerField(
        validators=[validate_zero], default=0, null=True, blank=True)
    orientation = models.CharField(
        choices=orientation_choices, default="north", max_length=255,
        blank=True
    )
    view = models.CharField(
        choices=view_choices, default="sea", max_length=255, blank=True
    )
    slope = models.CharField(
        choices=slope_choices, default="level", max_length=255, blank=True
    )
    zone = models.CharField(
        choices=zone_choices, default="residential", max_length=255, blank=True
    )
    distance_from_sea = models.IntegerField(
        validators=[validate_zero], default=0, null=True, blank=True)
    distance_from_city = models.IntegerField(
        validators=[validate_zero], default=0, null=True, blank=True)
    distance_from_airport = models.IntegerField(
        validators=[validate_zero], default=0, null=True, blank=True)
    distance_from_village = models.IntegerField(
        validators=[validate_zero], default=0, null=True, blank=True)
    distance_from_port = models.IntegerField(
        validators=[validate_zero], default=0, null=True, blank=True)
    created_on = models.DateTimeField(auto_now_add=True)
    updated_on = models.DateTimeField(auto_now=True)
    amenities = models.ManyToManyField(
        Amenities, blank=True, related_name="listings")
    approved = models.BooleanField(default=False)
    featured = models.BooleanField(default=False)

    class Meta:
        ordering = ["-created_on"]

    def __str__(self):
        return f" listing AE000{self.id}"


class Images(models.Model):
    """
    Images model
    """

    listing = models.ForeignKey(
        Listing, on_delete=models.CASCADE, related_name="images"
    )
    url = models.URLField(max_length=255, blank=True, null=True)
    is_first = models.BooleanField(default=False, null=True)
    order = models.PositiveIntegerField(default=0, null=True)

    def __str__(self):
        return f"{self.listing}'s image"

    def save(self, *args, **kwargs):
        if self.is_first:
            Images.objects.filter(listing=self.listing,
                                  is_first=True).update(is_first=False)
        super().save(*args, **kwargs)

    class Meta:
        verbose_name_plural = "Images"


class ShortTermListing(models.Model):
    """
    Short Term Listing model
    """
    currency_choices = [
        ("€", "Euro (€)"),
        ("$", "US Dollar ($)"),
        ("£", "British Pound (£)"),
    ]

    agent_name = models.ForeignKey(User, on_delete=models.CASCADE)
    listing_owner = models.ForeignKey(
        Owner, on_delete=models.CASCADE, related_name="short_term_listings",
        null=True, blank=True
    )
    title = models.CharField(
        max_length=200,
        blank=True,
        default='',
        help_text=(
            'Property title/name (e.g., "Cozy Apartment in Athens Center")'
        )
    )
    title_gr = models.CharField(
        max_length=200,
        blank=True,
        default='',
        help_text=(
            'Τίτλος ακινήτου (π.χ., "Άνετο Διαμέρισμα στο Κέντρο Αθήνας")'
        )
    )
    description = models.TextField(blank=True)
    description_gr = models.TextField(blank=True)
    address_number = models.IntegerField(
        validators=[validate_zero], null=True, blank=True)
    address_street = models.CharField(max_length=255, blank=True)
    address_street_gr = models.CharField(max_length=255, blank=True)
    postcode = models.CharField(max_length=255, blank=True)
    municipality = models.CharField(max_length=255, blank=True)
    municipality_gr = models.CharField(max_length=255, blank=True)
    municipality_id = models.IntegerField(null=True, blank=True)
    county_id = models.IntegerField(null=True, blank=True)
    region_id = models.IntegerField(null=True, blank=True)
    price = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        validators=[validate_zero],
        null=True,
        blank=True,
        default=Decimal("0.00")
    )
    currency = models.CharField(
        max_length=255, default="€", blank=True,
        choices=currency_choices
    )
    floor_area = models.FloatField(
        validators=[validate_zero], null=True, blank=True)
    bedrooms = models.IntegerField(
        validators=[validate_zero], null=True, blank=True)
    wc = models.IntegerField(
        validators=[validate_zero], default=0, null=True, blank=True)
    floor = models.IntegerField(null=True, blank=True)
    kitchens = models.IntegerField(
        validators=[validate_zero], null=True, blank=True)
    bathrooms = models.IntegerField(
        validators=[validate_zero], null=True, blank=True)
    living_rooms = models.IntegerField(
        validators=[validate_zero], null=True, blank=True)
    latitude = models.FloatField(default=0.0, null=True, blank=True)
    longitude = models.FloatField(default=0.0, null=True, blank=True)
    distance_from_sea = models.IntegerField(
        validators=[validate_zero], default=0, null=True, blank=True)
    distance_from_city = models.IntegerField(
        validators=[validate_zero], default=0, null=True, blank=True)
    distance_from_airport = models.IntegerField(
        validators=[validate_zero], default=0, null=True, blank=True)
    distance_from_village = models.IntegerField(
        validators=[validate_zero], default=0, null=True, blank=True)
    distance_from_port = models.IntegerField(
        validators=[validate_zero], default=0, null=True, blank=True)
    created_on = models.DateTimeField(auto_now_add=True)
    updated_on = models.DateTimeField(auto_now=True)
    amenities = models.ManyToManyField(
        Amenities, blank=True, related_name="short_term_listings")
    approved = models.BooleanField(default=False)
    max_guests = models.PositiveIntegerField(
        default=1, help_text="Total max people allowed")
    max_adults = models.PositiveIntegerField(
        default=1, help_text="Max number of adults")
    max_children = models.PositiveIntegerField(
        default=0, help_text="Max number of children")
    vat_rate = models.DecimalField(
        max_digits=5,
        decimal_places=2,
        default=Decimal('13.00'),
        help_text="VAT rate percentage (e.g., 13.25 for 13.25%)"
    )
    municipality_tax_rate = models.DecimalField(
        max_digits=5,
        decimal_places=2,
        default=Decimal('1.50'),
        help_text="Municipality tax rate percentage (e.g., 1.25 for 1.25%)"
    )
    climate_crisis_fee_per_night = models.DecimalField(
        max_digits=6,
        decimal_places=2,
        default=Decimal('1.50'),
        help_text="Climate Crisis Resilience Fee per night in EUR"
    )
    # Optional: Cleaning fee
    cleaning_fee = models.DecimalField(
        max_digits=8,
        decimal_places=2,
        default=Decimal('0.00'),
        help_text="One-time cleaning fee in EUR"
    )
    # Optional: Service/Platform fee
    service_fee = models.DecimalField(
        max_digits=8,
        decimal_places=2,
        default=Decimal('0.00'),
        help_text="One-time service/platform fee in EUR"
    )

    def clean(self):
        super().clean()
        if self.max_guests < 1:
            raise ValidationError(
                {'max_guests': ("This field must be a positive number.")})

        if self.max_guests < self.max_adults + self.max_children:
            raise ValidationError({
                'max_guests': ("Max guests must be greater than or equal to "
                               "the sum of max adults and max children."),
            })

    class Meta:
        ordering = ["-created_on"]

    def __str__(self):
        if self.title:
            return f"{self.title} (ST{str(self.id).zfill(6)})"
        return (f"Short Term Listing ST{str(self.id).zfill(6)} - "
                f"€{self.price}/night")


class ShortTermImages(models.Model):
    """
    Short Term Images model
    """

    listing = models.ForeignKey(
        ShortTermListing, on_delete=models.CASCADE, related_name="images"
    )
    url = models.URLField(max_length=255, blank=True, null=True)
    is_first = models.BooleanField(default=False, null=True)
    order = models.PositiveIntegerField(default=0, null=True)

    def __str__(self):
        return f"{self.listing}'s image"

    def save(self, *args, **kwargs):
        if self.is_first:
            ShortTermImages.objects.filter(
                listing=self.listing,
                is_first=True
            ).update(is_first=False)
        super().save(*args, **kwargs)

    class Meta:
        verbose_name_plural = "Short Term Images"


class ShortTermPriceOverride(models.Model):
    listing = models.ForeignKey(
        "ShortTermListing",
        on_delete=models.CASCADE,
        related_name="price_overrides",
    )
    date = models.DateField()
    price = models.PositiveIntegerField()

    class Meta:
        unique_together = ("listing", "date")
        ordering = ["date"]

    def __str__(self):
        return f"{self.listing.id} – {self.date} – {self.price}"


class ShortTermSeasonalPrice(models.Model):
    listing = models.ForeignKey(
        "ShortTermListing",
        on_delete=models.CASCADE,
        related_name="seasonal_prices",
    )
    start_date = models.DateField()
    end_date = models.DateField()
    price = models.PositiveIntegerField()

    class Meta:
        ordering = ["start_date"]

    def clean(self):
        if self.start_date >= self.end_date:
            raise ValidationError("End date must be after start date.")

    def __str__(self):
        return (
            f"{self.listing.id}: {self.start_date} → "
            f"{self.end_date} (€{self.price})"
        )
