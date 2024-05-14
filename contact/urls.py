from django.urls import path
from .views import ContactFormList, ContactFormDetail, contact_form_create


urlpatterns = [
    path("contact/", contact_form_create, name="contact-form-list"),
    path("contact_list/", ContactFormList.as_view()),
    path("contact_list/<int:pk>/", ContactFormDetail.as_view()),
]
