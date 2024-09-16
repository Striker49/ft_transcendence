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

# Create your views here.

class HelloApiView(APIView):
	"""Test API View

	Args:
		APIview (_type_): _description_
	"""
	serializer_class = serializers.HelloSerializers

	def get(self, request, fromat=None):
		"""Return a list of APIviews features

		Args:
			request (_type_): _description_
			fromat (_type_, optional): _description_. Defaults to None.
		"""

		an_apiview = [
			'Uses HTTP methods as function (get, post, patch, put, delete)',
			'Is similar to a traditional Django View',
			'Gives you the most control over your application logic',
			'Is mapped manually to URLs'
		]

		return Response({'message': 'Hello!', 'an_apiview': an_apiview})

	def post(self, request):
		"""Create a hello message with our name

		Args:
			request (_type_): _description_
		"""
		serializer = self.serializer_class(data=request.data)

		if serializer.is_valid():
			name = serializer.validated_data.get('name')
			message = f'Hello {name}'
			return Response({'message': message})
		else:
			return Response(
       			serializer.errors, 
          		status=status.HTTP_400_BAD_REQUEST
            )
   
	def put(self, request, pk=None):
		"""Handle updating an object"""
		serializer = self.serializer_class(data=request.data)

		if serializer.is_valid():
			name = serializer.validated_data.get('name')
			message = f'Hello {name}'
			return Response({'message': message})
		else:
			return Response(
       			serializer.errors, 
          		status=status.HTTP_400_BAD_REQUEST
            )

	def patch(seld, request, pl=None):
		"""Handle a partial update of an object

		Args:
			seld (_type_): _description_
			request (_type_): _description_
			pl (_type_, optional): _description_. Defaults to None.
		"""
		return Response({'method': 'PATCH'})

	def delete(self, request, pk=None):
		"""Delete an object

		Args:
			request (_type_): _description_
			pk (_type_, optional): _description_. Defaults to None.
		"""
		return Response({'method': 'PATCH'})

class HelloViewSet(viewsets.ViewSet):
	"""Test API Viewset

	Args:
		viewsets (_type_): _description_
	"""
	serializer_class = serializers.HelloSerializers

	def list(self, request):
		"""Return a hello message

		Args:
			request (_type_): _description_
		"""
		a_viewset = [
		'Uses actions (list, create, retrieve, update, partial_update)',
		'Automatically maps to URLs using routers',
		'Provides more functionality with less code',
	]
		return Response({'message': 'Hello!', 'a_viewset': a_viewset})

	def create(self, request):
		"""Create a new hello message

		Args:
			request (_type_): _description_
		"""
		serializers = self.serializer_class(data=request.data)
  
		if serializers.is_valid():
			name = serializers.validated_data.get('name')
			message= f'Hello {name}!'
			return Response({'message': message})
		else:
			return Response(
				serializers.errors,
    			status=status.HTTP_400_BAD_REQUEST
			)
	def retrieve(self, request, pk=None):
		"""Handle getting an object by its ID

		Args:
			request (_type_): _description_
		"""
		return Response({'http_method': 'GET'})

	def update(self, request, pk=None):
		"""Handle updating an object

		Args:
			request (_type_): _description_
			pk (_type_, optional): _description_. Defaults to None.
		"""
		return Response({'http_method': 'PUT'})

	def partial_update(self, request, pk=None):
		"""Handle updating part of an object

		Args:
			request (_type_): _description_
			pk (_type_, optional): _description_. Defaults to None.
		"""
		return Response ({'http_method': 'PATCH'})

	def destroy(self, request, pk=None):
		"""Handle removing an object"""
		return Response({'http_method': 'DELETE'})

class UserProfileViewSet(viewsets.ModelViewSet):
	"""Handle creating and updating profiles

	Args:
		viewsets (_type_): _description_
	"""
	serializer_class = serializers.UserProfileSerializer
	queryset = models.UserProfile.objects.all()
	authentication_classes = (TokenAuthentication,)
	permission_classes = (permissions.UpdateOwnProfile,)
	filter_backends = (filters.SearchFilter,)
	search_fields = ('name', 'email', )

class UserLoginApiView(ObtainAuthToken):
	"""Handle creating user authentication tokens

	Args:
		ObtainAuthToken (_type_): _description_
	"""
	renderer_classes = api_settings.DEFAULT_RENDERER_CLASSES
	