from rest_framework import status
from rest_framework.response import Response
from rest_framework.viewsets import ModelViewSet
from rest_framework.permissions import AllowAny, IsAdminUser
from rest_framework.decorators import action
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import SearchFilter, OrderingFilter
from django.db.models import Count

from app.models import HelpRequest
from app.serializers import HelpRequestSerializer
from app.utils import ClinicView
from app.pagination import StackPagination

class HelpRequestViewSet(ModelViewSet, ClinicView):
    queryset = HelpRequest.objects.all()
    serializer_class = HelpRequestSerializer
    permission_classes = [AllowAny]
    lookup_field = "id"

    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_fields = ["full_name", "email", "legal_issue_type", "had_previous_help"]
    search_fields = ["full_name", "email", "phone_number", "legal_issue_type", "description"]
    ordering_fields = ["created_at", "legal_issue_type", "full_name"]
    ordering = ["-created_at"]

    pagination_class = StackPagination

    def get_permissions(self):
        """
        Override permissions:
        - Anyone can create a help request
        - Only admin users can view, update or delete requests
        """
        if self.action == 'create':
            return [AllowAny()]
        return [IsAdminUser()]

    def list(self, request, *args, **kwargs):
        queryset = self.filter_queryset(self.get_queryset())
        paginated_queryset = self.paginate_queryset(queryset)
        
        if paginated_queryset is not None:
            serializer = self.get_serializer(paginated_queryset, many=True)
            paginated_data = self.get_paginated_response(serializer.data).data
            
            return Response({
                "count": paginated_data["count"],
                "next": paginated_data["next"],
                "previous": paginated_data["previous"],
                "data": paginated_data["results"],
                "message": "Help requests retrieved successfully",
                "status": 200,
                "error": None
            })

        serializer = self.get_serializer(queryset, many=True)
        return Response({
            "count": len(serializer.data),
            "next": None,
            "previous": None,
            "data": serializer.data,
            "message": "Help requests retrieved successfully",
            "status": 200,
            "error": None
        })
    
    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance)
        return self.clinic_response(data=serializer.data, message="Help request retrieved successfully")

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            self.perform_create(serializer)
            return self.clinic_response(
                data=serializer.data, 
                message="Your help request has been submitted successfully. Our team will contact you soon.", 
                status_code=status.HTTP_201_CREATED
            )
        print(serializer.errors)
        return self.clinic_response(
            error=serializer.errors, 
            message="Failed to submit help request", 
            status_code=status.HTTP_400_BAD_REQUEST
        )

    def update(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=True)
        if serializer.is_valid():
            self.perform_update(serializer)
            return self.clinic_response(data=serializer.data, message="Help request updated successfully")
        return self.clinic_response(
            error=serializer.errors, 
            message="Failed to update help request", 
            status_code=status.HTTP_400_BAD_REQUEST
        )

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        self.perform_destroy(instance)
        return self.clinic_response(message="Help request deleted successfully", status_code=status.HTTP_204_NO_CONTENT)

    @action(detail=False, methods=['get'], permission_classes=[IsAdminUser])
    def statistics(self, request):
        """
        Returns statistics about help requests in the system.
        Only accessible to admin users.
        """
        qs = HelpRequest.objects.all()
        total_requests = qs.count()
        new_count = qs.filter(status='new').count()
        in_review_count = qs.filter(status='in_review').count()
        assigned_count = qs.filter(status='assigned').count()
        resolved_count = qs.filter(status='resolved').count()
        closed_count = qs.filter(status='closed').count()

        by_issue_type = qs.values('legal_issue_type').annotate(
            count=Count('id')
        ).order_by('-count')
        
        had_previous_help_count = qs.filter(had_previous_help='yes').count()

        stats = {
            'total': total_requests,
            'new': new_count,
            'in_review': in_review_count,
            'assigned': assigned_count,
            'resolved': resolved_count,
            'closed': closed_count,
            'byIssueType': list(by_issue_type),
            'hadPreviousHelpCount': had_previous_help_count,
        }
        
        return self.clinic_response(
            data=stats,
            message="Help request statistics retrieved successfully"
        )
