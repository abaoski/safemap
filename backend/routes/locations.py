"""
SafeMap-PH Locations API Routes
Handle location-related endpoints
"""

from flask import request, jsonify
from routes import api_bp
from models import Location
from utils import paginate_query

@api_bp.route('/locations', methods=['GET'])
def get_locations():
    """Get all locations with optional filtering"""
    page = request.args.get('page', 1, type=int)
    per_page = request.args.get('per_page', 50, type=int)
    location_type = request.args.get('type')
    city = request.args.get('city')
    
    query = Location.query
    
    if location_type:
        query = query.filter(Location.location_type == location_type)
    if city:
        query = query.filter(Location.city.ilike(f'%{city}%'))
    
    pagination = paginate_query(query, page, per_page)
    
    return jsonify({
        'locations': [loc.to_dict() for loc in pagination.items],
        'total': pagination.total,
        'page': pagination.page,
        'pages': pagination.pages
    }), 200


@api_bp.route('/locations/<int:location_id>', methods=['GET'])
def get_location(location_id):
    """Get a single location by ID"""
    location = Location.query.get_or_404(location_id)
    return jsonify(location.to_dict()), 200


@api_bp.route('/locations/nearby', methods=['GET'])
def get_nearby_locations():
    """Get locations near a given point"""
    lat = request.args.get('latitude', type=float)
    lng = request.args.get('longitude', type=float)
    radius = request.args.get('radius', 5, type=float)  # default 5km
    
    if not lat or not lng:
        return jsonify({'error': 'Latitude and longitude are required'}), 400
    
    # Simple bounding box query (not precise, but efficient)
    # For production, use PostGIS for accurate distance calculations
    lat_range = radius / 111.0  # 1 degree ≈ 111km
    lng_range = radius / (111.0 * 0.7)  # Approximate for Philippines
    
    locations = Location.query.filter(
        Location.latitude.between(lat - lat_range, lat + lat_range),
        Location.longitude.between(lng - lng_range, lng + lng_range)
    ).all()
    
    return jsonify({
        'center': {'latitude': lat, 'longitude': lng},
        'radius_km': radius,
        'locations': [loc.to_dict() for loc in locations]
    }), 200


@api_bp.route('/locations', methods=['POST'])
def create_location():
    """Create a new location"""
    data = request.get_json()
    
    location = Location(
        name=data['name'],
        latitude=data['latitude'],
        longitude=data['longitude'],
        location_type=data.get('type', 'general'),
        address=data.get('address'),
        city=data.get('city'),
        barangay=data.get('barangay'),
        description=data.get('description'),
        facilities=data.get('facilities'),
        operating_hours=data.get('operating_hours'),
        contact_info=data.get('contact_info'),
        is_verified=data.get('is_verified', False)
    )
    
    location.save()
    
    return jsonify({
        'message': 'Location created successfully',
        'location': location.to_dict()
    }), 201


@api_bp.route('/locations/<int:location_id>', methods=['PUT'])
def update_location(location_id):
    """Update an existing location"""
    location = Location.query.get_or_404(location_id)
    data = request.get_json()
    
    for key in ['name', 'latitude', 'longitude', 'location_type', 'address', 
                'city', 'barangay', 'description', 'facilities', 
                'operating_hours', 'contact_info', 'is_verified']:
        if key in data:
            setattr(location, key, data[key])
    
    location.save()
    
    return jsonify({
        'message': 'Location updated successfully',
        'location': location.to_dict()
    }), 200


@api_bp.route('/locations/<int:location_id>', methods=['DELETE'])
def delete_location(location_id):
    """Delete a location"""
    location = Location.query.get_or_404(location_id)
    location.delete()
    
    return jsonify({'message': 'Location deleted successfully'}), 200


@api_bp.route('/locations/types', methods=['GET'])
def get_location_types():
    """Get all location types"""
    from models import db
    from sqlalchemy import func
    
    types = db.session.query(
        Location.location_type,
        func.count(Location.id)
    ).group_by(Location.location_type).all()
    
    return jsonify({
        'types': [{'type': t, 'count': c} for t, c in types]
    }), 200
