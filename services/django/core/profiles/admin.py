from django.contrib import admin
from profiles import models

# Register your models here.

admin.site.register(models.UserProfile)
admin.site.register(models.UserFriendship)