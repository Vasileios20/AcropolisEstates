from django.db.models import Count
from rest_framework import generics, permissions, filters
from django_filters.rest_framework import DjangoFilterBackend
from .models import Listing
from .serializers import ListingSerializer
from re_drf_api.permissions import IsOwnerOrReadOnly, IsAdminUserorReadOnly
from django_filters import rest_framework as filter


class ListingFilter(filter.FilterSet):
    min_price = filter.NumberFilter(field_name="price", lookup_expr="gte")
    max_price = filter.NumberFilter(field_name="price", lookup_expr="lte")

    min_bedrooms = filter.NumberFilter(field_name="bedrooms", lookup_expr="gte")
    max_bedrooms = filter.NumberFilter(field_name="bedrooms", lookup_expr="lte")

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

    queryset = Listing.objects.annotate(listing_count=Count("owner__listing")).order_by(
        "-listing_count"
    )
    serializer_class = ListingSerializer
    permission_classes = [IsAdminUserorReadOnly]
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
    permission_classes = [IsAdminUserorReadOnly]

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
