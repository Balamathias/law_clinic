from django.shortcuts import render
from rest_framework import viewsets, filters, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny, IsAdminUser
from django.db.models import F
from django_filters.rest_framework import DjangoFilterBackend
from django.shortcuts import get_object_or_404

from .models import Publication, Category, Comment
from .serializers import (
    PublicationListSerializer, PublicationDetailSerializer, PublicationCreateUpdateSerializer,
    CategorySerializer, CommentSerializer
)
from app.utils import ClinicView

class CategoryViewSet(viewsets.ModelViewSet, ClinicView):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    lookup_field = 'slug'
    permission_classes = [IsAuthenticated]
    
    def get_permissions(self):
        if self.action in ['list', 'retrieve']:
            return [AllowAny()]
        return [IsAuthenticated()]
    
    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        serializer = self.get_serializer(queryset, many=True)
        return self.clinic_response(data=serializer.data, message="Categories retrieved successfully")


class PublicationViewSet(viewsets.ModelViewSet, ClinicView):
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['status', 'categories', 'author', 'is_featured']
    search_fields = ['title', 'content', 'excerpt', 'meta_title', 'meta_description', 'keywords']
    ordering_fields = ['published_at', 'created_at', 'title', 'views_count']
    ordering = ['-published_at']
    lookup_field = 'slug'
    
    def get_queryset(self):
        if self.request.user.is_staff:
            return Publication.objects.all()
        elif self.request.user.is_authenticated:
            # Return all published posts and user's own drafts
            return Publication.objects.filter(
                status='published'
            ) | Publication.objects.filter(
                author=self.request.user
            )
        else:
            # Only published posts for anonymous users
            return Publication.objects.filter(status='published')

    def get_object(self):
        queryset = self.filter_queryset(self.get_queryset())
        lookup_value = self.kwargs.get(self.lookup_field)
        
        import uuid
        try:
            uuid.UUID(str(lookup_value))
            # Valid UUID, look up by id
            obj = get_object_or_404(queryset, id=lookup_value)
        except ValueError:
            # Not a valid UUID, look up by slug
            obj = get_object_or_404(queryset, slug=lookup_value)
            
        self.check_object_permissions(self.request, obj)
        return obj
    
    def get_serializer_class(self):
        if self.action in ['create', 'update', 'partial_update']:
            return PublicationCreateUpdateSerializer
        elif self.action == 'retrieve':
            return PublicationDetailSerializer
        return PublicationListSerializer
    
    def get_permissions(self):
        if self.action in ['list', 'retrieve']:
            return [AllowAny()]
        return [IsAuthenticated()]
    
    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        
        # Increment view count
        if request.user != instance.author:
            Publication.objects.filter(pk=instance.pk).update(views_count=F('views_count') + 1)
            # Refresh the instance to get the updated view count
            instance.refresh_from_db()
            
        serializer = self.get_serializer(instance)
        return self.clinic_response(data=serializer.data, message="Publication retrieved successfully")
    
    def list(self, request, *args, **kwargs):
        queryset = self.filter_queryset(self.get_queryset())
        
        page = self.paginate_queryset(queryset)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            paginated_data = self.get_paginated_response(serializer.data).data
            
            return self.clinic_response(
                data=paginated_data["results"],
                message="Publications retrieved successfully",
                status_code=status.HTTP_200_OK,
                count=paginated_data["count"],
                next=paginated_data["next"],
                previous=paginated_data["previous"]
            )
        
        serializer = self.get_serializer(queryset, many=True)
        return self.clinic_response(
            data=serializer.data,
            message="Publications retrieved successfully",
            count=len(serializer.data)
        )
    
    def perform_create(self, serializer):
        serializer.save(author=self.request.user)
    
    @action(detail=True, methods=['post'], permission_classes=[IsAuthenticated])
    def add_comment(self, request, slug=None):
        publication = self.get_object()
        if not publication.allow_comments:
            return self.clinic_response(
                message="Comments are not allowed on this publication",
                status=status.HTTP_403_FORBIDDEN
            )
        
        # Create comment
        content = request.data.get('content')
        parent_id = request.data.get('parent_id')
        
        if not content:
            return self.clinic_response(
                message="Comment content is required",
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # If there's a parent_id, check it exists and belongs to this publication
        parent = None
        if parent_id:
            try:
                parent = Comment.objects.get(id=parent_id, publication=publication)
            except Comment.DoesNotExist:
                return self.clinic_response(
                    message="Parent comment not found",
                    status=status.HTTP_400_BAD_REQUEST
                )
        
        # Auto approve comments from the author of the publication
        is_approved = (request.user == publication.author)
        
        comment = Comment.objects.create(
            publication=publication,
            author=request.user,
            content=content,
            parent=parent,
            is_approved=is_approved
        )
        
        serializer = CommentSerializer(comment)
        return self.clinic_response(
            data=serializer.data,
            message="Comment added successfully" if is_approved else "Comment added and awaiting approval",
            status=status.HTTP_201_CREATED
        )
    
    @action(detail=False, methods=['get'])
    def featured(self, request):
        featured = Publication.objects.filter(
            is_featured=True,
            status='published'
        ).order_by('-published_at')[:5]
        serializer = PublicationListSerializer(featured, many=True)
        return self.clinic_response(
            data=serializer.data,
            message="Featured publications retrieved successfully"
        )
    
    @action(detail=False, methods=['get'])
    def my_publications(self, request):
        if not request.user.is_authenticated:
            return self.clinic_response(
                message="Authentication required",
                status=status.HTTP_401_UNAUTHORIZED
            )
        
        publications = Publication.objects.filter(author=request.user)
        serializer = PublicationListSerializer(publications, many=True)
        return self.clinic_response(
            data=serializer.data,
            message="Your publications retrieved successfully"
        )

    @action(detail=False, methods=['get'], permission_classes=[IsAdminUser])
    def stats(self, request):
        qs = Publication.objects.all()
        return Response({
            'data': {
                'total': qs.count(),
                'published': qs.filter(status='published').count(),
                'draft': qs.filter(status='draft').count(),
                'archived': qs.filter(status='archived').count(),
                'featured': qs.filter(is_featured=True).count(),
            },
            'message': 'Publication statistics retrieved successfully',
        })
