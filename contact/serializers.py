from rest_framework import serializers
from .models import ContactForm


class ContactFormSerializer(serializers.ModelSerializer):
    """
    Contact form serializer.
    """

    class Meta:
        model = ContactForm
        fields = [
            "id",
            "name",
            "email",
            "subject",
            "message",
            "created_at",
        ]

        read_only_fields = ["id", "created_at"]

    def create(self, validated_data):
        """
        Creates contact form.
        """
        name = validated_data["name"]
        email = validated_data["email"]
        subject = validated_data["subject"]
        message = validated_data["message"]

        contact = ContactForm.objects.create(
            name=name, email=email, subject=subject, message=message
        )

        return contact
