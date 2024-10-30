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

def upload_to(instance, filename):
    return 'images/{filename}'.format(filename=filename)

class UserProfile(models.Model):
	"""Database model for users un the system"""
	created = models.DateTimeField(auto_now_add=True)
	UID=models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
	first_name=models.CharField(max_length=255, blank=True)
	last_name=models.CharField(max_length=255, blank=True)
	avatar_path=models.CharField(max_length=255, blank=True)
	image_url=models.ImageField(upload_to=upload_to, blank=True, null=True)
	bio=models.TextField(editable=True, blank=True)
	
	lang= models.CharField(max_length=2, choices=LANGUAGES, default='en')

	class Meta:
		ordering = ['created']
		verbose_name = "Profile"
	
	def __str__(self):
		"""Return string representation of our user"""
		return self.UID.__str__()

FRIENDSHIP_TYPES = [
	('pending_first_second', 'Pending first to second'),
	('pending_second_first', 'Pending second to first'),
	('friends', 'Friends'),
	('block_first_second', 'Blocked first to second'),
	('block_second_first', 'blocker second to first'),
	('block_both', 'Blocked both'),
]

class UserFriendship(models.Model):
	"""Database model for users un the system"""
	user1_ID=models.ForeignKey(settings.AUTH_USER_MODEL, 
                               on_delete=models.CASCADE, 
                               related_name="user1",
                               null=True)
	user2_ID=models.ForeignKey(settings.AUTH_USER_MODEL, 
                               on_delete=models.CASCADE, 
                               related_name="user2", 
                               null=True, 
                               blank=True)
	type=models.CharField(choices=FRIENDSHIP_TYPES)

	class Meta:
		ordering = ['user1_ID']
		verbose_name = "Friendship"
  
	def save(self, *args, **kwargs):
		if self.user1_ID.id >self.user2_ID.id:
			self.user1_ID, self.user2_ID = self.user2_ID, self.user1_ID
		super().save(*args, **kwargs)
	
	def __str__(self):
		"""Return string representation of our user"""
		return self.user1_ID.username + " + " + self.user2_ID.username

