from django.urls import path
from listings import views

urlpatterns = [
    path("listings/", views.ListingList.as_view()),
    path("listings/<int:pk>/", views.ListingDetail.as_view()),
    path("listings/<int:listing_id>/images/",
         views.DeleteImageView.as_view()),
    path("amenities/", views.AmenitiesList.as_view()),
    path("amenities/bulk/", views.BulkCreateAmenitiesView.as_view()),
]
