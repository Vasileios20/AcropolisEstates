from django.urls import path, include
from rest_framework.routers import DefaultRouter
from listings import views

router = DefaultRouter()
router.register(r'owners', views.OwnerViewSet, basename='owner')

urlpatterns = [
    path("listings/", views.ListingList.as_view()),
    path("listings/", include(router.urls)),
    path("listings/<int:pk>/", views.ListingDetail.as_view()),
    path("listings/<int:listing_id>/images/",
         views.DeleteImageView.as_view()),
    path("listings/<int:listing_id>/images/reorder-images/",
         views.reorder_images),
    path("amenities/", views.AmenitiesList.as_view()),
    path("amenities/bulk/", views.BulkCreateAmenitiesView.as_view()),
]
