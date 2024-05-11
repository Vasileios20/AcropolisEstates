from .models import ContactForm
from .serializers import ContactFormSerializer
from rest_framework import generics, permissions, filters
from django_filters import rest_framework as filter
from django_filters.rest_framework import DjangoFilterBackend


class ContactFormFilter(filter.FilterSet):
    """
    This class is used to filter the contact form by name, email, subject
    and created_at
    It also allows to filter the contact form by the date it was created
    """

    min_created_on = filter.DateFilter(
        field_name="created_on", lookup_expr="gte")
    max_created_on = filter.DateFilter(
        field_name="created_on", lookup_expr="lte")

    class Meta:
        model = ContactForm
        fields = ["first_name", "last_name", "email",
                  "phone_number", "subject", "created_on"]


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
        "first_name",
        "last_name",
        "email",
        "phone_number",
        "subject",
        "created_on",
    ]


class ContactFormDetail(generics.RetrieveAPIView):
    queryset = ContactForm.objects.all()
    serializer_class = ContactFormSerializer
    permission_classes = [permissions.IsAdminUser]
