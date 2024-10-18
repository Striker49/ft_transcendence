from django.shortcuts import render
from . import serializers, models, permissions
from rest_framework.authentication import TokenAuthentication
from rest_framework.authtoken.views import ObtainAuthToken
from rest_framework.authtoken.models import Token
from django.contrib.auth import authenticate
from rest_framework.settings import api_settings
from rest_framework import generics, status, viewsets, filters
from django.http import JsonResponse
from rest_framework.response import Response
from .serializers import AuthCustomTokenSerializer
from rest_framework.views import APIView
from rest_framework.permissions import AllowAny
from django.utils import timezone

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
	permission_classes = [AllowAny]
	
	# def create(self, request, *args, **kwargs):
	# 	serializer = serializers.RegistrationSerializer(data=request.data)
	# 	serializer.is_valid(raise_exception=True)
	# 	self.perform_create(serializer)
	# 	return Response(serializer.data, status=status.HTTP_201_CREATED)

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
		})
  
class UserDetail(generics.RetrieveAPIView):
	queryset = models.CustomUser.objects.all()
	serializer_class = serializers.CustomUserSerializer
 
 # updates the database with the given selection and redirects to the results view function
def hello(request):
    if request.method == 'GET':
    	return JsonResponse({'message':'hello world'})
