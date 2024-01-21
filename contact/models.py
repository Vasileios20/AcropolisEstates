from django.db import models
from django.core.validators import EmailValidator


class ContactForm(models.Model):
    """
    Contact model that allows users to contact the site owner.
    """

    name = models.CharField(max_length=255)
    email = models.EmailField(max_length=255, validators=[EmailValidator()])
    subject = models.CharField(max_length=255)
    message = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return f"{self.name}'s message"
