from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import EventViewSet, EventCategoryViewSet, EventRegistrationViewSet

router = DefaultRouter()

# Events endpoints:
# GET /api/events/ - List all events
# POST /api/events/ - Create a new event
# GET /api/events/{slug}/ - Retrieve a specific event by slug
# PUT /api/events/{slug}/ - Update an event completely
# PATCH /api/events/{slug}/ - Update an event partially
# DELETE /api/events/{slug}/ - Delete an event
# POST /api/events/{slug}/register/ - Register for an event
# DELETE /api/events/{slug}/unregister/ - Unregister from an event
# GET /api/events/{slug}/check_registration/ - Check if user is registered
router.register('', EventViewSet, basename='event')

# Event Categories endpoints:
# GET /api/event-categories/ - List all event categories
# POST /api/event-categories/ - Create a new event category
# GET /api/event-categories/{id}/ - Retrieve a specific event category
# PUT /api/event-categories/{id}/ - Update an event category completely
# PATCH /api/event-categories/{id}/ - Update an event category partially
# DELETE /api/event-categories/{id}/ - Delete an event category
router.register('event-categories', EventCategoryViewSet, basename='event-category')

# Event Registration endpoints:
# GET /api/event-registrations/ - List all event registrations (filtered by permission)
# POST /api/event-registrations/ - Create a new event registration
# GET /api/event-registrations/{id}/ - Retrieve a specific event registration
# PUT /api/event-registrations/{id}/ - Update an event registration completely
# PATCH /api/event-registrations/{id}/ - Update an event registration partially
# DELETE /api/event-registrations/{id}/ - Delete an event registration
# GET /api/event-registrations/my_registrations/ - Get all registrations for current user
# PATCH /api/event-registrations/{id}/mark_attended/ - Mark a registration as attended (admin only)
router.register('event-registrations', EventRegistrationViewSet, basename='event-registration')

app_name = 'events'

urlpatterns = [
    path('', include(router.urls)),
]
