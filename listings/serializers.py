from rest_framework import serializers
from .models import Listing, Images, Amenities
from django.core.files.images import get_image_dimensions
from .services import upload_to_backblaze
from django.db.models import Max
import uuid
from datetime import datetime


def generate_unique_filename(listing_id, idx):
    """
    Generate a unique filename for an image.
    Combines listing ID, index, timestamp, and a UUID to ensure uniqueness.
    """
    timestamp = datetime.now().strftime("%Y%m%d%H%M%S")
    unique_id = uuid.uuid4().hex[:8]
    return f"listings/{listing_id}/image_{idx + 1}_{timestamp}_{unique_id}.jpg"


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
        fields = ["id", "listing", "url", "is_first", "order"]


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
        image_orders = self.context['request'].data.get('image_orders', [])
        is_first_image_idx = int(
            self.context['request'].data.get('is_first', 0))

        # Create the Listing object
        listing = Listing.objects.create(**validated_data)
        listing.amenities.set(amenities)

        # Upload images to Backblaze and create Image objects
        for idx, uploaded_image in enumerate(uploaded_images):
            filename = generate_unique_filename(listing.id, idx + 1)
            try:
                file_url = upload_to_backblaze(uploaded_image, filename)
                order = image_orders[idx] if idx < len(image_orders) else idx
                is_first = (is_first_image_idx == idx)
                Images.objects.create(
                    listing=listing,
                    url=file_url,
                    is_first=is_first,
                    order=order,
                )
            except Exception as e:
                raise serializers.ValidationError(
                    f"File upload failed: {str(e)}")

        return listing

    def update(self, instance, validated_data):
        uploaded_images = validated_data.pop("uploaded_images", [])
        amenities = validated_data.pop('amenities', None)
        is_first_image_idx = self.context['request'].data.get('is_first', None)

        # Update amenities if provided
        if amenities is not None:
            instance.amenities.set(amenities)

        # Process uploaded images
        if uploaded_images:
            existing_images = instance.images.all()
            max_order = existing_images.aggregate(
                max_order=Max('order'))['max_order'] or 0

            for idx, uploaded_image in enumerate(uploaded_images):
                filename = generate_unique_filename(
                    instance.id, max_order + idx + 1)
                try:
                    # Upload to Backblaze and get file URL
                    file_url = upload_to_backblaze(uploaded_image, filename)

                    # Create a new image with the next order value
                    Images.objects.create(
                        listing=instance,
                        url=file_url,
                        is_first=False,
                        order=max_order + idx + 1,
                    )
                except Exception as e:
                    raise serializers.ValidationError(
                        f"File upload failed: {str(e)}")

        if is_first_image_idx is not None:
            try:
                is_first_image_idx = int(is_first_image_idx)
                # Reset all images' `is_first` flag and set the specified one
                instance.images.update(is_first=False)
                if 0 <= is_first_image_idx < instance.images.count():
                    image_to_set_first = instance.images.order_by('order')[
                        is_first_image_idx
                    ]
                    image_to_set_first.is_first = True
                    image_to_set_first.save()
            except (ValueError, TypeError, IndexError):
                raise serializers.ValidationError(
                    "Invalid value for 'is_first' index.")

        # Call the parent class update method for the rest of the data
        return super().update(instance, validated_data)

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
            "municipality_id",
            "county_id",
            "region_id",
        ]

    def to_representation(self, instance):
        ret = super().to_representation(instance)
        # Sort by order field
        ret['images'] = sorted(ret['images'], key=lambda x: x['order'])
        return ret
