from rest_framework import serializers
from .models import Profile


class ProfileSerializer(serializers.ModelSerializer):
    owner = serializers.ReadOnlyField(source="owner.username")
    is_owner = serializers.SerializerMethodField()

    def get_is_owner(self, obj):
        return self.context["request"].user == obj.owner

    class Meta:
        model = Profile
        fields = [
            "id",
            "owner",
            "created_at",
            "updated_at",
            "first_name",
            "last_name",
            "email_address",
            "phone",
            "image",
            "is_owner",
        ]
