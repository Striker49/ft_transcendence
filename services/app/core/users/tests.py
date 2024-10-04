from django.test import TestCase
import datetime
from django.utils import timezone
from .models import CustomUser, UserManager
from django.urls import reverse

# Create your tests here.

class UserManagerTest(TestCase):
	
	def setUp(self):
		"""The will run before all other tests"""
		self.manager = UserManager()

	def test_user_creation(self):
		"""Test to see if user creation works"""
		user = CustomUser.objects.create_user(email='test@example.com', name='Test User', password='password123')
		self.assertIsNotNone(user)
		self.assertEqual(user.email, 'test@example.com')
		self.assertTrue(user.check_password('password123'))


	def test_no_email(self):
		"""If no email is entered, an appropriate message is displayed."""
		with self.assertRaises(ValueError) as context:
			self.manager.create_user(
				email=None,
				name='Test',
				password='testpass'
			)
		self.assertEqual(str(context.exception), 'Users must have an email address')

	def test_no_name(self):
		"""If no email is entered, an appropriate message is displayed."""
		with self.assertRaises(ValueError) as context:
			self.manager.create_user(
				email='test@example.com',
				name=None,
				password='testpass'
			)
		self.assertEqual(str(context.exception), 'Users must have a name')
	
	


