from django.db import models
from django.utils import timezone
from django.conf import settings
from django.db.models import Q

# Create your models here.

class GameStats(models.Model):
	"""Database model for users un the system"""
	created = models.DateTimeField(auto_now_add=True)
	UID=models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
	wins=models.PositiveIntegerField(default=0)
	losses=models.PositiveIntegerField(default=0)
	last_played=models.DateTimeField(blank=True, null=True)
 
	@property
	def win_percentage(self):
		if self.total_games > 0:
			return (self.wins / self.total_games) * 100
		return 0

	@property
	def total_games(self):
		return self.wins + self.losses

	@property
	def rank(self):
		total_players = GameStats.objects.count()
		rank = GameStats.objects.filter(Q(wins__gt=self.wins) | 
            (Q(wins=self.wins) & Q(losses__lt=self.losses))).count()
		return rank + 1 if rank <= total_players and (self.wins is not 0 and self.losses is not 0) else None


