from .models import Wishlist
from .serializers import WishlistSerializer
from rest_framework import generics, permissions
from re_drf_api.permissions import IsOwnerOrReadOnly


class WishlistList(generics.ListCreateAPIView):
    queryset = Wishlist.objects.all()
    serializer_class = WishlistSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)


class WishlistDetail(generics.RetrieveDestroyAPIView):
    queryset = Wishlist.objects.all()
    serializer_class = WishlistSerializer
    permission_classes = [IsOwnerOrReadOnly]
