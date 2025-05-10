import uuid
from django.db import models
from django.utils.text import slugify
from django.utils import timezone
from app.models import User

class EventCategory(models.Model):
    """Model for categorizing events"""
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=100)
    description = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "Event Category"
        verbose_name_plural = "Event Categories"
        ordering = ['name']

    def __str__(self):
        return self.name

class Event(models.Model):
    """Model for events organized by the law clinic"""
    STATUS_CHOICES = (
        ('scheduled', 'Scheduled'),
        ('in_progress', 'In Progress'),
        ('completed', 'Completed'),
        ('cancelled', 'Cancelled'),
        ('postponed', 'Postponed'),
    )
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    title = models.CharField(max_length=255)
    slug = models.SlugField(max_length=255, unique=True, blank=True)
    description = models.TextField()
    short_description = models.TextField(blank=True, null=True, help_text="A brief summary of the event (for listings)")
    
    start_date = models.DateTimeField()
    end_date = models.DateTimeField()
    
    location = models.CharField(max_length=255, help_text="Physical location of the event")
    virtual_link = models.URLField(blank=True, null=True, help_text="Link for virtual attendance")
    
    category = models.ForeignKey(EventCategory, on_delete=models.SET_NULL, null=True, related_name='events')
    image = models.URLField(blank=True, null=True, help_text="Cover image URL for the event")
    
    organizer = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name='organized_events')
    max_participants = models.PositiveIntegerField(default=0, help_text="0 for unlimited participants")
    
    registration_required = models.BooleanField(default=False)
    registration_deadline = models.DateTimeField(null=True, blank=True)
    
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='scheduled')
    featured = models.BooleanField(default=False, help_text="Feature this event on the homepage")
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-start_date']
        
    def __str__(self):
        return self.title
    
    def save(self, *args, **kwargs):
        # Create slug if it doesn't exist
        if not self.slug:
            self.slug = slugify(self.title)
            
            # Check if slug exists and append a unique identifier if needed
            base_slug = self.slug
            counter = 1
            while Event.objects.filter(slug=self.slug).exists():
                self.slug = f"{base_slug}-{counter}"
                counter += 1
                
        super().save(*args, **kwargs)
    
    @property
    def is_upcoming(self):
        return self.start_date > timezone.now()
    
    @property
    def is_ongoing(self):
        now = timezone.now()
        return self.start_date <= now <= self.end_date
        
    @property
    def has_registration_closed(self):
        if not self.registration_required:
            return False
        if not self.registration_deadline:
            return False
        return timezone.now() > self.registration_deadline

class EventRegistration(models.Model):
    """Model for tracking event registrations"""
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    event = models.ForeignKey(Event, on_delete=models.CASCADE, related_name='registrations')
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='event_registrations')
    registered_at = models.DateTimeField(auto_now_add=True)
    attended = models.BooleanField(default=False)
    
    # Additional information about the registrant
    notes = models.TextField(blank=True, null=True)
    
    class Meta:
        unique_together = ['event', 'user']
        ordering = ['-registered_at']
        
    def __str__(self):
        return f"{self.user.get_full_name() or self.user.email} - {self.event.title}"
