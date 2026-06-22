import pytest
from django.contrib.auth import get_user_model
from rest_framework import status
from rest_framework.test import APIClient

from app.models import HelpRequest

User = get_user_model()


@pytest.fixture
def api_client():
    return APIClient()


@pytest.fixture
def admin_user(db):
    return User.objects.create_user(
        email="admin@example.com", username="admin", password="testpassword123", is_staff=True, is_superuser=True
    )


@pytest.fixture
def regular_user(db):
    return User.objects.create_user(
        email="user@example.com", username="user", password="testpassword123", is_active=True
    )


@pytest.fixture
def unverified_user(db):
    user = User.objects.create_user(
        email="unverified@example.com", username="unverified", password="testpassword123", is_active=False
    )
    user.generate_otp()
    return user


@pytest.mark.django_db
def test_user_registration(api_client, settings):
    """
    Test that users can successfully register and receive an inactive account with an OTP.
    """
    settings.DEBUG = True
    settings.RESEND_API_KEY = None

    url = "/api/v1/auth/register/"
    data = {
        "email": "newuser@example.com",
        "username": "newuser",
        "password": "strongpassword123",
        "first_name": "New",
        "last_name": "User",
        "phone": "+1234567890",
    }

    response = api_client.post(url, data, format="json")
    assert response.status_code == status.HTTP_201_CREATED
    assert response.data["status"] == "success"

    # Check that user is in DB but inactive
    user = User.objects.get(email="newuser@example.com")
    assert user.is_active is False
    assert user.otp is not None


@pytest.mark.django_db
def test_verify_otp(api_client, unverified_user, settings):
    """
    Test verifying an OTP to activate the user account.
    """
    settings.DEBUG = True
    settings.RESEND_API_KEY = None

    url = "/api/v1/auth/verify-otp/"
    data = {"email": unverified_user.email, "otp": unverified_user.otp}

    response = api_client.post(url, data, format="json")
    assert response.status_code == status.HTTP_200_OK
    assert "access_token" in response.data

    unverified_user.refresh_from_db()
    assert unverified_user.is_active is True
    assert unverified_user.otp is None


@pytest.mark.django_db
def test_help_request_public_create(api_client):
    """
    Test that anyone (even anonymous users) can submit a help request.
    """
    url = "/api/v1/help-requests/"
    data = {
        "full_name": "John Doe",
        "email": "johndoe@example.com",
        "phone_number": "+1234567890",
        "legal_issue_type": "family",
        "had_previous_help": "no",
        "description": "I need help with a contract issue.",
    }

    response = api_client.post(url, data, format="json")
    assert response.status_code == status.HTTP_201_CREATED

    # Verify help request was saved
    assert HelpRequest.objects.filter(email="johndoe@example.com").exists()


@pytest.mark.django_db
def test_help_requests_access_control(api_client, regular_user, admin_user):
    """
    Test that only superusers/admins can fetch all help requests and statistics.
    """
    url_list = "/api/v1/help-requests/"
    url_stats = "/api/v1/help-requests/statistics/"

    # Create a help request
    HelpRequest.objects.create(
        full_name="Jane Doe",
        email="janedoe@example.com",
        phone_number="+1234567890",
        legal_issue_type="criminal",
        had_previous_help="no",
        description="Help request detail.",
    )

    # 1. Anonymous User gets blocked on list
    response = api_client.get(url_list)
    assert response.status_code == status.HTTP_401_UNAUTHORIZED

    # 2. Regular User gets blocked on list
    api_client.force_authenticate(user=regular_user)
    response = api_client.get(url_list)
    assert response.status_code == status.HTTP_403_FORBIDDEN

    # 3. Superuser (admin_user) is allowed
    api_client.force_authenticate(user=admin_user)
    response = api_client.get(url_list)
    assert response.status_code == status.HTTP_200_OK
    assert len(response.data["data"]) == 1

    # Test statistics endpoint
    response = api_client.get(url_stats)
    assert response.status_code == status.HTTP_200_OK
    assert response.data["data"]["total"] == 1


@pytest.mark.django_db
def test_password_reset_flow(api_client, regular_user, settings):
    """
    Test the full password reset flow: request reset, validate token, and confirm reset.
    """
    settings.DEBUG = True
    settings.RESEND_API_KEY = None

    # 1. Request password reset
    url_request = "/api/v1/auth/password-reset/"
    response = api_client.post(url_request, {"email": regular_user.email}, format="json")
    assert response.status_code == status.HTTP_200_OK
    assert response.data["message"] == "Password reset link sent to your email."

    # Generate token and uid
    from django.contrib.auth.tokens import default_token_generator
    from django.utils.encoding import force_bytes
    from django.utils.http import urlsafe_base64_encode

    uid = urlsafe_base64_encode(force_bytes(regular_user.pk))
    token = default_token_generator.make_token(regular_user)

    # 2. Validate token
    url_validate = f"/api/v1/auth/password-reset/validate-token/{uid}/{token}/"
    response = api_client.post(url_validate, format="json")
    assert response.status_code == status.HTTP_200_OK
    assert response.data["message"] == "Token is valid."

    # 3. Confirm password reset
    url_confirm = f"/api/v1/auth/password-reset/confirm/{uid}/{token}/"
    response = api_client.post(url_confirm, {"password": "newstrongpassword123"}, format="json")
    assert response.status_code == status.HTTP_200_OK
    assert "access" in response.data["data"]

    # Check that we can login with the new password
    regular_user.refresh_from_db()
    assert regular_user.check_password("testpassword123") is False
    assert regular_user.check_password("newstrongpassword123") is True


from unittest.mock import patch, MagicMock
from django.core.files.uploadedfile import SimpleUploadedFile

@pytest.mark.django_db
@patch("app.views.uploads.boto3.client")
def test_upload_view(mock_boto_client, api_client, regular_user, settings):
    """
    Test that authenticated users can upload files to R2 via UploadView.
    """
    settings.R2_ACCOUNT_ID = "test-account"
    settings.R2_ACCESS_KEY_ID = "test-key"
    settings.R2_SECRET_ACCESS_KEY = "test-secret"
    settings.R2_BUCKET_NAME = "test-bucket"
    settings.R2_PUBLIC_URL_BASE = "https://cdn.example.com"

    mock_s3 = MagicMock()
    mock_boto_client.return_value = mock_s3

    url = "/api/v1/uploads/"
    file_content = b"fake image content"
    uploaded_file = SimpleUploadedFile("test_image.png", file_content, content_type="image/png")

    # 1. Anonymous user gets unauthorized
    response = api_client.post(url, {"file": uploaded_file, "category": "publications"}, format="multipart")
    assert response.status_code == status.HTTP_401_UNAUTHORIZED

    # 2. Authenticated user successfully uploads
    api_client.force_authenticate(user=regular_user)
    # Re-create uploaded file because it gets consumed
    uploaded_file = SimpleUploadedFile("test_image.png", file_content, content_type="image/png")
    response = api_client.post(url, {"file": uploaded_file, "category": "publications"}, format="multipart")
    
    assert response.status_code == status.HTTP_201_CREATED
    assert "url" in response.data["data"]
    assert response.data["data"]["url"].startswith("https://cdn.example.com/publications/")
    assert response.data["data"]["url"].endswith(".png")
    mock_s3.upload_fileobj.assert_called_once()


from rest_framework_simplejwt.tokens import RefreshToken

@pytest.mark.django_db
def test_user_logout(api_client, regular_user):
    url = "/api/v1/auth/logout/"
    
    # 1. Anonymous user gets unauthorized
    response = api_client.post(url, {"refresh": "fake-refresh-token"}, format="json")
    assert response.status_code == status.HTTP_401_UNAUTHORIZED

    # 2. Authenticated user successfully logs out
    api_client.force_authenticate(user=regular_user)
    refresh = RefreshToken.for_user(regular_user)
    
    response = api_client.post(url, {"refresh": str(refresh)}, format="json")
    assert response.status_code == status.HTTP_205_RESET_CONTENT
    assert response.data["message"] == "Logout successful"


