"""
SafeMap-PH Database Initialization Script
Initialize SQLite database and seed default data
"""

from app import create_app, db

def init_database():
    """Initialize the database with tables and default data"""
    
    app = create_app()
    
    with app.app_context():
        # Create all tables
        print("Creating database tables...")
        db.create_all()
        print("[OK] Tables created successfully")
        
        # Import models after db is initialized
        from models import User, HelpCategory, HelpContact
        
        # Check if admin exists
        admin = User.query.filter_by(username='admin').first()
        if not admin:
            print("\nCreating default admin user...")
            admin = User(
                username='admin',
                email='admin@safemap.ph',
                full_name='System Administrator',
                role='admin',
                is_admin=True,
                is_active=True
            )
            admin.set_password('admin123')  # Change this in production!
            db.session.add(admin)
            db.session.commit()
            print("✓ Admin user created (username: admin, password: admin123)")
        else:
            print("\n[OK] Admin user already exists")
        
        # Seed default help contacts
        seed_help_contacts()
        
        print("\n" + "="*50)
        print("Database initialization complete!")
        print("="*50)
        print(f"\nDatabase: {app.config['SQLALCHEMY_DATABASE_URI']}")
        print("\nNext steps:")
        print("1. Run 'python run.py' to start the backend server")
        print("2. Login at http://localhost:5000/api/auth/login")


def seed_help_contacts():
    """Seed default emergency contacts"""
    from models import HelpCategory, HelpContact
    
    # Check if contacts already exist
    if HelpContact.query.first():
        print("[OK] Help contacts already seeded")
        return
    
    print("\nSeeding emergency contacts...")
    
    # Categories
    categories = [
        {'name': 'pnp', 'label': 'Philippine National Police', 'icon': 'shield'},
        {'name': 'vawc', 'label': 'VAWC (Violence Against Women and Children)', 'icon': 'heart'},
        {'name': 'dswd', 'label': 'Department of Social Welfare', 'icon': 'users'},
        {'name': 'fire', 'label': 'Bureau of Fire Protection', 'icon': 'flame'},
        {'name': 'medical', 'label': 'Medical Emergency', 'icon': 'heart-pulse'},
        {'name': 'emergency', 'label': 'General Emergency', 'icon': 'siren'},
    ]
    
    created_categories = {}
    for cat in categories:
        category = HelpCategory(
            name=cat['name'],
            description=cat['label'],
            icon=cat['icon']
        )
        db.session.add(category)
        db.session.flush()
        created_categories[cat['name']] = category
    
    # Default contacts
    contacts = [
        {'name': 'PNP Emergency Hotline', 'category': 'pnp', 'phone': '117', 'description': 'National Emergency Hotline', 'is_24_7': True},
        {'name': 'PNP Crime Report', 'category': 'pnp', 'phone': '0917-847-5757', 'description': 'Text PNC', 'is_24_7': True},
        {'name': 'WCPD Hotline', 'category': 'vawc', 'phone': '02-8532-5003', 'description': 'Women and Children Protection Center', 'is_24_7': True},
        {'name': 'VAWC Hotline', 'category': 'vawc', 'phone': '1388', 'description': 'Violence Against Women and Children', 'is_24_7': True},
        {'name': 'DSWD Hotline', 'category': 'dswd', 'phone': '02-8931-8101', 'description': 'Department of Social Welfare', 'is_24_7': True},
        {'name': 'DSWD NCR', 'category': 'dswd', 'phone': '0932-529-8293', 'description': 'SWAD Team - NCR', 'is_24_7': True},
        {'name': 'BFP Emergency', 'category': 'fire', 'phone': '117', 'description': 'Bureau of Fire Protection', 'is_24_7': True},
        {'name': 'Red Cross', 'category': 'medical', 'phone': '143', 'description': 'Philippine Red Cross', 'is_24_7': True},
        {'name': 'Emergency 911', 'category': 'emergency', 'phone': '911', 'description': 'National Emergency Hotline', 'is_24_7': True},
        {'name': 'NDRRMC', 'category': 'emergency', 'phone': '02-8911-5061', 'description': 'Disaster Response', 'is_24_7': True},
    ]
    
    for contact_data in contacts:
        contact = HelpContact(
            category_id=created_categories[contact_data['category']].id,
            name=contact_data['name'],
            phone=contact_data['phone'],
            description=contact_data.get('description'),
            is_24_7=contact_data.get('is_24_7', False),
            is_verified=True
        )
        db.session.add(contact)
    
    db.session.commit()
    print(f"[OK] Added {len(contacts)} emergency contacts")


if __name__ == '__main__':
    init_database()
