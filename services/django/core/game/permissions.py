from rest_framework import permissions


class UpdateGameStats(permissions.BasePermission):
	"""Allow user to edit their own profile"""
	def has_object_permission(self, request, view, obj):
		"""Check user is trying to edit their own profile

		Args:
			request (_type_): _description_
			view (_type_): _description_
			obj (_type_): _description_
		"""
		if request.method in permissions.SAFE_METHODS:
			return True

		return obj.UID == request.user