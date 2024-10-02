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
		testuser = CustomUser.objects.create_user(
			email='test@test.com',
			name='Test',
			password='testpass'
		)
		self.assertEqual(testuser.email,'test@test.com')
		self.assertEqual(testuser.name,'Test')
		self.assertTrue(testuser.check_password("testpass"))

	def test_no_email(self):
		"""If no email is entered, an appropriate message is displayed."""
		with self.assertRaises(ValueError) as context:
			self.manager.create_user(
				email=None,
				name='Test Usr',
				password='testpass'
			)
		self.assertEqual(str(context.exception), 'Users must have an email address')


