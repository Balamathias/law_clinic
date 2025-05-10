from rest_framework.permissions import BasePermission, SAFE_METHODS


class IsAdminOrReadOnly(BasePermission):
    """
    Custom permission that allows only admins to edit, delete, or create institutions.
    Everyone else can only read.
    """

    def has_permission(self, request, view):
        """Allow read-only methods (GET, HEAD, OPTIONS) for everyone"""
        if request.method in SAFE_METHODS:
            return True

        # Write operations (POST, PUT, PATCH, DELETE) are restricted to admins
        return request.user and request.user.is_staff  # Checks if user is an admin
    

class IsOwnerOrReadOnly(BasePermission):
    """
    Only allow owners of a model to edit or delete it.
    Everyone else can only read.
    """
    def has_object_permission(self, request, view, obj):
        """Read permissions for everyone"""
        if request.method in SAFE_METHODS:
            return True
        # Write permissions only for the owner
        try:
            return obj.user == request.user
        except AttributeError:
            return False


class IsOwnerOnly(BasePermission):
    """
    Only allow owners of a model to edit or delete it.
    Everyone else can only read.
    """
    def has_object_permission(self, request, view, obj):
        return obj.user == request.user
  
