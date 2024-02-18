from django.db import models
from django.contrib.auth.models import User
from datetime import datetime
from django.core.exceptions import ValidationError
from django.utils.translation import gettext_lazy as _


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

    construction_year_choices = [(i, i) for i in range(1900, datetime.now().year + 1)]

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
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    approved = models.BooleanField(default=False)

    class Meta:
        ordering = ["-created_at"]

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
