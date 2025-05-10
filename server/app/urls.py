"""
LawClinic API URL Configuration
This file defines the URL routing for the LawClinic API application. It maps URLs to view functions and includes
both Django REST Framework router-based URLs and explicit URL patterns.
API Endpoints:
--------------
Authentication URLs:
    - POST /auth/register/ - Register a new user and send OTP verification email
    - POST /auth/login/ - Authenticate user and obtain JWT token pair
    - POST /auth/refresh/ - Refresh access token using refresh token
    - POST /auth/logout/ - Blacklist refresh token to log out user
    - POST /auth/verify-otp/ - Verify OTP sent during registration
    - POST /auth/resend-otp/ - Resend OTP for verification if expired
User Management:
    - GET /auth/user/ - Get current authenticated user's profile
    - PUT /auth/update-user/ - Update current user's profile information
REST Framework Viewsets:
    Users:
        - GET /users/ - List all users (paginated, filterable, searchable)
        - POST /users/ - Create a new user (admin only)
        - GET /users/{id}/ - Retrieve specific user details
        - PUT /users/{id}/ - Update user details (admin only)
        - DELETE /users/{id}/ - Delete a user (admin only)
        - GET /users/overview/ - Get user statistics (admin only)
    Help Requests:
        - GET /help-requests/ - List all legal help requests (authenticated users)
        - POST /help-requests/ - Submit a new help request (public access)
        - GET /help-requests/{id}/ - Retrieve specific help request details
        - PUT /help-requests/{id}/ - Update help request (authenticated users)
        - DELETE /help-requests/{id}/ - Delete help request (authenticated users)
        - GET /help-requests/statistics/ - Get help request statistics (admin only)
"""

from django.urls import path

from django.urls import include

from rest_framework_simplejwt.views import TokenRefreshView

from rest_framework.routers import DefaultRouter

from app.views import (
    CurrentUserView,
    UserViewSet,
    LogoutView,
    ObtainTokenPairView,
    UpdateUserView,
    RegisterView,
    VerifyOTPView,
    ResendOTPView,
    HelpRequestViewSet,
)

router = DefaultRouter()


router.register(r"users", UserViewSet, basename="users")
router.register(r"help-requests", HelpRequestViewSet, basename="help_requests")

urlpatterns = [
    path('', include(router.urls)),
]

urlpatterns += [
    path('auth/login/', ObtainTokenPairView.as_view(), name='token_obtain_pair'),
    path('auth/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('auth/register/', RegisterView.as_view(), name='register'),
    path('auth/logout/', LogoutView.as_view(), name='logout'),

    path('auth/user/', CurrentUserView.as_view(), name='current_user'),
    path('auth/update-user/', UpdateUserView.as_view(), name='update_user'),

    path('auth/verify-otp/', VerifyOTPView.as_view(), name='verify-otp'),
    path('auth/resend-otp/', ResendOTPView.as_view(), name='resend-otp'),
]
