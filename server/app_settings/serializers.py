from rest_framework import serializers
from .models import AppData, Gallery, GalleryImage, Sponsor, Testimonial

class AppDataSerializer(serializers.ModelSerializer):
    class Meta:
        model = AppData
        fields = ['id', 'name', 'logo_url', 'mission_statement', 'vision_statement', 'created_at', 'updated_at', 'objectives', 'history']


class GalleryImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = GalleryImage
        fields = ['id', 'title', 'description', 'gallery', 'image', 'instagram', 'x_handle', 'facebook', 'ordering', 'created_at', 'updated_at']


class GallerySerializer(serializers.ModelSerializer):
    images = serializers.SerializerMethodField()
    
    class Meta:
        model = Gallery
        fields = ['id', 'title', 'description', 'department', 'is_previous', 'year', 'created_at', 'updated_at', 'images', 'ordering']
    
    def get_images(self, obj):
        gallery_images = obj.get_gallery_images()
        return GalleryImageSerializer(gallery_images, many=True).data


class SponsorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Sponsor
        fields = ['id', 'name', 'description', 'image', 'url', 'type', 'ordering']

class TestimonialSerializer(serializers.ModelSerializer):
    class Meta:
        model = Testimonial
        fields = ['id', 'name', 'occupation', 'quote', 'image', 'category']
