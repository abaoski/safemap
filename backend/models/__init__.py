"""
SafeMap-PH Models Package
Database models using SQLAlchemy
"""

# Import db from extensions - this avoids the multiple instance issue
from extensions import db

# Import models
from models.user import User
from models.report import Report, ReportCategory
from models.location import Location
from models.help import HelpCategory, HelpContact

__all__ = ['db', 'User', 'Report', 'ReportCategory', 'Location', 'HelpCategory', 'HelpContact']
