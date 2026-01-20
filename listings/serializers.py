from rest_framework import serializers
from .models import (
    Listing, Images, Amenities, Owner, OwnerFile,
    ShortTermListing, ShortTermImages, ShortTermPriceOverride
)
from django.core.files.images import get_image_dimensions
from .services import upload_to_backblaze
from django.db.models import Max
from .utils import generate_unique_filename


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


class OwnerFileSerializer(serializers.ModelSerializer):
    file_url = serializers.SerializerMethodField()

    class Meta:
        model = OwnerFile
        fields = ['id', 'file', 'owner', 'file_url']

    def get_file_url(self, obj):
        obj_url = obj.file.url.split('?')[0]
        clean_url = obj_url.split('/')[-1]
        return clean_url


class OwnerSerializer(serializers.ModelSerializer):
    """
    Serializer class for the Owner model.

    This serializer is used to serialize and deserialize Owner objects.
    It defines the fields that should be included in the serialized
    representation of an Owner object.

    Attributes:
        class Meta: The Meta class that defines the model and fields to include
        in the serialized representation of an Owner object.
    """

    files = OwnerFileSerializer(many=True, read_only=True)
    email = serializers.EmailField(required=False)

    class Meta:
        model = Owner
        fields = [
            "id", "first_name", "last_name",
            "email", "phone", "phone_2", "notes",
            "files"
        ]


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
    listing_owner = serializers.PrimaryKeyRelatedField(
        queryset=Owner.objects.all(),
        allow_null=True,
        required=False,
    )
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
        folder = "listings"

        # Upload images to Backblaze and create Image objects
        for idx, uploaded_image in enumerate(uploaded_images):
            filename = generate_unique_filename(folder, listing.id, idx + 1)
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

        listing_owner = validated_data.pop("listing_owner", None)
        if listing_owner is not None:
            instance.listing_owner = listing_owner

        # Update amenities if provided
        if amenities is not None:
            instance.amenities.set(amenities)

        folder = "listings"

        # Process uploaded images
        if uploaded_images:
            existing_images = instance.images.all()
            max_order = existing_images.aggregate(
                max_order=Max('order'))['max_order'] or 0

            for idx, uploaded_image in enumerate(uploaded_images):
                filename = generate_unique_filename(
                    folder, instance.id, max_order + idx + 1)
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
            "listing_owner",
        ]

    def to_representation(self, instance):
        ret = super().to_representation(instance)
        # Sort by order field
        ret['images'] = sorted(ret['images'], key=lambda x: x['order'])
        return ret


class ShortTermImagesSerializer(serializers.ModelSerializer):
    """
    Serializer class for the ShortTermImages model.

    This serializer is used to serialize and deserialize ShortTermImages
    objects. It defines the fields that should be included in the serialized
    representation of a ShortTermImages object.
    """

    class Meta:
        model = ShortTermImages
        fields = ["id", "listing", "url", "is_first", "order"]


class ShortTermPriceOverrideSerializer(serializers.ModelSerializer):
    class Meta:
        model = ShortTermPriceOverride
        fields = ["date", "price"]


class ShortTermListingSerializer(serializers.ModelSerializer):
    """
    Serializer class for the ShortTermListing model.

    This serializer is used to serialize and deserialize ShortTermListing
    objects. It defines the fields that should be included in the serialized
    representation of a ShortTermListing object.
    """

    agent_name = serializers.ReadOnlyField(source="agent_name.username")
    is_owner = serializers.SerializerMethodField()
    profile_id = serializers.ReadOnlyField(source="agent_name.profile.id")
    price_overrides = ShortTermPriceOverrideSerializer(
        many=True, read_only=True)
    listing_owner = serializers.PrimaryKeyRelatedField(
        queryset=Owner.objects.all(),
        allow_null=True,
        required=False,
    )
    images = ShortTermImagesSerializer(
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
    vat_rate_display = serializers.SerializerMethodField()
    municipality_tax_rate_display = serializers.SerializerMethodField()
    service_fee_display = serializers.SerializerMethodField()

    def get_is_owner(self, obj):
        return self.context["request"].user == obj.agent_name

    def create(self, validated_data):
        uploaded_images = validated_data.pop("uploaded_images", [])
        amenities = validated_data.pop('amenities')
        image_orders = self.context['request'].data.get('image_orders', [])
        is_first_image_idx = int(
            self.context['request'].data.get('is_first', 0))

        # Create the Listing object
        listing = ShortTermListing.objects.create(**validated_data)
        listing.amenities.set(amenities)
        folder = "short_term_listings"

        # Upload images to Backblaze and create Image objects
        for idx, uploaded_image in enumerate(uploaded_images):
            filename = generate_unique_filename(folder, listing.id, idx + 1)
            try:
                file_url = upload_to_backblaze(
                    uploaded_image, filename)
                order = image_orders[idx] if idx < len(image_orders) else idx
                is_first = (is_first_image_idx == idx)
                ShortTermImages.objects.create(
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

        listing_owner = validated_data.pop("listing_owner", None)
        if listing_owner is not None:
            instance.listing_owner = listing_owner

        # Update amenities if provided
        if amenities is not None:
            instance.amenities.set(amenities)

        folder = "short_term_listings"

        # Process uploaded images
        if uploaded_images:
            existing_images = instance.images.all()
            max_order = existing_images.aggregate(
                max_order=Max('order'))['max_order'] or 0

            for idx, uploaded_image in enumerate(uploaded_images):
                filename = generate_unique_filename(
                    folder, instance.id, max_order + idx + 1)
                try:
                    # Upload to Backblaze and get file URL
                    file_url = upload_to_backblaze(uploaded_image, filename)

                    # Create a new image with the next order value
                    ShortTermImages.objects.create(
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

    def get_vat_rate_display(self, obj):
        """Convert 0.13 -> 13.0 for display."""
        return float(obj.vat_rate / 100) if obj.vat_rate else 0

    def get_municipality_tax_rate_display(self, obj):
        """Convert 0.015 -> 1.5 for display."""
        return (
            float(
                obj.municipality_tax_rate / 100
            ) if obj.municipality_tax_rate else 0
        )

    def get_service_fee_display(self, obj):
        """Convert 0.05 -> 5.0 for display."""
        return float(obj.service_fee / 100) if obj.service_fee else 0

    class Meta:
        model = ShortTermListing
        fields = [
            "id",
            "agent_name",
            "title",
            "title_gr",
            "description",
            "description_gr",
            "address_number",
            "address_street",
            "address_street_gr",
            "municipality",
            "postcode",
            "price",
            "currency",
            "floor_area",
            "bedrooms",
            "floor",
            "kitchens",
            "bathrooms",
            "wc",
            "living_rooms",
            "created_on",
            "updated_on",
            "approved",
            "longitude",
            "latitude",
            "images",
            "amenities",
            "municipality_id",
            "county_id",
            "region_id",
            "listing_owner",
            "uploaded_images",
            "is_owner",
            "profile_id",
            "amenities_ids",
            "max_guests",
            "max_adults",
            "max_children",
            "price",
            "price_overrides",
            "vat_rate",
            "municipality_tax_rate",
            "climate_crisis_fee_per_night",
            "cleaning_fee",
            "service_fee",
            "vat_rate_display",
            "municipality_tax_rate_display",
            "service_fee_display",
        ]

    def to_representation(self, instance):
        ret = super().to_representation(instance)
        # Sort by order field
        ret['images'] = sorted(ret['images'], key=lambda x: x['order'])
        return ret

    def validate(self, data):
        max_guests = data.get("max_guests", 1)
        max_adults = data.get("max_adults", 1)
        max_children = data.get("max_children", 0)

        if max_guests < max_adults + max_children:
            raise serializers.ValidationError(
                "Max guests must be greater than or equal"
                "to the sum of max adults and max children."
            )
        return data


class AvailabilityDaySerializer(serializers.Serializer):
    date = serializers.DateField()
    available = serializers.BooleanField()
    price = serializers.DecimalField(max_digits=10, decimal_places=2)
