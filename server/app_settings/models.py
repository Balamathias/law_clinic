from django.db import models
from django.core.validators import URLValidator
import uuid


class AppData(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=255, unique=True)
    logo_url = models.URLField(blank=True, null=True, validators=[URLValidator()])
    mission_statement = models.TextField()
    vision_statement = models.TextField()

    objectives = models.TextField(blank=True, null=True, help_text="Comma-separated objectives")
    history = models.TextField(blank=True, null=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "App Data"
        verbose_name_plural = "App Data"

    def __str__(self):
        return self.name


class Gallery(models.Model):

    DEPARTMENT_CHOICES = (
        ('clinical', 'Clinical Department'),
        ('research', 'Research Department'),
        ('litigation', 'Litigation Department'),
        ('other', 'Other'),
    )


    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    title = models.CharField(max_length=500)
    description = models.TextField(blank=True, null=True)

    department = models.CharField(max_length=20, choices=DEPARTMENT_CHOICES, default='other')

    is_previous = models.BooleanField(default=False, help_text="Is this a previous gallery?")
    year = models.PositiveIntegerField(blank=True, null=True, help_text="Year of the gallery")

    ordering = models.PositiveIntegerField(blank=True, null=True, help_text="Ordering of the gallery")

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name_plural = "Galleries"
        ordering = ['ordering', 'title']

    def __str__(self):
        return self.title
    
    def get_gallery_images(self):
        return self.images.all().order_by('ordering')
    

class GalleryImage(models.Model):

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)

    title = models.CharField(max_length=500, blank=True, null=True)

    description = models.TextField(blank=True, null=True)

    gallery = models.ForeignKey(Gallery, on_delete=models.CASCADE, related_name='images')

    image = models.URLField(null=True, validators=[URLValidator()])

    instagram = models.URLField(blank=True, null=True)
    x_handle = models.URLField(blank=True, null=True)
    facebook = models.URLField(blank=True, null=True)

    ordering = models.PositiveIntegerField(blank=True, null=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name_plural = "Gallery Images"
        ordering = ['ordering', 'gallery__year', 'gallery__title']

    def __str__(self):
        return f"Image for {self.gallery.title}"


class Sponsor(models.Model):
    SPONSOR_TYPE = (
        ('person', 'Person'),
        ('organization', 'Organization'),
    )

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=500)
    description = models.TextField(null=True, blank=True)
    image = models.URLField(blank=True, null=True)
    url = models.URLField(blank=True, null=True)
    type = models.CharField(max_length=12, choices=SPONSOR_TYPE, default='person')
    ordering = models.PositiveIntegerField(blank=True, null=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['ordering', 'name']

    def __str__(self):
        return self.name


class Testimonial(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=500)
    occupation = models.CharField(max_length=500)
    quote = models.TextField(blank=True, null=True)
    image = models.URLField(blank=True, null=True)
    category = models.CharField(max_length=500, blank=True, null=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.name} - {self.occupation}"
