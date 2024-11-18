from django.urls import path, include
from users import views
from rest_framework.routers import DefaultRouter

router = DefaultRouter()
router.register('', views.UserViewSet)

app_name = "users"
urlpatterns = [
    path('test/', views.test_view, name='test-view'),
    path('registration/', views.UserRegistrationAPIView.as_view(), name='register'),
    path('login/', views.UserLoginApiView.as_view()),  # Explicit login route
    path('42/login/', views.User42LoginView.as_view(), name='oauth42-login'),
    path('42/callback/', views.User42CallbackView.as_view(), name='oauth42-callback'),
    path("", include(router.urls)),  # UserViewSet will use /api/users/
    path('<int:pk>/', views.UserDetail.as_view(), name='user-detail'),  # User details route
]
