from django.shortcuts import render
from rest_framework import viewsets
from . import serializers
from . import models
from rest_framework.authentication import TokenAuthentication
from profiles import permissions
from rest_framework import filters
from rest_framework.authtoken.views import ObtainAuthToken
from rest_framework.settings import api_settings
from . import permissions
from rest_framework import generics

# Create your views here.
class UserViewSet(viewsets.ModelViewSet):
	"""Handle creating and updating profiles

	Args:
		viewsets (_type_): _description_
	"""
	serializer_class = serializers.CustomUserSerializer
	queryset = models.CustomUser.objects.all()
	authentication_classes = (TokenAuthentication,)
	permission_classes = (permissions.UpdateOwnCustomUser,)
	filter_backends = (filters.SearchFilter,)
	search_fields = ('name', 'email', )

class UserLoginApiView(ObtainAuthToken):
	"""Handle creating user authentication tokens

	Args:
		ObtainAuthToken (_type_): _description_
	"""
	renderer_classes = api_settings.DEFAULT_RENDERER_CLASSES

class UserDetail(generics.RetrieveAPIView):
	queryset = models.CustomUser.objects.all()
	serializer_class = serializers.CustomUserSerializer