from django.db import models
from django.core.validators import EmailValidator


class ContactForm(models.Model):
    """
    Contact model that allows users to contact the site owner.
    """

    email = models.EmailField(max_length=255, validators=[EmailValidator()])
    subject = models.CharField(max_length=255)
    message = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    first_name = models.CharField(max_length=255)
    last_name = models.CharField(max_length=255)
    phone_number = models.CharField(max_length=255)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return f"{self.first_name} {self.last_name}'s message"
