from django.db import models
from django.contrib.auth.models import User
from datetime import datetime
from django.core.exceptions import ValidationError
from django.utils.translation import gettext_lazy as _


class amenities(models.Model):
    """
    Amenities model
    """
    name = models.CharField(max_length=255, default="", blank=True)
    solar_water_heating = models.BooleanField(default=False)
    elevator = models.BooleanField(default=False)
    storage_room = models.BooleanField(default=False)
    parking = models.BooleanField(default=False)
    garden = models.BooleanField(default=False)
    fireplace = models.BooleanField(default=False)
    alarm = models.BooleanField(default=False)
    air_conditioning = models.BooleanField(default=False)
    attic = models.BooleanField(default=False)
    veranda = models.BooleanField(default=False)
    terrace = models.BooleanField(default=False)
    balcony = models.BooleanField(default=False)
    furnished = models.BooleanField(default=False)
    renovated = models.BooleanField(default=False)
    corner = models.BooleanField(default=False)
    penthouse = models.BooleanField(default=False)
    bright = models.BooleanField(default=False)
    painted = models.BooleanField(default=False)
    pets_allowed = models.BooleanField(default=False)
    satellite = models.BooleanField(default=False)
    internal_stairs = models.BooleanField(default=False)
    double_glass = models.BooleanField(default=False)
    awnings = models.BooleanField(default=False)
    screens = models.BooleanField(default=False)
    bbq = models.BooleanField(default=False)
    solar_heating = models.BooleanField(default=False)
    swimming_pool = models.BooleanField(default=False)
    gym = models.BooleanField(default=False)
    playroom = models.BooleanField(default=False)
    secure_door = models.BooleanField(default=False)
    security_alarm = models.BooleanField(default=False)
    security_door = models.BooleanField(default=False)
    CCTV = models.BooleanField(default=False)
    storage = models.BooleanField(default=False)
    basement = models.BooleanField(default=False)
    no_shared_expenses = models.BooleanField(default=False)
    investment = models.BooleanField(default=False)
    student_apartment = models.BooleanField(default=False)
    luxurious = models.BooleanField(default=False)
    for_office_use = models.BooleanField(default=False)
    for_commercial_use = models.BooleanField(default=False)
    for_residential_use = models.BooleanField(default=False)
    for_tourist_use = models.BooleanField(default=False)
    for_warehouse_use = models.BooleanField(default=False)
    for_industrial_use = models.BooleanField(default=False)
    for_agricultural_use = models.BooleanField(default=False)
    distance_from_sea = models.BooleanField(default=False)
    distance_from_city = models.BooleanField(default=False)
    distance_from_airport = models.BooleanField(default=False)
    distance_from_village = models.BooleanField(default=False)
    distance_from_port = models.BooleanField(default=False)

    def __str__(self):
        return f"Amenities {self.name}"

    class Meta:
        verbose_name_plural = "Amenities building"


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
        ("apartment", "Apartment"),
        ("house", "House"),
        ("land", "Land"),
        ("commercial", "Commercial"),
    ]

    energy_class_filter_choices = [
        ("A", "A"),
        ("B", "B"),
        ("C", "C"),
        ("D", "D"),
        ("E", "E"),
        ("F", "F"),
        ("G", "G"),
    ]

    construction_year_choices = [(i, i)
                                 for i in range(1900, datetime.now().year + 1)]

    owner = models.ForeignKey(User, on_delete=models.CASCADE)
    type = models.CharField(
        choices=type_filter_choices, default="apartment", max_length=255
    )
    sale_type = models.CharField(
        choices=sale_type_filter_choices, default="sale", max_length=255
    )
    description = models.CharField(max_length=255, blank=True)
    address_number = models.IntegerField(validators=[validate_zero])
    address_street = models.CharField(max_length=255)
    postcode = models.CharField(max_length=255)
    city = models.CharField(max_length=255)
    price = models.IntegerField(validators=[validate_zero])
    surface = models.IntegerField(validators=[validate_zero])
    levels = models.IntegerField(validators=[validate_zero])
    bedrooms = models.IntegerField(validators=[validate_zero])
    floor = models.IntegerField()
    kitchens = models.IntegerField(validators=[validate_zero])
    bathrooms = models.IntegerField(validators=[validate_zero])
    living_rooms = models.IntegerField(validators=[validate_zero])
    heating_system = models.CharField(max_length=255)
    energy_class = models.CharField(
        choices=energy_class_filter_choices, default="A", max_length=255
    )
    construction_year = models.IntegerField(
        choices=construction_year_choices, default=datetime.now().year
    )
    availability = models.DateField()
    created_on = models.DateTimeField(auto_now_add=True)
    updated_on = models.DateTimeField(auto_now=True)
    approved = models.BooleanField(default=False)
    longitude = models.FloatField(default=0.0)
    latitude = models.FloatField(default=0.0)
    amenities = models.ManyToManyField(amenities)
    featured = models.BooleanField(default=False)

    class Meta:
        ordering = ["-created_on"]

    def __str__(self):
        return f"{self.owner}'s listing {self.id}"


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

    def __str__(self):
        return f"{self.listing}'s image"

    class Meta:
        verbose_name_plural = "Images"
