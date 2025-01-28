from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from django_filters import rest_framework as filter
from re_drf_api.permissions import IsAdminUserOrReadOnly, IsAdminUser
from django.db.models import Count
from rest_framework import generics, filters, status
from rest_framework.viewsets import ModelViewSet
from django_filters.rest_framework import DjangoFilterBackend
from .models import Listing, Images, Amenities, Owner, OwnerFile
from .serializers import (
    ListingSerializer,
    ImagesSerializer,
    AmenitiesSerializer,
    OwnerSerializer,
    OwnerFileSerializer,
)
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.views import APIView
from rest_framework.decorators import api_view


@api_view(['DELETE'])
def delete_file(request, owner_id, file_id):
    """
    Delete a file associated with an owner.
    """
    try:
        # Fetch the file, ensuring it belongs to the given owner
        file = get_object_or_404(OwnerFile, id=file_id, owner_id=owner_id)

        # Delete the file from storage
        if file.file:
            file.file.delete(save=False)

        # Delete the file record from the database
        file.delete()

        return Response(
            {'message': 'File deleted successfully'},
            status=status.HTTP_204_NO_CONTENT
        )
    except OwnerFile.DoesNotExist:
        return Response(
            {'error': 'File not found or does not belong to this owner'},
            status=status.HTTP_404_NOT_FOUND
        )


@api_view(['PUT'])
def reorder_images(request, listing_id):
    listing = get_object_or_404(Listing, id=listing_id)
    reordered_ids = request.data.get('reordered_image_ids', [])

    # Update the ordering in the database
    for idx, image_id in enumerate(reordered_ids):
        Images.objects.filter(
            id=image_id, listing=listing).update(order=idx)

    return Response({"detail": "Images reordered successfully."})


class ListingFilter(filter.FilterSet):
    """
Filter class for filtering listings based on various criteria.
    """

    # Get amenities filter
    amenities = filter.ModelMultipleChoiceFilter(
        field_name="amenities",
        # filter only amenities that are not blank
        queryset=Amenities.objects.all().exclude(name=""),
        conjoined=True,
    )

    min_price = filter.NumberFilter(field_name="price", lookup_expr="gte")
    max_price = filter.NumberFilter(field_name="price", lookup_expr="lte")

    min_bedrooms = filter.NumberFilter(
        field_name="bedrooms", lookup_expr="gte")
    max_bedrooms = filter.NumberFilter(
        field_name="bedrooms", lookup_expr="lte")

    min_floor_area = filter.NumberFilter(
        field_name="floor_area", lookup_expr="gte")
    max_floor_area = filter.NumberFilter(
        field_name="floor_area", lookup_expr="lte")

    min_construction_year = filter.NumberFilter(
        field_name="construction_year", lookup_expr="gte")
    max_construction_year = filter.NumberFilter(
        field_name="construction_year", lookup_expr="lte")

    min_floor = filter.NumberFilter(
        field_name="floor", lookup_expr="lte")
    max_floor = filter.NumberFilter(
        field_name="floor", lookup_expr="lte")
    region_id = filter.NumberFilter(
        field_name="region_id", lookup_expr="exact")
    county_id = filter.NumberFilter(
        field_name="county_id", lookup_expr="exact")
    municipality_id = filter.NumberFilter(
        field_name="municipality_id", lookup_expr="exact")

    class Meta:
        model = Listing
        fields = [
            "agent_name",
            "type",
            "sub_type",
            "price",
            "sale_type",
            "floor",
            "bedrooms",
            "bathrooms",
            "construction_year",
            "floor_area",
            "heating_system",
        ]


class OwnerViewSet(ModelViewSet):
    queryset = Owner.objects.all()
    serializer_class = OwnerSerializer
    permission_classes = [IsAdminUser]
    parser_classes = (MultiPartParser, FormParser)

    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance)
        # Manually adding the files to the owner data
        owner_data = serializer.data
        owner_data['files'] = OwnerFileSerializer(
            instance.files.all(), many=True).data
        return Response(owner_data)

    def create(self, request, *args, **kwargs):
        """
        Override the default create method to handle file uploads for an owner.
        """
        owner_serializer = OwnerSerializer(data=request.data)

        if owner_serializer.is_valid():
            owner_serializer.save()

            # Now, handle file uploads for the owner
            owner = owner_serializer.instance
            files = request.FILES.getlist('files')

            if files:  # Only process files if any are provided
                for file in files:
                    OwnerFile.objects.create(owner=owner, file=file)

            return Response(
                owner_serializer.data, status=status.HTTP_201_CREATED
            )
        return Response(
            owner_serializer.errors, status=status.HTTP_400_BAD_REQUEST
        )

    def update(self, request, *args, **kwargs):
        """
        Override the default update method to handle file uploads for an owner.
        """
        instance = self.get_object()
        owner_serializer = OwnerSerializer(
            instance, data=request.data, partial=True)

        if owner_serializer.is_valid():
            owner_serializer.save()

            # Handle file uploads
            files = request.FILES.getlist('files')
            for file in files:
                # Create the owner file entry
                OwnerFile.objects.create(owner=instance, file=file)

            return Response(owner_serializer.data)
        return Response(
            owner_serializer.errors, status=status.HTTP_400_BAD_REQUEST
        )


class ListingList(generics.ListCreateAPIView):
    """
    List all listings, or create a new listing.
    """

    queryset = Listing.objects.annotate(
        listing_count=Count("agent_name__listing")
    )
    serializer_class = ListingSerializer
    permission_classes = [IsAdminUserOrReadOnly]
    filter_backends = [
        DjangoFilterBackend,
        filters.SearchFilter,
        filters.OrderingFilter
    ]
    parser_classes = [MultiPartParser, FormParser]
    filterset_class = ListingFilter
    search_fields = [
        "municipality",
        "municipality_gr",
        "municipality_id",
        "county",
        "county_gr",
        "county_id",
        "region_id",
        "postcode",
    ]
    ordering_fields = [
        "listing_count",  # Annotated field
        "created_on",
        "-created_on",
        "price",
        "-price",
        "municipality_id",
        "county",
        "region_id",
        "postcode"
    ]

    ordering = ["-listing_count"]

    def get_queryset(self):
        """
        Dynamically apply filtering and ordering based on request parameters.
        """
        queryset = super().get_queryset()
        ordering = self.request.query_params.get("ordering")

        # Ensure dynamic ordering works with filters
        if ordering:
            queryset = queryset.order_by(ordering)

        return queryset

    def perform_create(self, serializer):
        serializer.save(agent_name=self.request.user)


class ListingDetail(generics.RetrieveUpdateDestroyAPIView):
    """
    Retrieve, update or delete a listing.
    """

    queryset = Listing.objects.all()
    serializer_class = ListingSerializer
    permission_classes = [IsAdminUserOrReadOnly]

    filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    filterset_fields = ["agent_name", "type", "price", "sale_type", "sub_type"]

    search_fields = [
        "agent_name__username",
        "municipality",
        "municipality_gr",
        "county",
        "county_gr",
        "price",
        "postcode",
        "sale_type",
        "type",
        "sub_type",
    ]


class DeleteImageView(generics.DestroyAPIView):
    """
    API view for deleting images associated with a listing.
    """
    queryset = Images.objects.all()
    serializer_class = ImagesSerializer
    permission_classes = [IsAdminUserOrReadOnly]

    def delete(self, request, *args, **kwargs):
        listing_id = self.kwargs.get("listing_id")
        image_ids = request.data.get("image_ids", [])

        if not listing_id or not image_ids:
            return Response(
                {"error": "Listing ID or image IDs not provided"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        # Check if the listing exists
        try:
            listing = Listing.objects.get(id=listing_id)
        except Listing.DoesNotExist:
            return Response(
                {"error": "Listing not found"},
                status=status.HTTP_404_NOT_FOUND,
            )

        # Delete images with the specified IDs
        deleted_count, _ = Images.objects.filter(
            id__in=image_ids, listing=listing).delete()

        listing.save()  # Save to trigger any updates if necessary

        return Response(
            {"message": f"{deleted_count} images deleted"},
            status=status.HTTP_204_NO_CONTENT,
        )


class AmenitiesList(generics.ListCreateAPIView):
    """
    List all amenities, or create a new amenity.
    """

    queryset = Amenities.objects.all()
    serializer_class = AmenitiesSerializer
    permission_classes = [IsAdminUserOrReadOnly]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    filterset_fields = ["name"]
    search_fields = ["name"]


class BulkCreateAmenitiesView(APIView):
    """
    Custom API View to handle bulk creation of amenities.
    """

    def post(self, request, *args, **kwargs):
        amenities_data = request.data
        if isinstance(amenities_data, list):
            serializer = AmenitiesSerializer(data=amenities_data, many=True)
            if serializer.is_valid():
                serializer.save()
                return Response(
                    serializer.data,
                    status=status.HTTP_201_CREATED
                )
            return Response(
                serializer.errors, status=status.HTTP_400_BAD_REQUEST
            )
        return Response(
            {"error": "Expected a list of amenities"},
            status=status.HTTP_400_BAD_REQUEST
        )
