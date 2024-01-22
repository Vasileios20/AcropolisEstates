from django.db.models import Count
from rest_framework import generics, permissions, filters
from django_filters.rest_framework import DjangoFilterBackend
from .models import Listing
from .serializers import ListingSerializer
from re_drf_api.permissions import IsOwnerOrReadOnly


class ListingList(generics.ListCreateAPIView):
    """
    List all listings, or create a new listing.
    """

    queryset = Listing.objects.annotate(listing_count=Count("owner__listing")).order_by(
        "-listing_count"
    )
    serializer_class = ListingSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    filterset_fields = ["owner", "type", "price", "sale_type"]
    search_fields = ["owner__username", "city", "price", "postcode"]

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)


class ListingDetail(generics.RetrieveUpdateDestroyAPIView):
    """
    Retrieve, update or delete a listing.
    """

    queryset = Listing.objects.all()
    serializer_class = ListingSerializer
    permission_classes = [IsOwnerOrReadOnly]

    filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    filterset_fields = ["owner", "type", "price", "sale_type"]
    search_fields = ["owner__username", "city", "price", "postcode"]
