from django.urls import path, include
from users import views

app_name = "users"
urlpatterns = [
	path("", views.UserViewSet.as_view({'get': 'list'}), name="users"),
	path('login/', views.UserLoginApiView.as_view()),
	path('<int:pk>/', views.UserDetail.as_view(), name='user-detail')
]
