from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework import viewsets
from profiles import serializers
from profiles import models
from rest_framework.authentication import TokenAuthentication
from profiles import permissions
from rest_framework import filters
from rest_framework.authtoken.views import ObtainAuthToken
from rest_framework.settings import api_settings
# Create your views here.

# # Create your views here.

class UserProfileViewSet(viewsets.ModelViewSet):
	"""Handle creating and updating profiles
	"""
	serializer_class = serializers.UserProfileSerializer
	queryset = models.UserProfile.objects.all()
	authentication_classes = (TokenAuthentication,)
	permission_classes = (permissions.UpdateOwnProfile,)
	filter_backends = (filters.SearchFilter,)
	search_fields = ('username', 'email')
