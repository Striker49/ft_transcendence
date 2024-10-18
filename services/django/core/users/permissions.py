from rest_framework import permissions


class IsAuthenticatedOrCreateOnly(permissions.BasePermission):
	"""Allow authenticated users to use the api view, non authenticated users can create new users
	"""
	def has_permission(self, request, view):
		"""Check user is trying to create a profile """
		if view.action == 'create':
			return True
		return request.user and request.user.is_authenticated

class UpdateOwnUser(permissions.BasePermission):
    """Allow users to edit their own profile."""

    def has_object_permission(self, request, view, obj):
        """Check that the user is trying to edit their own profile."""
        # Allow GET, HEAD, OPTIONS requests (safe methods)
        if request.method in permissions.SAFE_METHODS:
            return True

        return obj.id == request.user.id