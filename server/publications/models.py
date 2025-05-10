import uuid
from django.db import models
from django.utils.text import slugify
from django.contrib.auth import get_user_model
from django.utils import timezone

User = get_user_model()

class Category(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=100, unique=True)
    slug = models.SlugField(max_length=120, unique=True, blank=True)
    description = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "Category"
        verbose_name_plural = "Categories"
        ordering = ["name"]

    def __str__(self):
        return self.name

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
        super().save(*args, **kwargs)


class Publication(models.Model):
    STATUS_CHOICES = (
        ('draft', 'Draft'),
        ('published', 'Published'),
        ('archived', 'Archived'),
    )

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    title = models.CharField(max_length=255)
    slug = models.SlugField(max_length=280, unique=True, blank=True)
    author = models.ForeignKey(User, on_delete=models.CASCADE, related_name='publications')
    categories = models.ManyToManyField(Category, related_name='publications')
    content = models.TextField()
    excerpt = models.TextField(blank=True, null=True)
    featured_image = models.URLField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    published_at = models.DateTimeField(blank=True, null=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='draft')
    mins_read = models.PositiveIntegerField(default=0, help_text="Estimated reading time in minutes")
    
    # SEO and metadata fields
    meta_title = models.CharField(max_length=100, blank=True, null=True)
    meta_description = models.TextField(blank=True, null=True)
    keywords = models.CharField(max_length=255, blank=True, null=True)
    
    # Additional fields
    views_count = models.PositiveIntegerField(default=0)
    is_featured = models.BooleanField(default=False)
    allow_comments = models.BooleanField(default=True)
    additional_metadata = models.JSONField(default=dict, blank=True, null=True)

    class Meta:
        ordering = ["-published_at", "-created_at"]
        verbose_name = "Publication"
        verbose_name_plural = "Publications"
        indexes = [
            models.Index(fields=['status', 'published_at']),
            models.Index(fields=['author']),
        ]

    def __str__(self):
        return self.title

    def save(self, *args, **kwargs):
        # Generate slug if not provided
        if not self.slug:
            self.slug = slugify(self.title)
        
        # Set published_at when status changes to published
        if self.status == 'published' and not self.published_at:
            self.published_at = timezone.now()
            
        super().save(*args, **kwargs)


class Comment(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    publication = models.ForeignKey(Publication, on_delete=models.CASCADE, related_name='comments')
    author = models.ForeignKey(User, on_delete=models.CASCADE, related_name='comments')
    parent = models.ForeignKey('self', on_delete=models.CASCADE, null=True, blank=True, related_name='replies')
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    is_approved = models.BooleanField(default=False)

    class Meta:
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['publication', 'is_approved']),
        ]

    def __str__(self):
        return f"Comment by {self.author} on {self.publication.title}"
