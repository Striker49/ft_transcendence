from django.db import models
from django.conf import settings
from django.contrib.auth.models import AbstractBaseUser
from django.contrib.auth.models import PermissionsMixin
from django.contrib.auth.models import BaseUserManager

class UserManager(BaseUserManager):
	"""Manager for user profiles"""
	
	def create_user(self, email, name, password=None):
		"""create a new user profile"""
		if not email:
			raise ValueError('Users must have an email address')

		email = self.normalize_email(email)
		user = self.model(email=email, name=name)

		user.set_password(password)
		user.save(using=self._db)

		return user

	def create_superuser(self, email, name, password):
		"""Create and save a new superuser with the given details"""
		user = self.create_user(email, name, password)
  
		user.is_superuser = True
		user.save(using=self._db)

		return user

# Create your models here.
class CustomUser(AbstractBaseUser, PermissionsMixin):
	"""Database model for the users that will be created"""
	created = models.DateTimeField(auto_now_add=True) #Created a field with date of creation.
	email= models.EmailField(max_length=255, unique=True) #users email adress will be used as login.
	name=models.CharField(max_length=255) #name of the user
	profile_picture_path = models.CharField(max_length=255, blank=True)
	is_active = models.BooleanField(default=True)
	is_staff = models.BooleanField(default=False)

	objects = UserManager()

	USERNAME_FIELD = 'email'
	REQUIRED_FIELDS = ['name',]
 
	class Meta:
		ordering = ['created']
	
	def __str__(self):
		"""Return string representation of our user"""
		return self.email
