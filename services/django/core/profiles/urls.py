from django.urls import path, include
from profiles import views
from rest_framework.routers import DefaultRouter

router = DefaultRouter()
router.register('', views.UserProfileViewSet)

urlpatterns = [
	path('', include(router.urls), name='profile')
]
