from django.shortcuts import render
from rest_framework import viewsets
from game import serializers, models, permissions
from rest_framework.authentication import TokenAuthentication
from rest_framework import filters, status
from rest_framework.exceptions import MethodNotAllowed
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.generics import ListAPIView
from django.db.models import Q
from rest_framework.exceptions import NotFound
from django.shortcuts import get_object_or_404
from rest_framework.permissions import IsAuthenticated

# Create your views here.
class GameViewSet(viewsets.ModelViewSet):
	"""Handle gamestats"""
	serializer_class = serializers.GameStatsSerializer
	authentication_classes = (TokenAuthentication,)
	permission_classes = (permissions.UpdateGameStats,)
	filter_backends = (filters.SearchFilter,)
	search_fields = ('UID__username', 'UID__email')
	queryset = models.GameStats.objects.all()

	lookup_field = 'UID'

	def create(self, request, *args, **kwargs):
		raise MethodNotAllowed("POST")

	def get_queryset(self):
		"""Get the stats based on search query or return the logged-in user's profile."""
		user = self.request.user
		queryset = models.GameStats.objects.all()

		search = self.request.query_params.get('search', None)
		if search:
			queryset = queryset.filter(
				Q(UID__username__exact=search) | 
				Q(UID__email__exact=search)
			)
			if queryset.count() == 0:
				raise NotFound({"detail":"No UserStats matches the given query."})
				
		elif user.is_authenticated:
			# If user is authenticated, include their stats
			queryset = queryset.filter(UID=user)

		return queryset

class GamesRanking(ListAPIView):
	serializer_class = serializers.RankingSerializer
	queryset = models.GameStats.objects.all()

	def get_queryset(self):
		"""Get the profiles based on search query or return the logged-in user's profile."""
		limit = int(self.request.query_params.get('limit', 10))
		queryset = models.GameStats.objects.exclude().order_by('-wins')[:limit]

		return queryset

class PlayedGamesViewSet(viewsets.ModelViewSet):
	"""Handle gamestats"""
	serializer_class = serializers.PlayedGamesSerializer
	authentication_classes = (TokenAuthentication,)
	permission_classes = (permissions.UpdatePlayedGames, IsAuthenticated)
	queryset = models.PlayedGames.objects.all()
	filter_backends = (filters.SearchFilter,)
	search_fields = ('player1_UID__username', 'player1_UID__email')

	def get_queryset(self):
		"""Get the stats based on search query or return the logged-in user's profile."""
		user = self.request.user
		queryset = models.PlayedGames.objects.all()

		search = self.request.query_params.get('search', None)
		if search:
			queryset = queryset.filter(
				Q(player1_UID__username__exact=search) | 
				Q(player1_UID__email__exact=search)
			)
			if queryset.count() == 0:
				raise NotFound({"detail":"No UserStats matches the given query."})
				
		elif user.is_authenticated:
			# If user is authenticated, include their stats
			queryset = queryset.filter(player1_UID=user)

		return queryset

	def create(self, request, *args, **kwargs):
		"""played game creation function"""
		serializer = self.get_serializer(data=request.data)
		serializer.is_valid(raise_exception=True)
		instance = serializer.save()

		player1_stats = get_object_or_404(models.GameStats, UID=instance.player1_UID)
		if player1_stats:
			if instance.score_player1 > instance.score_player2:
				player1_stats.wins += 1
			else:
				player1_stats.losses += 1
			player1_stats.last_played = instance.created
			player1_stats.save()
   
		if instance.player2_UID:
			player2_stats = get_object_or_404(models.GameStats, UID=instance.player2_UID)
			if instance.score_player2 > instance.score_player1:
				player2_stats.wins += 1
			else:
				player2_stats.losses += 1
			player2_stats.last_played = instance.created
			player2_stats.save()
   
		response_data = {
			'message': "Game created successfully",
			'stats' : serializer.data
		}
		return Response(response_data, status=status.HTTP_201_CREATED)