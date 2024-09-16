from django.urls import path, include
from profiles import views
from rest_framework.routers import DefaultRouter

router = DefaultRouter()
router.register('hello-viewset', views.HelloViewSet, basename='hello-viewset')
router.register('profile', views.UserProfileViewSet)

urlpatterns = [
	path('hello-view/', views.HelloApiView.as_view(), name='hello-view'),
	path('login/', views.UserLoginApiView.as_view()),
	path('', include(router.urls), name='hello-viewset')
]
