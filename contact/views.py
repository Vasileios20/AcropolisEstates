from .models import ContactForm
from .serializers import ContactFormSerializer
from rest_framework import generics


class ContactFormList(generics.ListCreateAPIView):
    queryset = ContactForm.objects.all()
    serializer_class = ContactFormSerializer

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)
