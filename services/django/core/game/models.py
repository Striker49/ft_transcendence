from django.db import models
from django.utils import timezone, dateformat
from django.conf import settings
from django.db.models import Q

# Create your models here.

class GameStats(models.Model):
	"""Database model for users un the system"""
	created = models.DateTimeField(auto_now_add=True)
	UID=models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
	wins=models.PositiveIntegerField(default=0)
	losses=models.PositiveIntegerField(default=0)
	perfect_games=models.PositiveIntegerField(default=0)
	rank=models.PositiveIntegerField(default=0, blank=True, null=True)
	last_played=models.DateTimeField(blank=True, null=True)

	class Meta:
		ordering = ['id']
		verbose_name = "Game Stat"
  
	@property
	def win_percentage(self):
		if self.total_games > 0:
			return (self.wins / self.total_games) * 100
		return 0

	@property
	def total_games(self):
		return self.wins + self.losses

	def formatted_created(self):
		return self.created.strftime("%Y-%m-%d %H:%M:%S")

	def calculate_rank(self):
		if self.wins == 0 and self.losses == 0:
			return None 
		rank = GameStats.objects.filter(
			Q(wins__gt=self.wins) | 
			(Q(wins=self.wins) & Q(losses__lt=self.losses))
		).count()
		return rank + 1

	def formatted_created(self):
		local_created = timezone.localtime(self.created)
		return local_created.strftime("%Y-%m-%d %H:%M:%S")
	def save(self, *args, **kwargs):
		self.rank = self.calculate_rank()
		super().save(*args, **kwargs)

	def __str__(self):
		"""Return string representation of our user"""
		return self.UID.__str__()


class PlayedGames(models.Model):
	"""Database model for users un the system"""
	created = models.DateTimeField(auto_now_add=True)
	player1_UID=models.ForeignKey(settings.AUTH_USER_MODEL, 
                               on_delete=models.SET_NULL, 
                               related_name="player1_games",
                               null=True)
	player2_UID=models.ForeignKey(settings.AUTH_USER_MODEL, 
                               on_delete=models.CASCADE, 
                               related_name="player2_games", 
                               null=True, 
                               blank=True)
	username_player1=models.CharField(max_length=256, blank=True, null=True)
	username_player2=models.CharField(max_length=256, blank=True, null=True)
	score_player1=models.PositiveIntegerField(default=0)
	score_player2=models.PositiveIntegerField(default=0)
 
	class Meta:
		ordering = ['created']
		indexes = [
			models.Index(fields=['player1_UID', 'player2_UID']),
		]
		verbose_name = "Game played"
		verbose_name_plural = "Games Played"

	def __str__(self):
		"""Return string representation of our user"""
		formated_date = dateformat.format(timezone.localtime(timezone.now()), 'Y-m-d H:i:s',)
		if self.player2_UID:
			opponent = self.player2_UID.username
		elif self.username_player2:
			opponent = self.username_player2
		else:
			opponent = "AI"
		return  self.username_player1.__str__() + " vs " + opponent + " (" + formated_date.__str__() + ")"

	def formatted_created(self):
		local_created = timezone.localtime(self.created)
		return local_created.strftime("%Y-%m-%d %H:%M:%S")

	def save(self, *args, **kwargs):
		if self.player1_UID:
			self.username_player1 = self.player1_UID.username
		super().save(*args, **kwargs)