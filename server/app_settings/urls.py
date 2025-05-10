from django.urls import path, include
from rest_framework.routers import DefaultRouter

from app_settings.views import (
    AppDataViewSet,
    GalleryViewSet,
    GalleryImageViewSet,
    SponsorViewSet,
    TestimonialViewSet,
)

# Create a router and register our viewsets with it
router = DefaultRouter()
router.register(r'app-data', AppDataViewSet, basename='app-data')
router.register(r'galleries', GalleryViewSet, basename='gallery')
router.register(r'gallery-images', GalleryImageViewSet, basename='gallery-image')
router.register(r'sponsors', SponsorViewSet, basename='sponsor')
router.register(r'testimonials', TestimonialViewSet, basename='testimonial')

# The API URLs are now determined automatically by the router
urlpatterns = [
    path('', include(router.urls)),
]

# API Endpoints Documentation
"""
App Data Endpoints:
- GET /app-data/ - List all app data
- POST /app-data/ - Create new app data
- GET /app-data/{id}/ - Retrieve specific app data
- PUT /app-data/{id}/ - Update specific app data
- PATCH /app-data/{id}/ - Partially update specific app data
- DELETE /app-data/{id}/ - Delete specific app data

Gallery Endpoints:
- GET /galleries/ - List all galleries
- POST /galleries/ - Create new gallery
- GET /galleries/{id}/ - Retrieve specific gallery
- PUT /galleries/{id}/ - Update specific gallery
- PATCH /galleries/{id}/ - Partially update specific gallery
- DELETE /galleries/{id}/ - Delete specific gallery
- GET /galleries/by_department/ - Get galleries filtered by department

Gallery Image Endpoints:
- GET /gallery-images/ - List all gallery images
- POST /gallery-images/ - Create new gallery image
- GET /gallery-images/{id}/ - Retrieve specific gallery image
- PUT /gallery-images/{id}/ - Update specific gallery image
- PATCH /gallery-images/{id}/ - Partially update specific gallery image
- DELETE /gallery-images/{id}/ - Delete specific gallery image

Sponsor Endpoints:
- GET /sponsors/ - List all sponsors
- POST /sponsors/ - Create new sponsor
- GET /sponsors/{id}/ - Retrieve specific sponsor
- PUT /sponsors/{id}/ - Update specific sponsor
- PATCH /sponsors/{id}/ - Partially update specific sponsor
- DELETE /sponsors/{id}/ - Delete specific sponsor
- GET /sponsors/by_type/ - Get sponsors filtered by type

Testimonial Endpoints:
- GET /testimonials/ - List all testimonials
- POST /testimonials/ - Create new testimonial
- GET /testimonials/{id}/ - Retrieve specific testimonial
- PUT /testimonials/{id}/ - Update specific testimonial
- PATCH /testimonials/{id}/ - Partially update specific testimonial
- DELETE /testimonials/{id}/ - Delete specific testimonial
"""