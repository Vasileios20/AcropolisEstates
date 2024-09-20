from rest_framework.response import Response
from django_filters import rest_framework as filter
from re_drf_api.permissions import IsAdminUserOrReadOnly
from django.db.models import Count
from rest_framework import generics, filters, status
from django_filters.rest_framework import DjangoFilterBackend
from .models import Listing, Images, Amenities
from .serializers import (
    ListingSerializer,
    ImagesSerializer,
    AmenitiesSerializer,
)
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.views import APIView


class ListingFilter(filter.FilterSet):
    """
Filter class for filtering listings based on various criteria.
    """

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

    class Meta:
        model = Listing
        fields = [
            "agent_name",
            "type",
            "sub_type",
            "price",
            "sale_type",
        ]


class ListingList(generics.ListCreateAPIView):
    """
    List all listings, or create a new listing.
    """

    queryset = Listing.objects.annotate(
        listing_count=Count("agent_name__listing")
    ).order_by(
        "-listing_count"
    )
    serializer_class = ListingSerializer
    permission_classes = [IsAdminUserOrReadOnly]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    parser_classes = [MultiPartParser, FormParser]
    filterset_class = ListingFilter
    search_fields = [
        "city",
        "postcode",
        "address_street",
    ]

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
        "city",
        "price",
        "postcode",
        "sale_type",
        "type",
        "sub_type",
    ]


class DeleteImageView(generics.DestroyAPIView):
    """
    API view for deleting an image associated with a listing.
    """

    queryset = Images.objects.all()
    serializer_class = ImagesSerializer
    permission_classes = [IsAdminUserOrReadOnly]

    def delete(self, request, *args, **kwargs):
        image_id = self.kwargs.get("pk")
        listing_id = self.kwargs.get("listing_id")

        if not image_id or not listing_id:
            return Response(
                {"error": "Image or listing not found"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            image = Images.objects.get(id=image_id, listing=listing_id)
            image.delete()
            listing = Listing.objects.get(id=listing_id)
            listing.save()
            return Response(
                {"message": "Image deleted"}, status=status.HTTP_204_NO_CONTENT
            )
        except Images.DoesNotExist:
            return Response(
                {"error": "Image not found"}, status=status.HTTP_404_NOT_FOUND
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
