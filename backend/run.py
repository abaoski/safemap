"""
SafeMap-PH Backend Runner
Run the Flask development server
"""

import os
from app import create_app
from config import config_by_name

# Get environment from env variable or default to development
env = os.environ.get('FLASK_ENV', 'development')
config_name = config_by_name.get(env, 'development')

# Create Flask app
app = create_app(config_name)

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    debug = env == 'development'
    
    print("SafeMap-PH Backend")
    print(f"Server running on: http://localhost:{port}")
    print(f"Environment: {env}")
    print(f"Debug mode: {'ON' if debug else 'OFF'}")
    print(f"API Endpoint: http://localhost:{port}/api")
    print(f"Health Check: http://localhost:{port}/health")
    print("-" * 40)
    
    app.run(host='0.0.0.0', port=port, debug=debug)
