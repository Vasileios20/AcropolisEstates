from rest_framework import serializers
from .models import Listing, Images, Amenities
from django.core.files.images import get_image_dimensions


def validate_images(value):
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


class AmenitiesSerializer(serializers.ModelSerializer):
    """
    Serializer class for the Amenities model.s

    This serializer is used to serialize and deserialize Amenities
    objects. It defines the fields that should be included in the serialized
    representation of an Amenities object.

    Attributes:
        class Meta: The Meta class that defines the model and fields to include
        in the serialized representation of an Amenities object.
    """
    class Meta:
        model = Amenities
        fields = ["id", "name"]


class ImagesSerializer(serializers.ModelSerializer):
    """
    Serializer for Images model.

    This serializer is used to validate and serialize Images data.
    It checks the size, width, and height of each image before saving.

    Attributes:
        model (class): The model class associated with the serializer.
        fields (list): The fields to include in the serialized output.
    """

    class Meta:
        model = Images
        fields = ["id", "listing", "url", "is_first"]


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
    agent_name = serializers.ReadOnlyField(source="agent_name.username")
    is_owner = serializers.SerializerMethodField()
    profile_id = serializers.ReadOnlyField(source="agent_name.profile.id")
    images = ImagesSerializer(
        many=True,
        read_only=True,
    )
    uploaded_images = serializers.ListField(
        child=serializers.ImageField(
            max_length=100000, use_url=False, allow_empty_file=False
        ),
        write_only=True,
        validators=[validate_images],
        required=False,
    )
    amenities = AmenitiesSerializer(
        many=True,
        required=False,
    )

    amenities_ids = serializers.PrimaryKeyRelatedField(
        many=True,
        write_only=True,
        queryset=Amenities.objects.all(),
        source='amenities'
    )

    def get_is_owner(self, obj):
        return self.context["request"].user == obj.agent_name

    def create(self, validated_data):
        uploaded_images = validated_data.pop("uploaded_images", [])
        amenities = validated_data.pop('amenities')
        is_first_image_idx = int(
            self.context['request'].data.get('is_first', 0))
        listing = Listing.objects.create(**validated_data)
        listing.amenities.set(amenities)

        for uploaded_image in uploaded_images:
            if is_first_image_idx == uploaded_images.index(uploaded_image):
                is_first = True
            else:
                is_first = False
            Images.objects.create(
                listing=listing,
                url=uploaded_image,
                is_first=is_first,
            )

        return listing

    def update(self, instance, validated_data):
        uploaded_images = validated_data.pop("uploaded_images", [])
        amenities = validated_data.pop('amenities', None)
        is_first_image_idx = self.context['request'].data.get('is_first', None)

        if is_first_image_idx is not None:
            try:
                is_first_image_idx = int(is_first_image_idx)
            except (ValueError, TypeError):
                is_first_image_idx = None

        if uploaded_images:
            if is_first_image_idx is not None:
                listing_images = instance.images.all()
                listing_images.update(is_first=False)

            for uploaded_image in uploaded_images:
                if is_first_image_idx == uploaded_images.index(uploaded_image):
                    is_first = True
                else:
                    is_first = False
                Images.objects.create(
                    listing=instance,
                    url=uploaded_image,
                    is_first=is_first,
                )

        instance = super().update(instance, validated_data)

        if amenities is not None:
            instance.amenities.set(amenities)

        return instance

    class Meta:
        model = Listing
        fields = [
            "id",
            "is_owner",
            "profile_id",
            "agent_name",
            "type",
            "sub_type",
            "sale_type",
            "description",
            "description_gr",
            "address_number",
            "address_street",
            "address_street_gr",
            "municipality",
            "municipality_gr",
            "postcode",
            "county",
            "county_gr",
            "region",
            "region_gr",
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
            "currency",
            "rooms",
            "power_type",
            "view",
            "slope",
            "amenities",
            "amenities_ids",
        ]
