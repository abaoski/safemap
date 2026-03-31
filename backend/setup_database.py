"""
SafeMap-PH Database Setup Script
Initialize database tables using new sys_ and trans_ naming convention
"""

from app import create_app, db

def set_up_database():
    """Initialize the database with tables and default admin user"""
    
    app = create_app()
    
    with app.app_context():
        # Create all tables
        print("Creating database tables...")
        db.create_all()
        print("[OK] Tables created successfully")
        
        # Import models
        from models import SetupUser
        
        # Check if admin exists
        admin = SetupUser.query.filter_by(username='admin').first()
        if not admin:
            print("\nCreating default admin user...")
            admin = SetupUser(
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
        
        print("\n" + "="*50)
        print("Database setup complete!")
        print("="*50)
        print(f"\nDatabase: {app.config['SQLALCHEMY_DATABASE_URI']}")
        print("\nNext steps:")
        print("1. Run 'python setup_emergency_contacts.py' to seed emergency contacts")
        print("2. Run 'python setup_risk_status.py' to seed report categories")
        print("3. Run 'python run.py' to start the backend server")


if __name__ == '__main__':
    set_up_database()
