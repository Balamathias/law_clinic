import pytest
from django.core.mail import EmailMessage

from email_backends.resend_backend import ResendEmailBackend


def test_email_backend_fallback_to_console_in_debug(settings):
    """
    In local development (DEBUG=True), when RESEND_API_KEY is not configured,
    the backend should fall back to the Django console backend.
    """
    settings.DEBUG = True
    settings.RESEND_API_KEY = None

    backend = ResendEmailBackend()
    assert backend.api_key is None

    email = EmailMessage(
        subject="Test Subject", body="Test Body", from_email="noreply@lawstack.me", to=["test@example.com"]
    )

    # console backend should return count of emails sent successfully (which is 1)
    sent_count = backend.send_messages([email])
    assert sent_count == 1


def test_email_backend_errors_in_production_without_key(settings):
    """
    In production mode (DEBUG=False), when RESEND_API_KEY is not configured,
    the backend should raise a ValueError.
    """
    settings.DEBUG = False
    settings.RESEND_API_KEY = None

    backend = ResendEmailBackend(fail_silently=False)

    email = EmailMessage(
        subject="Test Subject", body="Test Body", from_email="noreply@lawstack.me", to=["test@example.com"]
    )

    with pytest.raises(ValueError, match="RESEND_API_KEY is missing"):
        backend.send_messages([email])


def test_email_backend_fails_silently_in_production_without_key(settings):
    """
    In production mode (DEBUG=False) with fail_silently=True,
    missing API key should return 0 without raising an error.
    """
    settings.DEBUG = False
    settings.RESEND_API_KEY = None

    backend = ResendEmailBackend(fail_silently=True)

    email = EmailMessage(
        subject="Test Subject", body="Test Body", from_email="noreply@lawstack.me", to=["test@example.com"]
    )

    sent_count = backend.send_messages([email])
    assert sent_count == 0
