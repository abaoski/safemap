"""
SafeMap-PH Models Package
Database models using SQLAlchemy
"""

# Import db from app - this avoids the multiple instance issue
from app import db

# Import models
from models.user import User
from models.report import Report
from models.location import Location
from models.help import HelpCategory, HelpContact

__all__ = ['db', 'User', 'Report', 'Location', 'HelpCategory', 'HelpContact']
