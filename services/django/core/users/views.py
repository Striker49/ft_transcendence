from django.shortcuts import render, get_object_or_404, redirect
from django.views.decorators.csrf import csrf_exempt
from . import serializers, models, permissions
from rest_framework.authentication import TokenAuthentication
from rest_framework.authtoken.views import ObtainAuthToken
from rest_framework.authtoken.models import Token
from django.contrib.auth import authenticate
from rest_framework.settings import api_settings
from rest_framework import generics, status, viewsets, filters
from django.http import JsonResponse, HttpResponse
from rest_framework.response import Response
from .serializers import AuthCustomTokenSerializer
from rest_framework.views import APIView
from rest_framework.permissions import AllowAny
from django.utils import timezone
from urllib.parse import urlencode
from Django import settings
import requests
from rest_framework.exceptions import PermissionDenied

# Create your views here.
class UserViewSet(viewsets.ModelViewSet):
	"""Handle creating and updating users
	"""
	serializer_class = serializers.CustomUserSerializer
	queryset = models.CustomUser.objects.all()
	authentication_classes = (TokenAuthentication,)
	permission_classes = (permissions.IsAuthenticatedOrCreateOnly, permissions.UpdateOwnUser,)
	filter_backends = (filters.SearchFilter,)
	search_fields = ('name', 'email', )
	
	def get_permissions(self):
		if self.action == 'create':
			return [AllowAny()]
		return [permissions.IsAuthenticatedOrCreateOnly(), permissions.UpdateOwnUser()]
    
	def create(self, request, *args, **kwargs):
		"""User creation function"""
		serializer = self.get_serializer(data=request.data)
		serializer.is_valid(raise_exception=True)
		self.perform_create(serializer)
		response_data = {
			'message': "User created successfully",
			'user' : serializer.data
		}
		return Response(response_data, status=status.HTTP_201_CREATED)


class UserRegistrationAPIView(APIView):
	"""Register new users and creates their profile
	"""
	serializer_class = serializers.RegistrationSerializer
	authentication_classes = (TokenAuthentication,)
	permission_classes = [AllowAny]

	def post(self, request, format=None):
		serializer = self.serializer_class(data=request.data)
		serializer.is_valid(raise_exception=True)
		serializer.save()
		response_data = {
			'success': True,
			'message': "User registerd successfully",
			'user' : serializer.data
		}
		return Response(response_data, status=status.HTTP_201_CREATED)


class UserLoginApiView(ObtainAuthToken):
	"""Handle creating user authentication tokens
	"""
	renderer_classes = api_settings.DEFAULT_RENDERER_CLASSES
	authentication_classes = (TokenAuthentication,)
	permission_classes = [AllowAny]
	serializer_class = AuthCustomTokenSerializer
 
	def post(self, request, *args, **kwargs):
		"""log in user using either their email or their username"""
		serializer = self.serializer_class(data=request.data)	
		serializer.is_valid(raise_exception=True)
  
		user = serializer.validated_data['user']
		token, created = Token.objects.get_or_create(user=user)
  
		user.last_login = timezone.now()
		user.save(update_fields=['last_login'])

		return Response({
			'message': "User connected succesfully",
			'token': token.key,
			'UID': user.id,
			'username': user.username,
			'lang_pref': user.profile.lang,
		})

class User42LoginView(APIView):
	permission_classes = [AllowAny]

	def get(self, reqeust):
		params = {
			'client_id': settings.OAUTH_CLIENT_ID,
			'redirect_uri': settings.OAUTH_REDIRECT_URI,
			'response_type': 'code',
		}
		url = f"{settings.OAUTH_AUTHORIZE_URL}?{urlencode(params)}"
		return redirect(url)

class User42CallbackView(APIView):
	permission_classes = [AllowAny]

	def get(self, request):
		"""Handles the OAuth2 callback from 42 API."""
		code = request.GET.get('code')
		if not code:
			return Response({'error': 'Authorization code not provided'}, status=status.HTTP_400_BAD_REQUEST)

		# Exchange the authorization code for an access token
		token_data = self.get_access_token(code)
		if 'error' in token_data:
			return Response({'error1': token_data['error']}, status=status.HTTP_400_BAD_REQUEST)

		# Retrieve user information from 42 API
		user_data = self.get_user_data(token_data['access_token'])
		if 'error' in user_data:
			return Response({'error': user_data['error']}, status=status.HTTP_400_BAD_REQUEST)

		# Authenticate or create the user
		user = self.authenticate_or_register_user(user_data)

		# Generate a token for the user
		token, _ = Token.objects.get_or_create(user=user)

		return Response({
			'message': 'User authenticated successfully',
			'token': token.key,
			'UID': user.id,
			'username': user.username,
		})

	def get_access_token(self, code):
		"""Exchange authorization code for an access token."""
		data = {
			'grant_type': 'authorization_code',
			'client_id': settings.OAUTH_CLIENT_ID,
			'client_secret': settings.OAUTH_CLIENT_SECRET,
			'redirect_uri': settings.OAUTH_REDIRECT_URI,
			'code': code,
		}
		response = requests.post(settings.OAUTH_TOKEN_URL, data=data)
		return response.json()

	def get_user_data(self, access_token):
		"""Retrieve user information from 42 API."""
		headers = {'Authorization': f'Bearer {access_token}'}
		response = requests.get(settings.OAUTH_USER_INFO_URL, headers=headers)
		return response.json()

	def authenticate_or_register_user(self, user_data):
		"""Authenticate the user, but do not register them if they don't exist."""
		email = user_data['email']
		username = user_data['login']

		# Try to find the user by email or username
		try:
			user = models.CustomUser.objects.get(email=email)  # You can also try with username if needed
		except models.CustomUser.DoesNotExist:
			# If user does not exist, return an error response
			raise PermissionDenied('User not found. Please register first.')

		# Optionally, you can add additional checks or actions, like ensuring the account is active.

		return user

class UserDetail(generics.RetrieveAPIView):
	queryset = models.CustomUser.objects.all()
	serializer_class = serializers.CustomUserSerializer
 
 # updates the database with the given selection and redirects to the results view function
def hello(request):
    if request.method == 'GET':
    	return JsonResponse({'message':'hello world'})

def test_view(request):
    if request.user.is_authenticated:
        request.user.update_last_request()
        print(f"Authenticated User: {request.user.username}")
    return HttpResponse("Last request updated")
