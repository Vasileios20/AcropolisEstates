from django.db import models
from django.contrib.auth.models import User
from listings.models import Listing


class Wishlist(models.Model):
    """
    Wishlist model that allows users to add listings to their wishlist.
    """

    owner = models.ForeignKey(User, on_delete=models.CASCADE)
    listings = models.ForeignKey(
        Listing, on_delete=models.CASCADE, related_name="wishlist_listing"
    )

    class Meta:
        ordering = ["-owner"]

    def __str__(self):
        return f"{self.owner}'s wishlist with {self.listings}"
