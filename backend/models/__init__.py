"""
SafeMap-PH Models Package
Database models using SQLAlchemy - Redesigned with sys_ and trans_ prefixes
"""

# Import db from extensions
from extensions import db

# Import models using new naming convention
from models.sys_user import SysUser
from models.trans_report import TransReportHeader, TransReportLedger
from models.sys_location import SysLocation
from models.sys_emergency import SysHelpCategory, SysHelpContact
from models.sys_report_category import SysReportCategory
from models.sys_audit import SysAuditLog

__all__ = [
    'db', 
    'SysUser', 
    'TransReportHeader', 
    'TransReportLedger', 
    'SysLocation', 
    'SysHelpCategory', 
    'SysHelpContact',
    'SysReportCategory',
    'SysAuditLog'
]
