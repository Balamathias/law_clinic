from rest_framework import permissions

class IsOrganizerOrReadOnly(permissions.BasePermission):
    """
    Custom permission to only allow organizers to edit an event.
    """
    def has_object_permission(self, request, view, obj):
        # Read permissions are allowed to any request
        if request.method in permissions.SAFE_METHODS:
            return True
        
        # Write permissions are only allowed to the organizer or staff
        return obj.organizer == request.user or request.user.is_staff

class IsRegisteredUser(permissions.BasePermission):
    """
    Custom permission to only allow users who are registered for an event to perform actions.
    """
    def has_object_permission(self, request, view, obj):
        # Check if the user is registered for this event
        return obj.registrations.filter(user=request.user).exists()
