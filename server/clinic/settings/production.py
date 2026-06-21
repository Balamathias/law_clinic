# ruff: noqa: F403, F405
import os

import dj_database_url

from .base import *

DEBUG = False

# Configure CORS settings
CORS_ALLOW_ALL_ORIGINS = False
CORS_ALLOWED_ORIGINS = [
    "https://abulawclinic.org",
    "https://lawstack.me",
    "https://lawstack.vercel.app",
    "https://www.abulawclinic.org",
    "http://localhost:3000",
]
CORS_ALLOW_CREDENTIALS = True

# Database
DATABASES = {}
DATABASE_URL = os.getenv("DATABASE_URL")
if DATABASE_URL:
    DATABASES["default"] = dj_database_url.config(default=DATABASE_URL)
else:
    raise ValueError("DATABASE_URL environment variable must be set in production.")

FRONTEND_URL = os.getenv("FRONTEND_URL_PROD", "https://abulawclinic.org")

# Secure production headers
SECURE_SSL_REDIRECT = True
SESSION_COOKIE_SECURE = True
CSRF_COOKIE_SECURE = True
SECURE_BROWSER_XSS_FILTER = True
SECURE_CONTENT_TYPE_NOSNIFF = True
