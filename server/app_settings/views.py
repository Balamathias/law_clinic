from rest_framework.viewsets import ModelViewSet
from rest_framework import status
from rest_framework.permissions import AllowAny, IsAdminUser, IsAuthenticated
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import SearchFilter, OrderingFilter
from rest_framework.decorators import action

from app.utils import ClinicView
from app.permissions import IsAdminOrReadOnly
from app.pagination import StackPagination
from .models import AppData, Gallery, GalleryImage, Sponsor, Testimonial
from .serializers import (
    AppDataSerializer, 
    GallerySerializer, 
    GalleryImageSerializer, 
    SponsorSerializer, 
    TestimonialSerializer
)


class AppDataViewSet(ModelViewSet, ClinicView):
    queryset = AppData.objects.all()
    serializer_class = AppDataSerializer
    permission_classes = [IsAdminOrReadOnly]
    authentication_classes = []
    lookup_field = "id"

    def list(self, request, *args, **kwargs):
        queryset = self.filter_queryset(self.get_queryset())
        serializer = self.get_serializer(queryset, many=True)
        return self.clinic_response(data=serializer.data, message="App data retrieved successfully")
    
    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance)
        return self.clinic_response(data=serializer.data, message="App data retrieved successfully")

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            self.perform_create(serializer)
            return self.clinic_response(data=serializer.data, message="App data created successfully", status_code=status.HTTP_201_CREATED)
        return self.clinic_response(error=serializer.errors, message="Failed to create app data", status_code=status.HTTP_400_BAD_REQUEST)

    def update(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=True)
        if serializer.is_valid():
            self.perform_update(serializer)
            return self.clinic_response(data=serializer.data, message="App data updated successfully")
        return self.clinic_response(error=serializer.errors, message="Failed to update app data", status_code=status.HTTP_400_BAD_REQUEST)

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        self.perform_destroy(instance)
        return self.clinic_response(message="App data deleted successfully", status_code=status.HTTP_204_NO_CONTENT)


class GalleryViewSet(ModelViewSet, ClinicView):
    queryset = Gallery.objects.all()
    serializer_class = GallerySerializer
    permission_classes = [IsAdminOrReadOnly]
    authentication_classes = []
    lookup_field = "id"
    pagination_class = StackPagination
    
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_fields = ["title", "department", "is_previous", "year"]
    search_fields = ["title", "description"]
    ordering_fields = ["title", "created_at", "ordering", "year"]
    ordering = ["ordering", "title"]

    def list(self, request, *args, **kwargs):
        queryset = self.filter_queryset(self.get_queryset())
        page = self.paginate_queryset(queryset)
        
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            paginated_response_data = self.get_paginated_response(serializer.data).data
            return self.clinic_response(
                data=paginated_response_data.get('results'),
                message="Galleries retrieved successfully",
                count=paginated_response_data.get('count'),
                next=paginated_response_data.get('next'),
                previous=paginated_response_data.get('previous')
            )
            
        serializer = self.get_serializer(queryset, many=True)
        return self.clinic_response(data=serializer.data, message="Galleries retrieved successfully")
    
    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance)
        return self.clinic_response(data=serializer.data, message="Gallery retrieved successfully")

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            self.perform_create(serializer)
            return self.clinic_response(data=serializer.data, message="Gallery created successfully", status_code=status.HTTP_201_CREATED)
        return self.clinic_response(error=serializer.errors, message="Failed to create gallery", status_code=status.HTTP_400_BAD_REQUEST)

    def update(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=True)
        if serializer.is_valid():
            self.perform_update(serializer)
            return self.clinic_response(data=serializer.data, message="Gallery updated successfully")
        return self.clinic_response(error=serializer.errors, message="Failed to update gallery", status_code=status.HTTP_400_BAD_REQUEST)

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        self.perform_destroy(instance)
        return self.clinic_response(message="Gallery deleted successfully", status_code=status.HTTP_204_NO_CONTENT)

    @action(detail=False, methods=['get'])
    def by_department(self, request):
        department = request.query_params.get('department', None)
        if department:
            galleries = Gallery.objects.filter(department=department)
            # Note: This custom action does not currently support pagination.
            # If pagination is desired here, it would need similar logic as the list view.
            serializer = self.get_serializer(galleries, many=True)
            return self.clinic_response(data=serializer.data, message=f"Galleries for {department} department retrieved")
        return self.clinic_response(error="Department parameter required", message="Department parameter is required.", status_code=status.HTTP_400_BAD_REQUEST)


class GalleryImageViewSet(ModelViewSet, ClinicView):
    queryset = GalleryImage.objects.all()
    serializer_class = GalleryImageSerializer
    permission_classes = [IsAdminOrReadOnly]
    lookup_field = "id"
    pagination_class = StackPagination
    
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_fields = ["gallery", "ordering"]
    search_fields = ["description"]
    ordering_fields = ["ordering", "created_at"]
    ordering = ["ordering"]

    def list(self, request, *args, **kwargs):
        queryset = self.filter_queryset(self.get_queryset())
        page = self.paginate_queryset(queryset)
        
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            paginated_response_data = self.get_paginated_response(serializer.data).data
            return self.clinic_response(
                data=paginated_response_data.get('results'),
                message="Gallery images retrieved successfully",
                count=paginated_response_data.get('count'),
                next=paginated_response_data.get('next'),
                previous=paginated_response_data.get('previous')
            )
            
        serializer = self.get_serializer(queryset, many=True)
        return self.clinic_response(data=serializer.data, message="Gallery images retrieved successfully")
    
    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance)
        return self.clinic_response(data=serializer.data, message="Gallery image retrieved successfully")

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            self.perform_create(serializer)
            return self.clinic_response(data=serializer.data, message="Gallery image created successfully", status_code=status.HTTP_201_CREATED)
        return self.clinic_response(error=serializer.errors, message="Failed to create gallery image", status_code=status.HTTP_400_BAD_REQUEST)

    def update(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=True)
        if serializer.is_valid():
            self.perform_update(serializer)
            return self.clinic_response(data=serializer.data, message="Gallery image updated successfully")
        return self.clinic_response(error=serializer.errors, message="Failed to update gallery image", status_code=status.HTTP_400_BAD_REQUEST)

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        self.perform_destroy(instance)
        return self.clinic_response(message="Gallery image deleted successfully", status_code=status.HTTP_204_NO_CONTENT)


class SponsorViewSet(ModelViewSet, ClinicView):
    queryset = Sponsor.objects.all()
    serializer_class = SponsorSerializer
    permission_classes = [IsAdminOrReadOnly]
    authentication_classes = []
    lookup_field = "id"
    pagination_class = StackPagination
    
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_fields = ["type", "ordering"]
    search_fields = ["name"]
    ordering_fields = ["ordering", "name"]
    ordering = ["ordering", "name"]

    def list(self, request, *args, **kwargs):
        queryset = self.filter_queryset(self.get_queryset())
        page = self.paginate_queryset(queryset)
        
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            paginated_response_data = self.get_paginated_response(serializer.data).data
            return self.clinic_response(
                data=paginated_response_data.get('results'),
                message="Sponsors retrieved successfully",
                count=paginated_response_data.get('count'),
                next=paginated_response_data.get('next'),
                previous=paginated_response_data.get('previous')
            )
            
        serializer = self.get_serializer(queryset, many=True)
        return self.clinic_response(data=serializer.data, message="Sponsors retrieved successfully")
    
    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance)
        return self.clinic_response(data=serializer.data, message="Sponsor retrieved successfully")

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            self.perform_create(serializer)
            return self.clinic_response(data=serializer.data, message="Sponsor created successfully", status_code=status.HTTP_201_CREATED)
        return self.clinic_response(error=serializer.errors, message="Failed to create sponsor", status_code=status.HTTP_400_BAD_REQUEST)

    def update(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=True)
        if serializer.is_valid():
            self.perform_update(serializer)
            return self.clinic_response(data=serializer.data, message="Sponsor updated successfully")
        return self.clinic_response(error=serializer.errors, message="Failed to update sponsor", status_code=status.HTTP_400_BAD_REQUEST)

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        self.perform_destroy(instance)
        return self.clinic_response(message="Sponsor deleted successfully", status_code=status.HTTP_204_NO_CONTENT)

    @action(detail=False, methods=['get'])
    def by_type(self, request):
        sponsor_type = request.query_params.get('type', None)
        if sponsor_type:
            sponsors = Sponsor.objects.filter(type=sponsor_type)
            # Note: This custom action does not currently support pagination.
            serializer = self.get_serializer(sponsors, many=True)
            return self.clinic_response(data=serializer.data, message=f"{sponsor_type.capitalize()} sponsors retrieved")
        return self.clinic_response(error="Type parameter required", message="Type parameter is required.", status_code=status.HTTP_400_BAD_REQUEST)


class TestimonialViewSet(ModelViewSet, ClinicView):
    queryset = Testimonial.objects.all()
    serializer_class = TestimonialSerializer
    permission_classes = [IsAdminOrReadOnly]
    authentication_classes = []
    lookup_field = "id"
    pagination_class = StackPagination
    
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    search_fields = ["name", "occupation", "quote"]
    ordering_fields = ["name"]
    ordering = ["name"]

    def list(self, request, *args, **kwargs):
        queryset = self.filter_queryset(self.get_queryset())
        page = self.paginate_queryset(queryset)
        
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            paginated_response_data = self.get_paginated_response(serializer.data).data
            return self.clinic_response(
                data=paginated_response_data.get('results'),
                message="Testimonials retrieved successfully",
                count=paginated_response_data.get('count'),
                next=paginated_response_data.get('next'),
                previous=paginated_response_data.get('previous')
            )
            
        serializer = self.get_serializer(queryset, many=True)
        return self.clinic_response(data=serializer.data, message="Testimonials retrieved successfully")
    
    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance)
        return self.clinic_response(data=serializer.data, message="Testimonial retrieved successfully")

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            self.perform_create(serializer)
            return self.clinic_response(data=serializer.data, message="Testimonial created successfully", status_code=status.HTTP_201_CREATED)
        return self.clinic_response(error=serializer.errors, message="Failed to create testimonial", status_code=status.HTTP_400_BAD_REQUEST)

    def update(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=True)
        if serializer.is_valid():
            self.perform_update(serializer)
            return self.clinic_response(data=serializer.data, message="Testimonial updated successfully")
        return self.clinic_response(error=serializer.errors, message="Failed to update testimonial", status_code=status.HTTP_400_BAD_REQUEST)

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        self.perform_destroy(instance)
        return self.clinic_response(message="Testimonial deleted successfully", status_code=status.HTTP_204_NO_CONTENT)

