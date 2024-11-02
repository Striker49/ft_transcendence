from django.urls import path, include
from users import views
from rest_framework.routers import DefaultRouter

router = DefaultRouter()
router.register('', views.UserViewSet)

app_name = "users"
urlpatterns = [
    path('registration/', views.UserRegistrationAPIView.as_view(), name='register'),
    path('login/', views.UserLoginApiView.as_view()),  # Explicit login route
    path("", include(router.urls)),  # UserViewSet will use /api/users/
    path('<int:pk>/', views.UserDetail.as_view(), name='user-detail')  # User details route
]
