from django.urls import path
from .views import ContactFormList


urlpatterns = [
    path("contact/", ContactFormList.as_view(), name="contact-form-list"),
]
