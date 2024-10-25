from django.db import models
from users.models import CustomUser
import datetime
from django.utils import timezone
from django.conf import settings
from django.contrib.auth.models import AbstractBaseUser

# Create your models here.
LANGUAGES = [
	('en', 'English'),
	('fr', 'French'),
	('nl', 'Dutch'),
]

class UserProfile(models.Model):
	"""Database model for users un the system"""
	created = models.DateTimeField(auto_now_add=True)
	UID=models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
	first_name=models.CharField(max_length=255, blank=True)
	last_name=models.CharField(max_length=255, blank=True)
	avatar_path=models.CharField(max_length=255, blank=True)
	bio=models.TextField(editable=True, blank=True)
	
	lang= models.CharField(max_length=2, choices=LANGUAGES, default='en')

	class Meta:
		ordering = ['created']
		verbose_name = "Profile"
	
	def __str__(self):
		"""Return string representation of our user"""
		return self.UID.username
