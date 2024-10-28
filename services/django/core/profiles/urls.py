from django.urls import path, include
from profiles import views
from rest_framework.routers import DefaultRouter

router = DefaultRouter()
router.register('friendship', views.UserFriendshipViewSet, basename='user-friendship')
router.register('', views.UserProfileViewSet, basename='user-profile')

urlpatterns = [
	path('', include(router.urls), name='profile')
]
