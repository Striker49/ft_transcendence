from django.urls import path, include
from game import views
from rest_framework.routers import DefaultRouter

router = DefaultRouter()
router.register('stats', views.GameViewSet, basename='game-stats')
router.register('played', views.PlayedGamesViewSet, basename='game-played')

urlpatterns = [
	path('ranking/', views.GamesRanking.as_view(), name="game-ranking"),
	path('', include(router.urls), name='game')
]