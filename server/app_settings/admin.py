from django.contrib import admin
from django.utils.html import format_html
from .models import AppData, Gallery, GalleryImage, Sponsor, Testimonial

class GalleryImageInline(admin.TabularInline):
    model = GalleryImage
    extra = 1
    fields = ('image', 'title', 'description', 'ordering', 'instagram', 'x_handle', 'facebook')
    readonly_fields = ('created_at', 'updated_at')

@admin.register(AppData)
class AppDataAdmin(admin.ModelAdmin):
    list_display = ('name', 'logo_preview', 'created_at', 'updated_at')
    readonly_fields = ('created_at', 'updated_at', 'logo_preview')
    search_fields = ('name', 'mission_statement', 'vision_statement')
    
    fieldsets = (
        ('Basic Information', {
            'fields': ('name', 'logo_url', 'logo_preview')
        }),
        ('Statements', {
            'fields': ('mission_statement', 'vision_statement')
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )
    
    def logo_preview(self, obj):
        if obj.logo_url:
            return format_html('<img src="{}" style="max-height: 50px;" />', obj.logo_url)
        return "No logo uploaded"
    logo_preview.short_description = 'Logo Preview'

@admin.register(Gallery)
class GalleryAdmin(admin.ModelAdmin):
    list_display = ('title', 'department', 'is_previous', 'year', 'image_count', 'created_at')
    list_filter = ('department', 'is_previous', 'year', 'created_at')
    search_fields = ('title', 'description')
    readonly_fields = ('created_at', 'updated_at', 'image_count')
    inlines = [GalleryImageInline]
    
    fieldsets = (
        ('Gallery Information', {
            'fields': ('title', 'description')
        }),
        ('Classification', {
            'fields': ('department', 'is_previous', 'year', 'ordering')
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )
    
    def image_count(self, obj):
        return obj.images.count()
    image_count.short_description = 'Images'
    
    actions = ['mark_as_previous', 'mark_as_current']
    
    @admin.action(description='Mark selected galleries as previous')
    def mark_as_previous(self, request, queryset):
        updated = queryset.update(is_previous=True)
        self.message_user(request, f'{updated} galleries marked as previous.')
    
    @admin.action(description='Mark selected galleries as current')
    def mark_as_current(self, request, queryset):
        updated = queryset.update(is_previous=False)
        self.message_user(request, f'{updated} galleries marked as current.')

@admin.register(GalleryImage)
class GalleryImageAdmin(admin.ModelAdmin):
    list_display = ('gallery_title', 'image_preview', 'ordering', 'created_at')
    list_filter = ('gallery__department', 'gallery__is_previous', 'gallery__year')
    search_fields = ('description', 'gallery__title')
    readonly_fields = ('created_at', 'updated_at', 'image_preview')
    
    fieldsets = (
        ('Image Information', {
            'fields': ('gallery', 'image', 'image_preview', 'title', 'description', 'category', 'objectives', 'history')
        }),
        ('Social Media', {
            'fields': ('instagram', 'x_handle', 'facebook')
        }),
        ('Display Settings', {
            'fields': ('ordering',)
        }),
    )
    
    def gallery_title(self, obj):
        return obj.gallery.title
    gallery_title.short_description = 'Gallery'
    
    def image_preview(self, obj):
        if obj.image:
            return format_html('<img src="{}" style="max-height: 100px;" />', obj.image)
        return "No image"
    image_preview.short_description = 'Preview'

@admin.register(Sponsor)
class SponsorAdmin(admin.ModelAdmin):
    list_display = ('name', 'type', 'image_preview', 'has_url', 'ordering')
    list_filter = ('type',)
    search_fields = ('name',)
    readonly_fields = ('image_preview',)
    
    fieldsets = (
        ('Sponsor Information', {
            'fields': ('name', 'description', 'type', 'url')
        }),
        ('Image', {
            'fields': ('image', 'image_preview')
        }),
        ('Display Settings', {
            'fields': ('ordering',)
        }),
    )
    
    def image_preview(self, obj):
        if obj.image:
            return format_html('<img src="{}" style="max-height: 80px;" />', obj.image)
        return "No image"
    image_preview.short_description = 'Preview'
    
    def has_url(self, obj):
        return bool(obj.url)
    has_url.boolean = True
    has_url.short_description = 'Has URL'

@admin.register(Testimonial)
class TestimonialAdmin(admin.ModelAdmin):
    list_display = ('name', 'occupation', 'quote_excerpt', 'image_preview')
    search_fields = ('name', 'occupation', 'quote')
    readonly_fields = ('image_preview',)
    
    def quote_excerpt(self, obj):
        if obj.quote and len(obj.quote) > 50:
            return f"{obj.quote[:50]}..."
        return obj.quote
    quote_excerpt.short_description = 'Quote'
    
    def image_preview(self, obj):
        if obj.image:
            return format_html('<img src="{}" style="max-height: 80px;" />', obj.image)
        return "No image"
    image_preview.short_description = 'Preview'
