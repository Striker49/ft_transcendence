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
from django.db.models import Q
from rest_framework.exceptions import NotFound
from rest_framework.exceptions import MethodNotAllowed
# Create your views here.

	# # Create your views here.

class UserProfileViewSet(viewsets.ModelViewSet):
	"""Handle creating and updating profiles"""
	serializer_class = serializers.UserProfileSerializer
	authentication_classes = (TokenAuthentication,)
	permission_classes = (permissions.UpdateOwnProfile,)
	filter_backends = (filters.SearchFilter,)
	search_fields = ('UID__username', 'UID__email')
	queryset = models.UserProfile.objects.all()

	lookup_field = 'UID'

	def create(self, request, *args, **kwargs):
		raise MethodNotAllowed("POST")

	def get_queryset(self):
		"""Get the profiles based on search query or return the logged-in user's profile."""
		user = self.request.user
		queryset = models.UserProfile.objects.all()

		search = self.request.query_params.get('search', None)
		if search:
			queryset = queryset.filter(
				Q(UID__username__exact=search) | 
				Q(UID__email__exact=search)
			)
			if not queryset.exists():
				raise NotFound({"detail":"No UserProfile matches the given query."})
				
		elif user.is_authenticated:
			# If user is authenticated, include their profile
			queryset = queryset.filter(UID=user)
			
		limit = int(self.request.query_params.get('limit', 10))
		queryset = models.UserProfile.objects.all()[:limit]

		return queryset
