from rest_framework import serializers
from game import models

class GameStatsSerializer(serializers.ModelSerializer):
	"""serialises a gamestats object"""
	UID = serializers.ReadOnlyField(source='UID.id')
	win_percentage = serializers.ReadOnlyField()
	total_games = serializers.ReadOnlyField()
	rank = serializers.ReadOnlyField()

	class Meta:
		model = models.GameStats
		fields = (
			'UID',
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