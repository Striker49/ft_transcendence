from django.contrib import admin
from game.models import GameStats, PlayedGames

# Register your models here.

admin.site.register(GameStats)
admin.site.register(PlayedGames)