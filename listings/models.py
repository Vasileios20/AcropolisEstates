from django.db import models
from django.contrib.auth.models import User
from datetime import datetime
from django.core.exceptions import ValidationError
from django.utils.translation import gettext_lazy as _


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

    agent_name = models.ForeignKey(User, on_delete=models.CASCADE)
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
    price = models.FloatField(
        validators=[validate_zero], null=True, blank=True)
    currency = models.CharField(max_length=255, default="€", blank=True)
    description = models.TextField(blank=True)
    description_gr = models.TextField(blank=True)
    address_number = models.IntegerField(
        validators=[validate_zero], null=True, blank=True)
    address_street = models.CharField(max_length=255, blank=True)
    address_street_gr = models.CharField(max_length=255, blank=True)
    postcode = models.CharField(max_length=255, blank=True)
    municipality = models.CharField(max_length=255, blank=True)
    municipality_gr = models.CharField(max_length=255, blank=True)
    county = models.CharField(max_length=255, default="", blank=True)
    county_gr = models.CharField(max_length=255, default="", blank=True)
    region = models.CharField(max_length=255, default="", blank=True)
    region_gr = models.CharField(max_length=255, default="", blank=True)
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
        choices=power_type_choices, max_length=255, blank=True)
    heating_system = models.CharField(
        choices=heating_system_choices, max_length=255, blank=True)
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
    url = models.ImageField(
        upload_to="images/", default="../default_post_vnf7ym", null=True
    )
    is_first = models.BooleanField(default=False, null=True)

    def __str__(self):
        return f"{self.listing}'s image"

    def save(self, *args, **kwargs):
        if self.is_first:
            Images.objects.filter(listing=self.listing,
                                  is_first=True).update(is_first=False)
        super().save(*args, **kwargs)

    class Meta:
        verbose_name_plural = "Images"
