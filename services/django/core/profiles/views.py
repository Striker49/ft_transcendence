from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, viewsets
from profiles import serializers
from profiles import models
from rest_framework.authentication import TokenAuthentication
from profiles import permissions
from rest_framework import filters
from rest_framework.authtoken.views import ObtainAuthToken
from rest_framework.settings import api_settings
from django.db.models import Q
from rest_framework.exceptions import NotFound, ValidationError, MethodNotAllowed
from rest_framework.permissions import IsAuthenticated
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
			
		queryset = models.UserProfile.objects.all()

		return queryset

class UserFriendshipViewSet(viewsets.ModelViewSet):
	"""Handle gamestats"""
	serializer_class = serializers.UserFriendshipSerializer
	authentication_classes = (TokenAuthentication,)
	permission_classes = [IsAuthenticated]
	queryset = models.UserFriendship.objects.all()
	filter_backends = (filters.SearchFilter,)
	search_fields = ('user1_ID__username', 'user1_ID__email','user2_ID__username', 'user2_ID__email' )

	def get_queryset(self):
		"""Get the friendship based on search query or return the logged-in user's profile."""
		user = self.request.user
		queryset = models.UserFriendship.objects.all()

		search = self.request.query_params.get('search', None)
		if search:
			queryset = queryset.filter(
				Q(user1_ID__username__exact=search) | 
				Q(user1_ID__email__exact=search) |
				Q(user2_ID__username__exact=search) |
                Q(user2_ID__email__exact=search)
			)
			if queryset.count() == 0:
				raise NotFound({"detail":"No UserFriendship matches the given query."})
				
		elif user.is_authenticated:
			queryset = queryset.filter(Q(user1_ID=user) | Q(user2_ID=user))

		return queryset

	def create(self, request, *args, **kwargs):
		"""friendship creation function"""
		serializer = self.get_serializer(data=request.data)
		serializer.is_valid(raise_exception=True)
		
  
		# Check if the friendship already exists
		user1_ID = request.data.get('user1_ID')
		user2_ID = request.data.get('user2_ID')
		if self.friendship_exists(user1_ID, user2_ID):
			friendship = models.UserFriendship.objects.get(
                Q(user1_ID=user1_ID, user2_ID=user2_ID) | 
                Q(user1_ID=user2_ID, user2_ID=user1_ID)
            )
			return Response({
                "detail": "Friendship already exists.",
                "friendship_id": friendship.id
            }, status=status.HTTP_200_OK)
		
		instance = serializer.save()
		response_data = {
			'message': "Friendship created successfully",
			'stats' : serializer.data
		}
		return Response(response_data, status=status.HTTP_201_CREATED)

	def friendship_exists(self, user1_ID, user2_ID):
		"""Check if a friendship already exists."""
		return models.UserFriendship.objects.filter(
			Q(user1_ID=user1_ID, user2_ID=user2_ID) | 
			Q(user1_ID=user2_ID, user2_ID=user1_ID)
		).exists()