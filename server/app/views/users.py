from django.db.utils import IntegrityError
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import status
from rest_framework.decorators import action
from rest_framework.exceptions import ValidationError
from rest_framework.filters import OrderingFilter, SearchFilter
from rest_framework.permissions import IsAdminUser, IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.viewsets import ModelViewSet

from app.models import User
from app.pagination import StackPagination
from app.permissions import IsAdminOrReadOnly
from app.serializers import UserSerializer
from app.utils import ClinicView


class UpdateUserView(APIView, ClinicView):
    permission_classes = [IsAuthenticated]

    def put(self, request):
        try:
            user = request.user
            data = request.data

            user.first_name = data.get("first_name", user.first_name)
            user.last_name = data.get("last_name", user.last_name)
            user.avatar = data.get("avatar", user.avatar)
            user.username = data.get("username", user.username)
            user.phone = data.get("phone", user.phone)

            user.save()

            serializer = UserSerializer(user)
            return self.clinic_response(data=serializer.data, message="User updated successfully")

        except User.DoesNotExist:
            return self.clinic_response(data=None, message="User not found", status=status.HTTP_404_NOT_FOUND)

        except ValidationError as e:
            return self.clinic_response(
                data=None, message="Validation error", status=status.HTTP_400_BAD_REQUEST, error=e.detail
            )

        except IntegrityError as e:
            return self.clinic_response(
                data=None,
                message=f"Username - {data.get('username')} already exists",
                status=status.HTTP_400_BAD_REQUEST,
                error={"username": "Username already exists", "detail": str(e)},
            )

        except Exception as e:
            return self.clinic_response(
                data=None,
                message="An error occurred",
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
                error={"detail": str(e)},
            )


class ChangePasswordView(APIView, ClinicView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        user = request.user
        old_password = request.data.get("old_password")
        new_password = request.data.get("new_password")

        if not old_password or not new_password:
            return self.clinic_response(
                message="Old password and new password are required.",
                status=status.HTTP_400_BAD_REQUEST,
            )

        if not user.check_password(old_password):
            return self.clinic_response(
                message="Incorrect old password.",
                status=status.HTTP_400_BAD_REQUEST,
                error={"old_password": "Old password is incorrect."}
            )

        try:
            user.set_password(new_password)
            user.save()
            return self.clinic_response(message="Password changed successfully.")
        except Exception as e:
            return self.clinic_response(
                message="Failed to change password.",
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
                error={"detail": str(e)}
            )


class CurrentUserView(APIView, ClinicView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        serializer = UserSerializer(user)
        return self.clinic_response(data=serializer.data, message="User retrieved successfully")


class UserViewSet(ModelViewSet, ClinicView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsAdminOrReadOnly]
    lookup_field = "id"

    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_fields = [
        "username",
        "first_name",
        "last_name",
        "email",
        "phone",
    ]
    search_fields = [
        "username",
        "first_name",
        "last_name",
        "email",
        "phone",
    ]
    ordering_fields = [
        "username",
        "first_name",
        "last_name",
        "email",
        "phone",
    ]
    ordering = ["-username", "email"]

    pagination_class = StackPagination

    def list(self, request, *args, **kwargs):
        queryset = self.filter_queryset(self.get_queryset())

        paginated_queryset = self.paginate_queryset(queryset)
        if paginated_queryset is not None:
            serializer = self.get_serializer(paginated_queryset, many=True)
            paginated_data = self.get_paginated_response(serializer.data).data

            return Response(
                {
                    "count": paginated_data["count"],
                    "next": paginated_data["next"],
                    "previous": paginated_data["previous"],
                    "data": paginated_data["results"],
                    "message": "Users retrieved successfully",
                    "status": 200,
                    "error": None,
                }
            )

        serializer = self.get_serializer(queryset, many=True)
        return Response(
            {
                "count": len(serializer.data),
                "next": None,
                "previous": None,
                "data": serializer.data,
                "message": "Users retrieved successfully",
                "status": 200,
                "error": None,
            }
        )

    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance)
        return self.clinic_response(data=serializer.data, message="Users retrieved successfully")

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return self.clinic_response(
                data=serializer.data, message="Users created successfully", status_code=status.HTTP_201_CREATED
            )
        return self.clinic_response(
            error=serializer.errors, message="Failed to create Users", status_code=status.HTTP_400_BAD_REQUEST
        )

    def update(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return self.clinic_response(data=serializer.data, message="Users updated successfully")
        return self.clinic_response(
            error=serializer.errors, message="Failed to update Users", status_code=status.HTTP_400_BAD_REQUEST
        )

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        instance.delete()
        return self.clinic_response(message="Users deleted successfully", status_code=status.HTTP_204_NO_CONTENT)

    @action(detail=False, methods=["get"], permission_classes=[IsAdminUser])
    def overview(self, request):
        """
        Returns statistics about users in the system.
        Only accessible to admin users.
        """
        total_users = User.objects.count()
        active_users = User.objects.filter(is_active=True).count()
        staff_users = User.objects.filter(is_staff=True).count()
        admin_users = User.objects.filter(is_superuser=True).count()

        stats = {
            "totalUsers": total_users,
            "activeUsers": active_users,
            "staffUsers": staff_users,
            "adminUsers": admin_users,
        }

        return self.clinic_response(data=stats, message="User overview statistics retrieved successfully")

    @action(detail=False, methods=["get"], permission_classes=[IsAdminUser])
    def stats(self, request):
        """Flat stats shape for the dashboard overview card."""
        return Response(
            {
                "data": {
                    "total": User.objects.count(),
                    "active": User.objects.filter(is_active=True).count(),
                    "staff": User.objects.filter(is_staff=True).count(),
                    "admins": User.objects.filter(is_superuser=True).count(),
                },
                "message": "User statistics retrieved successfully",
            }
        )
