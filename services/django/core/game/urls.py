from django.urls import path, include
from game import views
from rest_framework.routers import DefaultRouter

router = DefaultRouter()
router.register('', views.GameViewSet)

urlpatterns = [
	path('ranking/', views.GamesRanking.as_view(), name="game-ranking"),
	path('', include(router.urls), name='game')
]