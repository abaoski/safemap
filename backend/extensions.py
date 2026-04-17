"""
Flask Extensions
Initialize database and other extensions here
"""

from flask_sqlalchemy import SQLAlchemy
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address

# Initialize SQLAlchemy
db = SQLAlchemy()

# Initialize Flask-Limiter
limiter = Limiter(
    key_func=get_remote_address,
    default_limits=["200 per day", "50 per hour"],
    storage_uri="memory://",
    headers_enabled=True  # Enable Retry-After and other rate limit headers
)
