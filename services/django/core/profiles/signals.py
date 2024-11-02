from django.db.models.signals import post_save
from django.dispatch import receiver
from users.models import CustomUser
from profiles.models import UserProfile

# @receiver(post_save, sender=CustomUser)
# def create_user_profile(sender, instance, created, **kwargs):
# 	"""Creates a user profile automatically when a user is created"""
# 	if created:
# 		UserProfile.objects.create(UID=instance)