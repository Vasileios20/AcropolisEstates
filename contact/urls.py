from django.urls import path
from .views import ContactFormCreate, ContactFormList


urlpatterns = [
    path("contact/", ContactFormCreate.as_view(), name="contact-form-list"),
    path("contact_list/", ContactFormList.as_view()),
]
