from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from snippets.models import Snippet
from snippets.serializers import SnippetSerializer
from django.http import Http404
from django.contrib.auth.models import User
from snippets.serializers import UserSerializer
from rest_framework import generics
from rest_framework import permissions
from snippets.permissions import IsOwnerOrReadOnly
from rest_framework.reverse import reverse
from rest_framework.decorators import api_view
from rest_framework import renderers

# Create your views here.

# @api_view(['GET', 'POST'])
# def snippet_list(request, format=None):
# 	"""List all code snippets, or create a new snippet.
# 	"""
# 	if  request.method == 'GET':
# 		snippets = Snippet.objects.all()
# 		serializer = SnippetSerializer(snippets, many=True)
# 		return Response(serializer.data)

# 	elif request.method == 'POST':
# 		serializer = SnippetSerializer(data=request.data)
# 		if serializer.is_valid():
# 			serializer.save()
# 			return Response(serializer.data, status=status.HTTP_201_CREATED)
# 		return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# @api_view(['GET', 'PUT', 'DELETE'])
# def snippet_detail(request, pk, format=None):
# 	"""Retrieve, update or delete a code snippet"""
# 	try:
# 		snippet = Snippet.objects.get(pk=pk)
# 	except Snippet.DoesNotExist:
# 		return Response(status=status.HTTP_404_NOT_FOUND)
# 	if request.method == 'GET':
# 		serializer = SnippetSerializer(snippet)
# 		return Response(serializer.data)

# 	elif request.method == 'PUT':
# 		serializer = SnippetSerializer(snippet, data=request.data)
# 		if serializer.is_valid():
# 			serializer.save()
# 			return Response(serializer.data)
# 		return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# 	elif request.method == 'DELETE':
# 		snippet.delete()
# 		return Response(status=status.HTTP_204_NO_CONTENT)

class SnippetList(generics.ListCreateAPIView):
	queryset = Snippet.objects.all()
	serializer_class = SnippetSerializer
	permission_classes = [permissions.IsAuthenticatedOrReadOnly]

	def perform_create(self, serializer):
		serializer.save(owner=self.request.user)

class SnippetDetail(generics.RetrieveUpdateDestroyAPIView):
	queryset = Snippet.objects.all()
	serializer_class = SnippetSerializer
	permission_classes = [permissions.IsAuthenticatedOrReadOnly, IsOwnerOrReadOnly]

class UserList(generics.ListAPIView):
	queryset = User.objects.all()
	serializer_class = UserSerializer


class UserDetail(generics.RetrieveAPIView):
	queryset = User.objects.all()
	serializer_class = UserSerializer
 
@api_view(['GET'])
def api_root(request, format=None):
    return Response(
		{
			'users': reverse('user-list', request=request, format=format),
			'snippets': reverse('snippet-list', request=request, format=format)
		}
	)
    
class SnippetHighlight(generics.GenericAPIView):
    queryset = Snippet.objects.all()
    renderer_classes = [renderers.StaticHTMLRenderer]

    def get(self, request, *args, **kwargs):
        snippet = self.get_object()
        return Response(snippet.highlighted)