from .models import ContactForm
from .serializers import ContactFormSerializer
from rest_framework import generics, permissions, filters
from django_filters import rest_framework as filter
from django_filters.rest_framework import DjangoFilterBackend


class ContactFormFilter(filter.FilterSet):
    min_created_at = filter.DateFilter(field_name="created_at", lookup_expr="gte")
    max_created_at = filter.DateFilter(field_name="created_at", lookup_expr="lte")

    class Meta:
        model = ContactForm
        fields = ["name", "email", "subject", "created_at"]


class ContactFormCreate(generics.CreateAPIView):
    queryset = ContactForm.objects.all()
    serializer_class = ContactFormSerializer

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)


class ContactFormList(generics.ListAPIView):
    queryset = ContactForm.objects.all()
    serializer_class = ContactFormSerializer
    permission_classes = [permissions.IsAdminUser]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    filterset_class = ContactFormFilter
    search_fields = [
        "name",
        "email",
        "subject",
        "created_at",
    ]
