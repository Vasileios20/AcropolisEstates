from django.urls import path, include
from rest_framework.routers import DefaultRouter
from listings import views
from listings.file_viewsets import (
    ListingFileViewSet, ShortTermListingFileViewSet
)


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
    path('owners/<int:owner_id>/files/<int:file_id>/',
         views.delete_file, name='delete_file'),
    path("short-term-listings/", views.ShortTermListingList.as_view()),
    path("short-term-listings/<int:pk>/",
         views.ShortTermListingDetail.as_view()),
    path("short-term-listings/<int:listing_id>/images/",
         views.DeleteShortTermImages.as_view()),
    path("short-term-listings/<int:listing_id>/images/reorder-images/",
         views.reorder_images_short_term),
    path(
        "short-term-listings/<int:listing_id>/availability/",
        views.ListingAvailabilityView.as_view(),
        name="listing-availability",
    ),
    path("listings/<int:listing_id>/files/",
         ListingFileViewSet.as_view({'get': 'list', 'post': 'create'}),
         name='listing-files-list'),
    path("listings/<int:listing_id>/files/<int:pk>/",
         ListingFileViewSet.as_view({
             'get': 'retrieve',
             'put': 'update',
             'patch': 'partial_update',
             'delete': 'destroy'
         }),
         name='listing-files-detail'),
    path("listings/<int:listing_id>/files/<int:pk>/download/",
         ListingFileViewSet.as_view({'get': 'download'}),
         name='listing-files-download'),
    path("short-term-listings/<int:listing_id>/files/",
         ShortTermListingFileViewSet.as_view(
             {'get': 'list', 'post': 'create'}),
         name='short-term-listing-files-list'),
    path("short-term-listings/<int:listing_id>/files/<int:pk>/",
         ShortTermListingFileViewSet.as_view({
             'get': 'retrieve',
             'put': 'update',
             'patch': 'partial_update',
             'delete': 'destroy'
         }),
         name='short-term-listing-files-detail'),
    path("short-term-listings/<int:listing_id>/files/<int:pk>/download/",
         ShortTermListingFileViewSet.as_view({'get': 'download'}),
         name='short-term-listing-files-download'),
]
