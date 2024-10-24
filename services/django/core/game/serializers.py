from rest_framework import serializers
from game import models

class GameStatsSerializer(serializers.ModelSerializer):
	"""serialises a gamestats object"""
	UID = serializers.ReadOnlyField(source='UID.id')
	win_percentage = serializers.ReadOnlyField()
	total_games = serializers.ReadOnlyField()
	rank = serializers.ReadOnlyField()
	username = serializers.ReadOnlyField(source='UID.username')

	class Meta:
		model = models.GameStats
		fields = (
			'UID',
			'username',
			'wins',
			'losses',
			'total_games',
			'win_percentage',
			'rank',
			'last_played',
		)
		extra_kwargs = {
		'losses': {'required': False},
		'wins': {'required': False},
		'last_played': {'required': False},
		}


class RankingSerializer(serializers.ModelSerializer):
	"""serialises a gamestats object"""
	username = serializers.ReadOnlyField(source='UID.username')
	rank = serializers.ReadOnlyField()

	class Meta:
		model = models.GameStats
		fields = (
			'UID',
			'username',
			'rank',
			'wins',
		)
		extra_kwargs = {
		'wins': {'required': False},
		}
  
class PlayedGamesSerializer(serializers.ModelSerializer):
	"""serialises a playedgame object"""

	game_id = serializers.ReadOnlyField(source='id')
 
	class Meta:
		model = models.PlayedGames
		fields = (
			'game_id',
			'created',
			'player1_UID',
			'player2_UID',
			'username_player2',
			'score_player1',
			'score_player2',
		)
		extra_kwargs = {
		'player2_UID': {'required': False},
		'username_player2': {'required': False},
		}