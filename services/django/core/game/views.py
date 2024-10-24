from django.shortcuts import render
from rest_framework import viewsets
from game import serializers, models, permissions
from rest_framework.authentication import TokenAuthentication
from rest_framework import filters, status
from rest_framework.exceptions import MethodNotAllowed
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.generics import ListAPIView

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

	@action(detail=True, methods=['post'], permission_classes=[permissions.UpdateGameStats])
	def win(self, request, UID=None):
		"""Increment wins for the specified game stats"""
		game_stats = self.get_object()
		game_stats.wins += 1
		game_stats.save()
		return Response({"message": "Win count updated successfully!"}, status=status.HTTP_200_OK)

	@action(detail=True, methods=['post'], permission_classes=[permissions.UpdateGameStats])
	def lose(self, request, UID=None):
		"""Increment losses for the specified game stats"""
		game_stats = self.get_object()
		game_stats.losses += 1
		game_stats.save()
		return Response({"message": "Losses count updated successfully!"}, status=status.HTTP_200_OK)

	def get_queryset(self):
		"""Get the profiles based on search query or return the logged-in user's profile."""
		user = self.request.user
		queryset = models.GameStats.objects.all()

		search = self.request.query_params.get('search', None)
		if search:
			queryset = queryset.filter(
				Q(UID__username__exact=search) | 
				Q(UID__email__exact=search)
			)
			if not queryset.exists():
				raise NotFound({"detail":"No UserProfile matches the given query."})
				
		elif user.is_authenticated:
			# If user is authenticated, include their profile
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
