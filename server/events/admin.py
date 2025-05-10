from django.contrib import admin
from django.utils.html import format_html
from .models import Event, EventCategory, EventRegistration

@admin.register(EventCategory)
class EventCategoryAdmin(admin.ModelAdmin):
    list_display = ('name', 'description', 'created_at', 'get_event_count')
    search_fields = ('name', 'description')
    
    def get_event_count(self, obj):
        return obj.events.count()
    get_event_count.short_description = 'Event Count'

@admin.register(Event)
class EventAdmin(admin.ModelAdmin):
    list_display = ('title', 'start_date', 'end_date', 'location', 'status', 'featured', 
                   'get_registration_count', 'get_image_thumbnail')
    list_filter = ('status', 'featured', 'registration_required', 'category')
    search_fields = ('title', 'description', 'location')
    prepopulated_fields = {'slug': ('title',)}
    date_hierarchy = 'start_date'
    readonly_fields = ('created_at', 'updated_at')
    
    fieldsets = (
        ('Basic Information', {
            'fields': ('title', 'slug', 'description', 'short_description', 'image', 'category', 'featured')
        }),
        ('Event Details', {
            'fields': ('start_date', 'end_date', 'location', 'virtual_link', 'status')
        }),
        ('Registration', {
            'fields': ('registration_required', 'registration_deadline', 'max_participants')
        }),
        ('Organizer', {
            'fields': ('organizer',)
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at')
        })
    )
    
    def get_image_thumbnail(self, obj):
        if obj.image:
            return format_html('<img src="{}" width="50" height="50" />', obj.image)
        return 'No image'
    get_image_thumbnail.short_description = 'Image'
    
    def get_registration_count(self, obj):
        return obj.registrations.count()
    get_registration_count.short_description = 'Registrations'
    
    actions = ['mark_featured', 'unmark_featured', 'mark_completed', 'mark_cancelled']
    
    @admin.action(description='Mark selected events as featured')
    def mark_featured(self, request, queryset):
        queryset.update(featured=True)
        self.message_user(request, f"{queryset.count()} event(s) marked as featured.")
    
    @admin.action(description='Unmark selected events as featured')
    def unmark_featured(self, request, queryset):
        queryset.update(featured=False)
        self.message_user(request, f"{queryset.count()} event(s) unmarked as featured.")
    
    @admin.action(description='Mark selected events as completed')
    def mark_completed(self, request, queryset):
        queryset.update(status='completed')
        self.message_user(request, f"{queryset.count()} event(s) marked as completed.")
    
    @admin.action(description='Mark selected events as cancelled')
    def mark_cancelled(self, request, queryset):
        queryset.update(status='cancelled')
        self.message_user(request, f"{queryset.count()} event(s) marked as cancelled.")

@admin.register(EventRegistration)
class EventRegistrationAdmin(admin.ModelAdmin):
    list_display = ('get_event_title', 'get_user_name', 'registered_at', 'attended')
    list_filter = ('attended', 'registered_at', 'event__title')
    search_fields = ('user__email', 'user__first_name', 'user__last_name', 'notes')
    readonly_fields = ('registered_at',)
    
    def get_event_title(self, obj):
        return obj.event.title
    get_event_title.short_description = 'Event'
    
    def get_user_name(self, obj):
        return obj.user.get_full_name() or obj.user.email
    get_user_name.short_description = 'User'
    
    actions = ['mark_as_attended', 'mark_as_not_attended']
    
    @admin.action(description='Mark selected registrations as attended')
    def mark_as_attended(self, request, queryset):
        queryset.update(attended=True)
        self.message_user(request, f"{queryset.count()} registration(s) marked as attended.")
    
    @admin.action(description='Mark selected registrations as not attended')
    def mark_as_not_attended(self, request, queryset):
        queryset.update(attended=False)
        self.message_user(request, f"{queryset.count()} registration(s) marked as not attended.")
