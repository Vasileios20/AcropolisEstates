from rest_framework import serializers
from .models import Listing, Images, amenities
from django.core.files.images import get_image_dimensions


class amenitiesSerializer(serializers.ModelSerializer):
    """
    Serializer class for the amenities model.

    This serializer is used to serialize and deserialize amenities
    objects. It defines the fields that should be included in the serialized
    representation of an amenities object.

    Attributes:
        class Meta: The Meta class that defines the model and fields to include
        in the serialized representation of an amenities object.
    """
    class Meta:
        model = amenities
        fields = [all_fields.name for all_fields in amenities._meta.fields]


class ImagesSerializer(serializers.ModelSerializer):
    """
    Serializer for Images model.

    This serializer is used to validate and serialize Images data.
    It checks the size, width, and height of each image before saving.

    Attributes:
        model (class): The model class associated with the serializer.
        fields (list): The fields to include in the serialized output.
    """

    def validate_images(self, value):
        for image in value:
            if image.size > 1024 * 1024 * 2:
                raise serializers.ValidationError(
                    "Image size can't exceed 2MB")
            width, height = get_image_dimensions(image)
            if width > 4096:
                raise serializers.ValidationError(
                    "Image width can't exceed 4096px")
            if height > 4096:
                raise serializers.ValidationError(
                    "Image height can't exceed 4096px")
        return value

    class Meta:
        model = Images
        fields = ["id", "listing", "url"]


class ListingSerializer(serializers.ModelSerializer):
    """
    Serializer class for the Listing model.

    This serializer is used to serialize and deserialize Listing objects.
    It defines the fields that should be included in the serialized
    representation of a Listing object, as well as any additional validation
    or processing logic.

    Attributes:
        owner: A read-only field that represents the username of the owner of
        the listing.
        is_owner: A serializer method field that returns a boolean indicating
        whether the current user is the owner of the listing.
        profile_id: A read-only field that represents the ID of the owner's
        profile
        images: A nested serializer field that represents the images associated
        with the listing.
        uploaded_images: A list field that represents the uploaded images for
        the listing.

    Methods:
        get_is_owner: Returns a boolean indicating whether the current user is
        the owner of the listing.
        create: Creates a new listing object with the validated data.
        update: Updates an existing listing object with the validated data.

    Meta:
        model: The Listing model class.
        fields: The fields that should be included in the serialized
        representation of a Listing object.
    """
    owner = serializers.ReadOnlyField(source="owner.username")
    is_owner = serializers.SerializerMethodField()
    profile_id = serializers.ReadOnlyField(source="owner.profile.id")
    images = ImagesSerializer(
        many=True,
        read_only=True,
    )
    uploaded_images = serializers.ListField(
        child=serializers.ImageField(
            max_length=100000, use_url=False, allow_empty_file=False
        ),
        write_only=True,
        validators=[ImagesSerializer().validate_images],
    )
    amenities = amenitiesSerializer(
        many=True,
        read_only=True,
    )

    def get_is_owner(self, obj):
        return self.context["request"].user == obj.owner

    def create(self, validated_data):
        uploaded_images = validated_data.pop("uploaded_images")
        listing = Listing.objects.create(**validated_data)
        for uploaded_image in uploaded_images:
            Images.objects.create(listing=listing, url=uploaded_image)
        return listing

    def update(self, instance, validated_data):
        uploaded_images = validated_data.pop("uploaded_images")

        if uploaded_images:
            listing_image_model_instance = [
                Images(
                    listing=instance, url=image
                )
                for image in uploaded_images
            ]
            Images.objects.bulk_create(listing_image_model_instance)
        return super().update(instance, validated_data)

    class Meta:
        model = Listing
        fields = [
            "id",
            "is_owner",
            "profile_id",
            "owner",
            "type",
            "sub_type",
            "sale_type",
            "description",
            "address_number",
            "address_street",
            "municipality",
            "postcode",
            "city",
            "region",
            "price",
            "floor_area",
            "land_area",
            "levels",
            "bedrooms",
            "floor",
            "kitchens",
            "bathrooms",
            "wc",
            "living_rooms",
            "heating_system",
            "energy_class",
            "construction_year",
            "availability",
            "created_on",
            "updated_on",
            "approved",
            "longitude",
            "latitude",
            "service_charge",
            "amenities",
            "featured",
            "distance_from_sea",
            "distance_from_city",
            "distance_from_airport",
            "distance_from_village",
            "distance_from_port",
            "cover_coefficient",
            "building_coefficient",
            "length_of_facade",
            "renovation_year",
            "opening_frames",
            "type_of_glass",
            "orientation",
            "zone",
            "floor_type",
            "images",
            "uploaded_images",
        ]
