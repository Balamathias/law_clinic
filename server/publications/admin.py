from django.contrib import admin
from django.utils.html import format_html
from django.urls import reverse
from .models import Publication, Category, Comment
from django.utils import timezone

@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ('name', 'slug', 'publication_count', 'created_at')
    search_fields = ('name', 'description')
    prepopulated_fields = {'slug': ('name',)}
    readonly_fields = ('created_at', 'updated_at')
    
    def publication_count(self, obj):
        return obj.publications.count()
    publication_count.short_description = 'Publications'


class CommentInline(admin.TabularInline):
    model = Comment
    extra = 0
    fields = ('author', 'content', 'created_at', 'is_approved')
    readonly_fields = ('created_at',)
    can_delete = True
    show_change_link = True


@admin.register(Publication)
class PublicationAdmin(admin.ModelAdmin):
    list_display = ('title', 'author', 'status', 'published_at', 'view_categories', 'views_count', 'is_featured')
    list_filter = ('status', 'created_at', 'published_at', 'categories', 'is_featured')
    search_fields = ('title', 'content', 'excerpt', 'meta_title', 'meta_description')
    prepopulated_fields = {'slug': ('title',)}
    readonly_fields = ('views_count', 'created_at', 'updated_at', 'published_at')
    date_hierarchy = 'created_at'
    inlines = [CommentInline]
    
    fieldsets = (
        ('Basic Information', {
            'fields': ('title', 'slug', 'author', 'categories', 'status')
        }),
        ('Content', {
            'fields': ('content', 'excerpt', 'featured_image', 'mins_read')
        }),
        ('SEO & Metadata', {
            'fields': ('meta_title', 'meta_description', 'keywords', 'additional_metadata'),
            'classes': ('collapse',)
        }),
        ('Publication Details', {
            'fields': ('created_at', 'updated_at', 'published_at', 'views_count', 'is_featured', 'allow_comments')
        }),
    )
    
    def view_categories(self, obj):
        categories = obj.categories.all()
        return ', '.join([category.name for category in categories])
    view_categories.short_description = 'Categories'
    
    actions = ['make_published', 'make_draft', 'feature_publications', 'unfeature_publications']
    
    @admin.action(description='Mark selected publications as published')
    def make_published(self, request, queryset):
        updated = queryset.update(status='published', published_at=timezone.now())
        self.message_user(request, f'{updated} publications marked as published.')
        
    @admin.action(description='Mark selected publications as draft')
    def make_draft(self, request, queryset):
        updated = queryset.update(status='draft')
        self.message_user(request, f'{updated} publications marked as draft.')
    
    @admin.action(description='Feature selected publications')
    def feature_publications(self, request, queryset):
        updated = queryset.update(is_featured=True)
        self.message_user(request, f'{updated} publications marked as featured.')
        
    @admin.action(description='Unfeature selected publications')
    def unfeature_publications(self, request, queryset):
        updated = queryset.update(is_featured=False)
        self.message_user(request, f'{updated} publications unmarked as featured.')


@admin.register(Comment)
class CommentAdmin(admin.ModelAdmin):
    list_display = ('excerpt', 'author', 'publication_link', 'created_at', 'is_approved')
    list_filter = ('is_approved', 'created_at')
    search_fields = ('content', 'author__email', 'publication__title')
    readonly_fields = ('created_at', 'updated_at')
    actions = ['approve_comments', 'disapprove_comments']
    
    def excerpt(self, obj):
        if len(obj.content) > 50:
            return f"{obj.content[:50]}..."
        return obj.content
    
    def publication_link(self, obj):
        url = reverse('admin:publications_publication_change', args=[obj.publication.id])
        return format_html('<a href="{}">{}</a>', url, obj.publication.title)
    publication_link.short_description = 'Publication'
    
    @admin.action(description='Approve selected comments')
    def approve_comments(self, request, queryset):
        updated = queryset.update(is_approved=True)
        self.message_user(request, f'{updated} comments approved.')
        
    @admin.action(description='Disapprove selected comments')
    def disapprove_comments(self, request, queryset):
        updated = queryset.update(is_approved=False)
        self.message_user(request, f'{updated} comments disapproved.')
