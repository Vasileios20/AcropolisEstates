import uuid
from django.db import models
from django.contrib.auth.models import User
from listings.models import ShortTermListing


class ShortTermBooking(models.Model):
    listing = models.ForeignKey(
        ShortTermListing, on_delete=models.CASCADE, related_name='bookings')
    name = models.CharField(max_length=255)
    email = models.EmailField()
    check_in = models.DateField()
    check_out = models.DateField()
    created_at = models.DateTimeField(auto_now_add=True)
    confirmed = models.BooleanField(default=False)
    token = models.UUIDField(default=uuid.uuid4, editable=False, unique=True)
    user = models.ForeignKey(
        User, on_delete=models.SET_NULL, null=True, blank=True)

    def __str__(self):
        return (
            f"{self.name} - {self.listing} "
            f"({self.check_in} to {self.check_out})"
        )
