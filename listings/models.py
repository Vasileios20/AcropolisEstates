from django.db import models
from django.contrib.auth.models import User
from datetime import datetime


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

    owner = models.ForeignKey(User, on_delete=models.CASCADE)
    type = models.CharField(
        choices=type_filter_choices, default="apartment", max_length=255
    )
    sale_type = models.CharField(
        choices=sale_type_filter_choices, default="sale", max_length=255
    )
    description = models.CharField(max_length=255, blank=True)
    address_number = models.IntegerField()
    address_street = models.CharField(max_length=255)
    postcode = models.CharField(max_length=255)
    city = models.CharField(max_length=255)
    price = models.IntegerField()
    surface = models.IntegerField()
    levels = models.IntegerField()
    bedrooms = models.IntegerField()
    floor = models.IntegerField()
    kitchens = models.IntegerField()
    bathrooms = models.IntegerField()
    living_rooms = models.IntegerField()
    heating_system = models.CharField(max_length=255)
    energy_class = models.CharField(
        choices=energy_class_filter_choices, default="A", max_length=255
    )
    construction_year = models.IntegerField(
        choices=[(i, i) for i in range(1900, datetime.now().year + 1)]
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
    images = models.ImageField(
        upload_to="images/", default="../default_post_vnf7ym", null=True
    )

    def __str__(self):
        return f"{self.listing}'s image"

    class Meta:
        verbose_name_plural = "Images"
