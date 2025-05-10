from rest_framework import serializers
from .models import Event, EventCategory, EventRegistration
from app.serializers import UserSerializer

class EventCategorySerializer(serializers.ModelSerializer):
    """Serializer for event categories"""
    event_count = serializers.SerializerMethodField()
    
    class Meta:
        model = EventCategory
        fields = ['id', 'name', 'description', 'created_at', 'updated_at', 'event_count']
    
    def get_event_count(self, obj):
        return obj.events.count()

class EventSerializer(serializers.ModelSerializer):
    """Serializer for events"""
    category_name = serializers.CharField(source='category.name', read_only=True)
    organizer_name = serializers.CharField(source='organizer.get_full_name', read_only=True)
    registration_count = serializers.SerializerMethodField()
    is_upcoming = serializers.ReadOnlyField()
    is_ongoing = serializers.ReadOnlyField()
    has_registration_closed = serializers.ReadOnlyField()
    
    class Meta:
        model = Event
        fields = [
            'id', 'title', 'slug', 'description', 'short_description',
            'start_date', 'end_date', 'location', 'virtual_link',
            'category', 'category_name', 'image',
            'organizer', 'organizer_name', 'max_participants',
            'registration_required', 'registration_deadline',
            'status', 'featured', 'created_at', 'updated_at',
            'registration_count', 'is_upcoming', 'is_ongoing', 'has_registration_closed'
        ]
    
    def get_registration_count(self, obj):
        return obj.registrations.count()

class EventDetailSerializer(EventSerializer):
    """Detailed serializer for single event view"""
    registrations = serializers.SerializerMethodField()
    
    class Meta(EventSerializer.Meta):
        fields = EventSerializer.Meta.fields + ['registrations']
    
    def get_registrations(self, obj):
        # Only return registrations if user is the organizer or staff
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            if request.user.is_staff or request.user == obj.organizer:
                return EventRegistrationSerializer(obj.registrations.all(), many=True).data
        return []

class EventRegistrationSerializer(serializers.ModelSerializer):
    """Serializer for event registrations"""
    user_details = UserSerializer(source='user', read_only=True)
    event_title = serializers.CharField(source='event.title', read_only=True)
    
    class Meta:
        model = EventRegistration
        fields = ['id', 'event', 'event_title', 'user', 'user_details', 'registered_at', 'attended', 'notes']
        read_only_fields = ['registered_at']
