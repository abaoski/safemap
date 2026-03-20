"""
SafeMap-PH Location Model
Safe locations and points of interest
"""

from models import db
from datetime import datetime

class Location(db.Model):
    """Location model for safe places and points of interest"""
    
    __tablename__ = 'locations'
    
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(200), nullable=False)
    description = db.Column(db.Text)
    
    # Location type
    location_type = db.Column(db.String(50), nullable=False, index=True)
    
    # Coordinates
    latitude = db.Column(db.Float, nullable=False)
    longitude = db.Column(db.Float, nullable=False)
    
    # Address
    address = db.Column(db.String(256))
    city = db.Column(db.String(100), index=True)
    barangay = db.Column(db.String(100))
    
    # Details
    facilities = db.Column(db.JSON)  # List of facilities available
    operating_hours = db.Column(db.String(100))
    contact_info = db.Column(db.JSON)  # Phone, email, website
    website = db.Column(db.String(256))
    
    # Safety rating
    safety_rating = db.Column(db.Float)  # 0-5 scale
    safety_score = db.Column(db.Integer)  # 0-100 score
    
    # Verification
    is_verified = db.Column(db.Boolean, default=False)
    verified_by = db.Column(db.Integer, db.ForeignKey('users.id'))
    verified_at = db.Column(db.DateTime)
    
    # Timestamps
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Location types
    LOCATION_TYPES = [
        'police_station',
        'hospital',
        'fire_station',
        ' barangay_hall',
        'school',
        'church',
        'community_center',
        'public_space',
        'business',
        'residential',
        'other'
    ]
    
    def __repr__(self):
        return f'<Location {self.id}: {self.name}>'
    
    def to_dict(self):
        """Convert location to dictionary"""
        return {
            'id': self.id,
            'name': self.name,
            'description': self.description,
            'type': self.location_type,
            'location': {
                'latitude': self.latitude,
                'longitude': self.longitude,
                'address': self.address,
                'city': self.city,
                'barangay': self.barangay
            },
            'facilities': self.facilities,
            'operating_hours': self.operating_hours,
            'contact_info': self.contact_info,
            'website': self.website,
            'safety_rating': self.safety_rating,
            'safety_score': self.safety_score,
            'is_verified': self.is_verified,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None
        }
    
    def save(self):
        """Save location to database"""
        db.session.add(self)
        db.session.commit()
    
    def delete(self):
        """Delete location from database"""
        db.session.delete(self)
        db.session.commit()
    
    @staticmethod
    def get_by_type(location_type):
        """Get locations by type"""
        return Location.query.filter_by(location_type=location_type).all()
    
    @staticmethod
    def get_by_city(city):
        """Get locations by city"""
        return Location.query.filter_by(city=city).all()
    
    @staticmethod
    def get_verified():
        """Get verified locations"""
        return Location.query.filter_by(is_verified=True).all()
    
    @staticmethod
    def search_by_name(query):
        """Search locations by name"""
        return Location.query.filter(Location.name.ilike(f'%{query}%')).all()
