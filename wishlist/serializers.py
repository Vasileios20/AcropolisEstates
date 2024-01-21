from rest_framework import serializers
from .models import Wishlist


class WishlistSerializer(serializers.ModelSerializer):
    """
    Wishlist serializer.
    """

    owner = serializers.ReadOnlyField(source="owner.username")
    is_owner = serializers.SerializerMethodField()

    def get_is_owner(self, obj):
        return self.context["request"].user == obj.owner

    class Meta:
        model = Wishlist
        fields = [
            "id",
            "owner",
            "listings",
            "is_owner",
        ]

    def validate(self, data):
        """
        Checks for duplicate listings in the user's wishlist.
        Checks if owner is the same as the user.
        If it is, it will raise an error.
        If it is not, it will create the wishlist object.
        """

        if self.context["request"].user == data["listings"].owner:
            raise serializers.ValidationError("You cannot add your own listing")

        if Wishlist.objects.filter(
            owner=self.context["request"].user, listings=data["listings"]
        ).exists():
            raise serializers.ValidationError("Listing already exists in wishlist")
        return data
