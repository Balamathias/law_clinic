from django.shortcuts import render, get_object_or_404
from django.utils import timezone
from django.db.models import Q
from rest_framework import viewsets, status, filters
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated, IsAuthenticatedOrReadOnly, IsAdminUser
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend

from .models import Event, EventCategory, EventRegistration
from .serializers import (
    EventSerializer, 
    EventDetailSerializer, 
    EventCategorySerializer, 
    EventRegistrationSerializer
)
from .permissions import IsOrganizerOrReadOnly, IsRegisteredUser

from app.utils import ClinicView

class EventCategoryViewSet(viewsets.ModelViewSet, ClinicView):
    """ViewSet for viewing and editing Event Categories"""
    queryset = EventCategory.objects.all()
    serializer_class = EventCategorySerializer
    permission_classes = [IsAuthenticatedOrReadOnly]
    authentication_classes = ()
    filter_backends = [filters.SearchFilter]
    search_fields = ['name', 'description']
    
    def get_permissions(self):
        """Set custom permissions:
        - Any user can view
        - Only staff can create, update or delete
        """
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            self.permission_classes = [IsAdminUser]
        return super().get_permissions()
    
    def list(self, request, *args, **kwargs):
        queryset = self.filter_queryset(self.get_queryset())
        
        page = self.paginate_queryset(queryset)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            paginated_data = self.get_paginated_response(serializer.data).data
            
            return self.clinic_response(
                data=paginated_data["results"],
                message="Event categories retrieved successfully",
                count=paginated_data["count"],
                next=paginated_data["next"],
                previous=paginated_data["previous"]
            )
            
        serializer = self.get_serializer(queryset, many=True)
        return self.clinic_response(
            data=serializer.data,
            message="Event categories retrieved successfully"
        )

    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance)
        return self.clinic_response(
            data=serializer.data,
            message="Event category retrieved successfully"
        )

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return self.clinic_response(
                data=serializer.data,
                message="Event category created successfully",
                status_code=status.HTTP_201_CREATED
            )
        return self.clinic_response(
            error=serializer.errors,
            message="Failed to create event category",
            status_code=status.HTTP_400_BAD_REQUEST
        )

    def update(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=kwargs.pop('partial', False))
        if serializer.is_valid():
            serializer.save()
            return self.clinic_response(
                data=serializer.data,
                message="Event category updated successfully"
            )
        return self.clinic_response(
            error=serializer.errors,
            message="Failed to update event category",
            status_code=status.HTTP_400_BAD_REQUEST
        )

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        instance.delete()
        return self.clinic_response(
            message="Event category deleted successfully",
            status_code=status.HTTP_204_NO_CONTENT
        )


class EventViewSet(viewsets.ModelViewSet, ClinicView):
    """ViewSet for viewing and editing Events"""
    serializer_class = EventSerializer
    permission_classes = [IsAuthenticatedOrReadOnly, IsOrganizerOrReadOnly]
    authentication_classes = ()
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['category', 'status', 'featured']
    search_fields = ['title', 'description', 'location']
    ordering_fields = ['start_date', 'created_at', 'title']
    lookup_field = 'slug'
    
    def get_queryset(self):
        """Get the list of events based on query parameters"""
        queryset = Event.objects.all()
        
        # Filter by time period
        upcoming = self.request.query_params.get('upcoming')
        past = self.request.query_params.get('past')
        today = self.request.query_params.get('today')
        
        if upcoming == 'true':
            queryset = queryset.filter(start_date__gt=timezone.now())
        elif past == 'true':
            queryset = queryset.filter(end_date__lt=timezone.now())
        elif today == 'true':
            today_min = timezone.now().replace(hour=0, minute=0, second=0)
            today_max = timezone.now().replace(hour=23, minute=59, second=59)
            queryset = queryset.filter(
                Q(start_date__range=(today_min, today_max)) | 
                Q(start_date__lte=today_min, end_date__gte=today_min)
            )
            
        return queryset
    
    def get_serializer_class(self):
        """Return different serializers based on action"""
        if self.action == 'retrieve':
            return EventDetailSerializer
        return EventSerializer
        
    def perform_create(self, serializer):
        """Set the organizer to the current user when creating an event"""
        serializer.save(organizer=self.request.user)
    
    def list(self, request, *args, **kwargs):
        queryset = self.filter_queryset(self.get_queryset())
        
        page = self.paginate_queryset(queryset)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            paginated_data = self.get_paginated_response(serializer.data).data
            
            return self.clinic_response(
                data=paginated_data["results"],
                message="Events retrieved successfully",
                count=paginated_data["count"],
                next=paginated_data["next"],
                previous=paginated_data["previous"]
            )
            
        serializer = self.get_serializer(queryset, many=True)
        return self.clinic_response(
            data=serializer.data,
            message="Events retrieved successfully"
        )

    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance)
        return self.clinic_response(
            data=serializer.data,
            message="Event retrieved successfully"
        )

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            self.perform_create(serializer)
            return self.clinic_response(
                data=serializer.data,
                message="Event created successfully",
                status_code=status.HTTP_201_CREATED
            )
        return self.clinic_response(
            error=serializer.errors,
            message="Failed to create event",
            status_code=status.HTTP_400_BAD_REQUEST
        )

    def update(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=kwargs.pop('partial', False))
        if serializer.is_valid():
            serializer.save()
            return self.clinic_response(
                data=serializer.data,
                message="Event updated successfully"
            )
        return self.clinic_response(
            error=serializer.errors,
            message="Failed to update event",
            status_code=status.HTTP_400_BAD_REQUEST
        )

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        instance.delete()
        return self.clinic_response(
            message="Event deleted successfully",
            status_code=status.HTTP_204_NO_CONTENT
        )
    
    @action(detail=True, methods=['post'], permission_classes=[IsAuthenticated])
    def register(self, request, slug=None):
        """Register the current user for the event"""
        event = self.get_object()
        user = request.user
        
        # Check if registration is required and not closed
        if not event.registration_required:
            return self.clinic_response(
                message="Registration is not required for this event.",
                error={"detail": "Registration is not required for this event."},
                status_code=status.HTTP_400_BAD_REQUEST
            )
        
        if event.has_registration_closed:
            return self.clinic_response(
                message="Registration for this event has closed.",
                error={"detail": "Registration for this event has closed."},
                status_code=status.HTTP_400_BAD_REQUEST
            )
            
        # Check if max participants reached
        if event.max_participants > 0 and event.registrations.count() >= event.max_participants:
            return self.clinic_response(
                message="This event has reached maximum capacity.",
                error={"detail": "This event has reached maximum capacity."},
                status_code=status.HTTP_400_BAD_REQUEST
            )
        
        # Check if already registered
        if EventRegistration.objects.filter(event=event, user=user).exists():
            return self.clinic_response(
                message="You are already registered for this event.",
                error={"detail": "You are already registered for this event."},
                status_code=status.HTTP_400_BAD_REQUEST
            )
        
        # Create registration
        registration = EventRegistration.objects.create(event=event, user=user)
        serializer = EventRegistrationSerializer(registration)
        
        return self.clinic_response(
            data=serializer.data,
            message="Successfully registered for the event.",
            status_code=status.HTTP_201_CREATED
        )
    
    @action(detail=True, methods=['post'], permission_classes=[IsAuthenticated, IsRegisteredUser])
    def unregister(self, request, slug=None):
        """Unregister the current user from the event"""
        event = self.get_object()
        user = request.user
        
        try:
            registration = EventRegistration.objects.get(event=event, user=user)
            registration.delete()
            return self.clinic_response(
                message="Successfully unregistered from the event.",
                status_code=status.HTTP_200_OK
            )
        except EventRegistration.DoesNotExist:
            return self.clinic_response(
                message="You are not registered for this event.",
                error={"detail": "You are not registered for this event."},
                status_code=status.HTTP_400_BAD_REQUEST
            )


class EventRegistrationViewSet(viewsets.ModelViewSet, ClinicView):
    """ViewSet for managing event registrations"""
    serializer_class = EventRegistrationSerializer
    permission_classes = [IsAuthenticated]
    
    
    def get_queryset(self):
        """Filter registrations based on user role"""
        user = self.request.user
        if user.is_staff:
            # Staff can see all registrations
            return EventRegistration.objects.all()
        # Regular users can only see their own registrations
        return EventRegistration.objects.filter(user=user)
    
    def list(self, request, *args, **kwargs):
        queryset = self.filter_queryset(self.get_queryset())
        
        page = self.paginate_queryset(queryset)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            paginated_data = self.get_paginated_response(serializer.data).data
            
            return self.clinic_response(
                data=paginated_data["results"],
                message="Event registrations retrieved successfully",
                count=paginated_data["count"],
                next=paginated_data["next"],
                previous=paginated_data["previous"]
            )
            
        serializer = self.get_serializer(queryset, many=True)
        return self.clinic_response(
            data=serializer.data,
            message="Event registrations retrieved successfully"
        )

    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance)
        return self.clinic_response(
            data=serializer.data,
            message="Event registration retrieved successfully"
        )

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            serializer.save(user=request.user)
            return self.clinic_response(
                data=serializer.data,
                message="Event registration created successfully",
                status_code=status.HTTP_201_CREATED
            )
        return self.clinic_response(
            error=serializer.errors,
            message="Failed to create event registration",
            status_code=status.HTTP_400_BAD_REQUEST
        )

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        instance.delete()
        return self.clinic_response(
            message="Event registration deleted successfully",
            status_code=status.HTTP_204_NO_CONTENT
        )
