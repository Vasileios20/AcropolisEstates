from django.db.models import Count
from rest_framework import generics, filters, status
from django_filters.rest_framework import DjangoFilterBackend
from .models import Listing, Images
from .serializers import ListingSerializer, ImagesSerializer
from re_drf_api.permissions import IsAdminUserOrReadOnly
from django_filters import rest_framework as filter
from rest_framework.response import Response


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

    min_surface = filter.NumberFilter(field_name="surface", lookup_expr="gte")
    max_surface = filter.NumberFilter(field_name="surface", lookup_expr="lte")

    class Meta:
        model = Listing
        fields = [
            "owner",
            "type",
            "price",
            "sale_type",
        ]


class ListingList(generics.ListCreateAPIView):
    """
    List all listings, or create a new listing.
    """

    queryset = Listing.objects.annotate(
        listing_count=Count("owner__listing")
    ).order_by(
        "-listing_count"
    )
    serializer_class = ListingSerializer
    permission_classes = [IsAdminUserOrReadOnly]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    filterset_class = ListingFilter
    search_fields = [
        "city",
        "postcode",
        "address_street",
    ]

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)


class ListingDetail(generics.RetrieveUpdateDestroyAPIView):
    """
    Retrieve, update or delete a listing.
    """

    queryset = Listing.objects.all()
    serializer_class = ListingSerializer
    permission_classes = [IsAdminUserOrReadOnly]

    filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    filterset_fields = ["owner", "type", "price", "sale_type"]
    search_fields = [
        "owner__username",
        "city",
        "price",
        "postcode",
        "sale_type",
        "type",
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
