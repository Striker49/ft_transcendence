from django.utils import timezone
from django.shortcuts import get_object_or_404
from .models import CustomUser
from rest_framework.authentication import TokenAuthentication
from rest_framework.exceptions import AuthenticationFailed


# Checks every request if a user is connected, if yes it updates last_request
class UpdateLastRequesMiddelware:
	def __init__(self, get_response):
		self.get_response = get_response
		self.authentication = TokenAuthentication()

	def __call__(self, request):
		auth = request.headers.get('Authorization', None)
		if auth:
			parts = auth.split()
			if len(parts) == 2 and parts[0].lower() == 'token':
				token = parts[1]
				try:
					user, _ = self.authentication.authenticate_credentials(token)
					request.user = user
				except AuthenticationFailed:
				
					request.user = None
		
		if request.user and request.user.is_authenticated:
			request.user.update_last_request()
			user_profile = request.user.profile
			if user_profile.status != 'on':
				user_profile.status = 'on'
				user_profile.save()
				print(f"User {request.user.username} came online.")

		response = self.get_response(request)
		return response