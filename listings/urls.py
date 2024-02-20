from django.urls import path
from listings import views

urlpatterns = [
    path("listings/", views.ListingList.as_view()),
    path("listings/<int:pk>/", views.ListingDetail.as_view()),
    path("listings/<int:listing_id>/images/<int:pk>/",
         views.DeleteImageView.as_view()),
]
