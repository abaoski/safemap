"""
SafeMap-PH Report Model
Safety incident reports - Updated for workflow
"""

from models import db
from datetime import datetime
import secrets

class Report(db.Model):
    """Report model for safety incidents"""
    
    __tablename__ = 'reports'
    
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(200), nullable=False)
    description = db.Column(db.Text, nullable=False)
    category = db.Column(db.String(50), nullable=False, index=True)
    
    # Workflow Status:
    # - pending_review: Unverified & Pending Review (default)
    # - approved_awareness: Approved for Awareness (shows on public heatmap)
    # - verified: Verified (verified marker + official dashboards)
    # - dismissed: Spam/Duplicates (removed from public view)
    status = db.Column(db.String(30), default='pending_review', index=True)
    
    # Severity levels
    severity = db.Column(db.String(20), default='medium')
    
    # Location
    latitude = db.Column(db.Float, nullable=False)
    longitude = db.Column(db.Float, nullable=False)
    city = db.Column(db.String(100), index=True)
    barangay = db.Column(db.String(100))
    address = db.Column(db.String(256))
    
    # Anonymous submission tracking
    reference_code = db.Column(db.String(20), unique=True, index=True)
    is_anonymous = db.Column(db.Boolean, default=True)
    
    # Admin review fields
    reviewed_by = db.Column(db.Integer, db.ForeignKey('users.id'))
    review_notes = db.Column(db.Text)
    review_date = db.Column(db.DateTime)
    
    # PNP verification
    is_pnp_verified = db.Column(db.Boolean, default=False)
    pnp_case_number = db.Column(db.String(50))
    verified_date = db.Column(db.DateTime)
    
    # Created by user
    created_by = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=True)
    
    # Personal details (to be removed by admin)
    reporter_name = db.Column(db.String(100))
    reporter_contact = db.Column(db.String(100))
    has_personal_details = db.Column(db.Boolean, default=False)
    
    # Attachments
    image_url = db.Column(db.String(256))
    
    # Timestamps
    created_at = db.Column(db.DateTime, default=datetime.utcnow, index=True)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Categories (including GBV categories)
    CATEGORIES = [
        'theft',           # Theft/Robbery
        'assault',         # Physical assault
        'fraud',           # Scam/Fraud
        'harassment',      # Harassment
        'vandalism',       # Vandalism
        'accident',        # Traffic/Accident
        'fire',            # Fire incident
        'flood',           # Flooding
        'suspicious',      # Suspicious activity
        'violence',        # Violence
        # GBV Categories
        'sexual_assault',  # Sexual Assault
        'physical_abuse',  # Physical Abuse
        'domestic_violence', # Domestic Violence
        'stalking',        # Stalking
        'verbal_abuse',    # Verbal Abuse
        'emotional_abuse', # Emotional Abuse
        'other'            # Other
    ]
    
    # Severity levels
    SEVERITY_LEVELS = ['low', 'medium', 'high', 'critical']
    
    # Status values matching workflow
    STATUS_VALUES = [
        'pending_review',      # Unverified & Pending Review
        'approved_awareness', # Approved for Awareness
        'verified',           # Verified
        'dismissed'           # Spam/Duplicates
    ]
    
    def __repr__(self):
        return f'<Report {self.id}: {self.title}>'
    
    def generate_reference_code(self):
        """Generate unique reference code for anonymous submission"""
        self.reference_code = f'SMPH-{secrets.token_hex(3).upper()}'
        return self.reference_code
    
    def to_dict(self, include_personal=False, include_private=False):
        """Convert report to dictionary"""
        data = {
            'id': self.id,
            'title': self.title,
            'description': self.description,
            'category': self.category,
            'severity': self.severity,
            'status': self.status,
            'reference_code': self.reference_code,
            'is_anonymous': self.is_anonymous,
            'is_pnp_verified': self.is_pnp_verified,
            'pnp_case_number': self.pnp_case_number,
            'location': {
                'latitude': self.latitude,
                'longitude': self.longitude,
                'city': self.city,
                'barangay': self.barangay,
                'address': self.address
            },
            'image_url': self.image_url,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None
        }
        
        # Include personal details only for admin review
        if include_private:
            data['reporter_name'] = self.reporter_name
            data['reporter_contact'] = self.reporter_contact
            data['has_personal_details'] = self.has_personal_details
            data['reviewed_by'] = self.reviewed_by
            data['review_notes'] = self.review_notes
            data['review_date'] = self.review_date.isoformat() if self.review_date else None
        
        # Public API - no personal details
        if not include_personal and not include_private:
            data['show_on_heatmap'] = self.status in ['approved_awareness', 'verified_pnp']
        
        return data
    
    def to_public_dict(self):
        """Public view - only approved reports visible"""
        if self.status not in ['approved_awareness', 'verified_pnp']:
            return None
            
        return {
            'id': self.id,
            'title': self.title,
            'description': self.description,
            'category': self.category,
            'severity': self.severity,
            'status': self.status,
            'is_verified': self.status == 'verified_pnp',
            'location': {
                'latitude': self.latitude,
                'longitude': self.longitude,
                'city': self.city,
                'barangay': self.barangay
            },
            'created_at': self.created_at.isoformat() if self.created_at else None
        }
    
    def remove_personal_details(self):
        """Remove personal details for privacy"""
        self.reporter_name = None
        self.reporter_contact = None
        self.has_personal_details = False
    
    def approve_for_awareness(self, reviewed_by, notes=''):
        """Approve report for public awareness"""
        self.status = 'approved_awareness'
        self.reviewed_by = reviewed_by
        self.review_notes = notes
        self.review_date = datetime.utcnow()
        self.remove_personal_details()
    
    def verify_pnp(self, reviewed_by, case_number=None, notes=''):
        """Mark report as verified"""
        self.status = 'verified_pnp'
        self.is_pnp_verified = True
        self.pnp_case_number = case_number
        self.reviewed_by = reviewed_by
        self.review_notes = notes
        self.review_date = datetime.utcnow()
        self.verified_date = datetime.utcnow()
        self.remove_personal_details()
    
    def dismiss_report(self, reviewed_by, reason=''):
        """Dismiss report as spam/duplicate"""
        self.status = 'dismissed'
        self.reviewed_by = reviewed_by
        self.review_notes = reason
        self.review_date = datetime.utcnow()
        self.remove_personal_details()
    
    def save(self):
        """Save report to database"""
        db.session.add(self)
        db.session.commit()
    
    def delete(self):
        """Delete report from database"""
        db.session.delete(self)
        db.session.commit()
    
    @staticmethod
    def get_pending():
        """Get all pending review reports"""
        return Report.query.filter_by(status='pending_review')\
            .order_by(Report.created_at.desc()).all()
    
    @staticmethod
    def get_public():
        """Get approved reports for public heatmap"""
        return Report.query.filter(
            Report.status.in_(['approved_awareness', 'verified_pnp'])
        ).order_by(Report.created_at.desc()).all()
    
    @staticmethod
    def get_verified():
        """Get PNP verified reports"""
        return Report.query.filter_by(status='verified_pnp')\
            .order_by(Report.created_at.desc()).all()
    
    @staticmethod
    def get_by_reference(code):
        """Get report by reference code"""
        return Report.query.filter_by(reference_code=code).first()
