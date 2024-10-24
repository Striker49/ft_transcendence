from django.db import models
from django.conf import settings
from django.contrib.auth.models import AbstractBaseUser
from django.contrib.auth.models import PermissionsMixin
from django.contrib.auth.models import BaseUserManager

class UserManager(BaseUserManager):
	"""Manager for users"""

	def create_user(self, email, username, password):
		"""create a new user"""
		if not email:
			raise ValueError('Users must have an email address')
		if not password:
			raise ValueError('Users must have a password')
		if not username:
			raise ValueError('Users must have a username')

		email = self.normalize_email(email)
		user = self.model(email=email, username=username)

		user.set_password(password)
		user.save(using=self._db)

		return user

	def create_superuser(self, email, password, username):
		"""Create and save a new superuser with the given details"""
		user = self.create_user(email, username, password)
  
		user.is_superuser = True
		user.is_staff = True
		user.save(using=self._db)

		return user

class CustomUser(AbstractBaseUser, PermissionsMixin):
	"""Database model for the users that will be created"""
	created = models.DateTimeField(auto_now_add=True) #Created a field with date of creation.
	last_login = models.DateTimeField(blank=True, null=True)
	email= models.EmailField(max_length=255, unique=True) #users email adress will be used as login.
	username=models.CharField(max_length=255, unique=True) #users unique username
	is_active = models.BooleanField(default=True)
	is_staff = models.BooleanField(default=False)

	objects = UserManager()

	USERNAME_FIELD = 'username'
	REQUIRED_FIELDS = ['email',]
 
	class Meta:
		ordering = ['created']
	
	def __str__(self):
		"""Return string representation of our user"""
		return self.email
