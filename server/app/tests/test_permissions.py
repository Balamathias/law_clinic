import pytest
from django.contrib.auth import get_user_model
from django.contrib.auth.models import AnonymousUser
from rest_framework.test import APIRequestFactory

from app.permissions import IsAdminUser, IsStaffUser, ReadOnlyOrStaff

User = get_user_model()


@pytest.fixture
def factory():
    return APIRequestFactory()


@pytest.fixture
def regular_user(db):
    return User.objects.create_user(email="r@example.com", password="x")


@pytest.fixture
def staff_user(db):
    return User.objects.create_user(email="s@example.com", password="x", is_staff=True)


@pytest.fixture
def admin_user(db):
    return User.objects.create_user(
        email="a@example.com",
        password="x",
        is_staff=True,
        is_superuser=True,
    )


def test_is_staff_blocks_regular(factory, regular_user):
    req = factory.get("/x")
    req.user = regular_user

    assert IsStaffUser().has_permission(req, None) is False


def test_is_staff_allows_staff(factory, staff_user):
    req = factory.get("/x")
    req.user = staff_user

    assert IsStaffUser().has_permission(req, None) is True


def test_is_admin_blocks_staff(factory, staff_user):
    req = factory.get("/x")
    req.user = staff_user

    assert IsAdminUser().has_permission(req, None) is False


def test_is_admin_allows_superuser(factory, admin_user):
    req = factory.get("/x")
    req.user = admin_user

    assert IsAdminUser().has_permission(req, None) is True


def test_readonly_or_staff_allows_anon_get(factory):
    req = factory.get("/x")
    req.user = None

    assert ReadOnlyOrStaff().has_permission(req, None) is True


def test_readonly_or_staff_blocks_anon_post(factory):
    req = factory.post("/x")
    req.user = AnonymousUser()

    assert ReadOnlyOrStaff().has_permission(req, None) is False
