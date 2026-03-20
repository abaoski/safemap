"""
SafeMap-PH Help Directory API Routes
Emergency hotlines, contacts, and safety resources
"""

from flask import request, jsonify
from routes import api_bp
from models import HelpCategory, HelpContact
from utils import require_auth, get_current_user, validate_json

# Default emergency contacts for seeding
DEFAULT_CONTACTS = [
    # PNP
    {'name': 'PNP Hotline', 'category': 'pnp', 'phone': '117', 'description': 'National Emergency Hotline', 'is_24_7': True},
    {'name': 'PNP Crime Report', 'category': 'pnp', 'phone': '0917-847-5757', 'description': 'Text PNP', 'is_24_7': True},
    # WCPD
    {'name': 'WCPD Hotline', 'category': 'wcpd', 'phone': '02-8532-5003', 'description': 'Women and Children Protection Center', 'is_24_7': True},
    # VAWC
    {'name': 'VAWC Hotline', 'category': 'vawc', 'phone': '1388', 'description': 'Violence Against Women and Children', 'is_24_7': True},
    # DSWD
    {'name': 'DSWD Hotline', 'category': 'dswd', 'phone': '02-8931-8101', 'description': 'Department of Social Welfare and Development', 'is_24_7': True},
    {'name': 'DSWD SWAD', 'category': 'dswd', 'phone': '0932-529-8293', 'description': 'SWAD Team - NCR', 'is_24_7': True},
    # Fire
    {'name': 'BFP Hotline', 'category': 'fire', 'phone': '117', 'description': 'Bureau of Fire Protection Emergency', 'is_24_7': True},
    # Medical
    {'name': 'Red Cross', 'category': 'medical', 'phone': '143', 'description': 'Philippine Red Cross Emergency', 'is_24_7': True},
    {'name': 'Medical City', 'category': 'medical', 'phone': '02-8988-1000', 'description': 'The Medical City Hospital', 'is_24_7': False},
    # Disaster
    {'name': 'NDRRMC', 'category': 'disaster', 'phone': '02-8911-5061', 'description': 'National Disaster Risk Reduction and Management Council', 'is_24_7': True},
    # Emergency
    {'name': 'Emergency 911', 'category': 'emergency', 'phone': '911', 'description': 'National Emergency Hotline', 'is_24_7': True},
]


@api_bp.route('/help/categories', methods=['GET'])
def get_help_categories():
    """Get all help categories"""
    categories = HelpCategory.query.filter_by(is_active=True)\
        .order_by(HelpCategory.display_order).all()
    
    return jsonify({
        'categories': [c.to_dict() for c in categories]
    }), 200


@api_bp.route('/help/contacts', methods=['GET'])
def get_all_contacts():
    """Get all emergency contacts"""
    category = request.args.get('category')
    
    if category:
        contacts = HelpContact.get_by_category(category)
    else:
        contacts = HelpContact.get_all_active()
    
    return jsonify({
        'contacts': [c.to_dict() for c in contacts]
    }), 200


@api_bp.route('/help/contacts/<int:contact_id>', methods=['GET'])
def get_contact(contact_id):
    """Get a single contact"""
    contact = HelpContact.query.get_or_404(contact_id)
    return jsonify(contact.to_dict()), 200


@api_bp.route('/help/contacts', methods=['POST'])
@require_auth
def create_contact():
    """Create new contact (admin only)"""
    current_user = get_current_user()
    if current_user.role not in ['admin', 'moderator']:
        return jsonify({'error': 'Unauthorized'}), 403
    
    data = request.get_json()
    
    # Get or create category
    category_name = data.get('category', 'other')
    category = HelpCategory.query.filter_by(name=category_name).first()
    if not category:
        category = HelpCategory(name=category_name, description=data.get('category_label', category_name))
        category.save()
    
    contact = HelpContact(
        category_id=category.id,
        name=data['name'],
        description=data.get('description'),
        phone=data.get('phone'),
        phone_alt=data.get('phone_alt'),
        email=data.get('email'),
        website=data.get('website'),
        address=data.get('address'),
        latitude=data.get('latitude'),
        longitude=data.get('longitude'),
        operating_hours=data.get('operating_hours'),
        is_24_7=data.get('is_24_7', False),
        created_by=current_user.id
    )
    
    contact.save()
    
    return jsonify({
        'message': 'Contact created successfully',
        'contact': contact.to_dict()
    }), 201


@api_bp.route('/help/contacts/<int:contact_id>', methods=['PUT'])
@require_auth
def update_contact(contact_id):
    """Update contact (admin only)"""
    current_user = get_current_user()
    if current_user.role not in ['admin', 'moderator']:
        return jsonify({'error': 'Unauthorized'}), 403
    
    contact = HelpContact.query.get_or_404(contact_id)
    data = request.get_json()
    
    # Update fields
    for field in ['name', 'description', 'phone', 'phone_alt', 'email', 
                  'website', 'address', 'latitude', 'longitude', 
                  'operating_hours', 'is_24_7', 'is_active', 'is_verified']:
        if field in data:
            setattr(contact, field, data[field])
    
    # Update category
    if 'category' in data:
        category = HelpCategory.query.filter_by(name=data['category']).first()
        if category:
            contact.category_id = category.id
    
    contact.save()
    
    return jsonify({
        'message': 'Contact updated successfully',
        'contact': contact.to_dict()
    }), 200


@api_bp.route('/help/contacts/<int:contact_id>', methods=['DELETE'])
@require_auth
def delete_contact(contact_id):
    """Delete contact (admin only)"""
    current_user = get_current_user()
    if current_user.role not in ['admin', 'moderator']:
        return jsonify({'error': 'Unauthorized'}), 403
    
    contact = HelpContact.query.get_or_404(contact_id)
    contact.delete()
    
    return jsonify({'message': 'Contact deleted successfully'}), 200


@api_bp.route('/help/search', methods=['GET'])
def search_help():
    """Search help contacts"""
    query = request.args.get('q', '')
    
    if len(query) < 2:
        return jsonify({'error': 'Query too short'}), 400
    
    contacts = HelpContact.search(query)
    
    return jsonify({
        'query': query,
        'contacts': [c.to_dict() for c in contacts]
    }), 200


@api_bp.route('/help/emergency', methods=['GET'])
def get_emergency_contacts():
    """Get key emergency contacts for quick access"""
    key_categories = ['pnp', 'emergency', 'medical', 'fire', 'vawc']
    
    contacts = []
    for cat in key_categories:
        cat_contacts = HelpContact.get_by_category(cat)
        contacts.extend(cat_contacts)
    
    return jsonify({
        'emergency_contacts': [c.to_dict() for c in contacts]
    }), 200


@api_bp.route('/help/seed', methods=['POST'])
@require_auth
def seed_default_contacts():
    """Seed default emergency contacts (first time setup)"""
    current_user = get_current_user()
    if current_user.role != 'admin':
        return jsonify({'error': 'Admin access required'}), 403
    
    # Create categories
    for cat in HelpContact.CATEGORIES:
        existing = HelpCategory.query.filter_by(name=cat['name']).first()
        if not existing:
            category = HelpCategory(
                name=cat['name'],
                description=cat['label'],
                icon=cat['icon']
            )
            category.save()
    
    # Create default contacts
    for contact_data in DEFAULT_CONTACTS:
        existing = HelpContact.query.filter_by(name=contact_data['name']).first()
        if not existing:
            category = HelpCategory.query.filter_by(name=contact_data['category']).first()
            if category:
                contact = HelpContact(
                    category_id=category.id,
                    name=contact_data['name'],
                    description=contact_data.get('description'),
                    phone=contact_data.get('phone'),
                    is_24_7=contact_data.get('is_24_7', False),
                    is_verified=True,
                    created_by=current_user.id
                )
                contact.save()
    
    return jsonify({'message': 'Default contacts seeded successfully'}), 201
