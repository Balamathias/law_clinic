# ruff: noqa: F403
import os

from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Determine which settings file to load
# Vercel environment sets VERCEL=1 by default.
if os.getenv("VERCEL") == "1" or os.getenv("DJANGO_ENV") == "production":
    from .production import *
else:
    from .local import *
