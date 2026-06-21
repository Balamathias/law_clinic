# ruff: noqa: F403, F405
import os

import dj_database_url

from .base import *

DEBUG = True

# Configure CORS settings
CORS_ALLOW_ALL_ORIGINS = True
CORS_ALLOW_CREDENTIALS = True

# Database settings
DATABASES = {
    "default": {
        "ENGINE": "django.db.backends.sqlite3",
        "NAME": BASE_DIR / "db.sqlite3",
    }
}

# Load database settings from environment variable if available
DATABASE_URL = os.getenv("DATABASE_URL")
if DATABASE_URL:
    DATABASES["default"] = dj_database_url.config(default=DATABASE_URL)

FRONTEND_URL = os.getenv("FRONTEND_URL", "http://localhost:3000")
