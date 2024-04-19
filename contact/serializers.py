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
            "first_name",
            "last_mame",
            "email",
            "phone_number",
            "subject",
            "message",
            "created_at",
        ]

        read_only_fields = ["id", "created_at"]

    def create(self, validated_data):
        """
        Creates contact form.
        """
        first_name = validated_data["first_name"]
        last_name = validated_data["last_name"]
        email = validated_data["email"]
        phone_number = validated_data["phone_number"]
        subject = validated_data["subject"]
        message = validated_data["message"]

        contact = ContactForm.objects.create(
            first_name=first_name, last_name=last_name, email=email,
            phone_number=phone_number, subject=subject, message=message
        )

        return contact
