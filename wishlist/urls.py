from django.urls import path
from wishlist import views

urlpatterns = [
    path("wishlist/", views.WishlistList.as_view()),
    path("wishlist/<int:pk>/", views.WishlistDetail.as_view()),
]
