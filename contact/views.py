from .models import ContactForm
from .serializers import ContactFormSerializer
from rest_framework import generics, permissions


class ContactFormCreate(generics.CreateAPIView):
    queryset = ContactForm.objects.all()
    serializer_class = ContactFormSerializer

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)


class ContactFormList(generics.ListAPIView):
    queryset = ContactForm.objects.all()
    serializer_class = ContactFormSerializer
    permission_classes = [permissions.IsAdminUser]
