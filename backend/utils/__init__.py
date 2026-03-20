"""
SafeMap-PH Utils Package
Helper functions and decorators
"""

from functools import wraps
from flask import request, jsonify, g
import jwt
from datetime import datetime, timedelta

from models import User
from config import Config


def create_token(user_id, token_type='access'):
    """Create JWT token"""
    if token_type == 'access':
        exp = datetime.utcnow() + timedelta(hours=24)
    else:  # refresh
        exp = datetime.utcnow() + timedelta(days=30)
    
    payload = {
        'user_id': user_id,
        'type': token_type,
        'exp': exp,
        'iat': datetime.utcnow()
    }
    
    token = jwt.encode(payload, Config.JWT_SECRET_KEY, algorithm='HS256')
    return token


def decode_token(token):
    """Decode and verify JWT token"""
    try:
        payload = jwt.decode(token, Config.JWT_SECRET_KEY, algorithms=['HS256'])
        return payload
    except jwt.ExpiredSignatureError:
        return None
    except jwt.InvalidTokenError:
        return None


def require_auth(f):
    """Decorator to require authentication"""
    @wraps(f)
    def decorated_function(*args, **kwargs):
        token = None
        
        # Get token from header
        auth_header = request.headers.get('Authorization')
        if auth_header:
            try:
                token = auth_header.split(' ')[1]
            except IndexError:
                return jsonify({'error': 'Invalid token format'}), 401
        
        if not token:
            return jsonify({'error': 'Token is missing'}), 401
        
        # Decode token
        payload = decode_token(token)
        if not payload:
            return jsonify({'error': 'Token is invalid or expired'}), 401
        
        # Get user
        user = User.query.get(payload['user_id'])
        if not user:
            return jsonify({'error': 'User not found'}), 401
        
        if not user.is_active:
            return jsonify({'error': 'Account is disabled'}), 403
        
        # Set current user in flask g
        g.current_user = user
        
        return f(*args, **kwargs)
    
    return decorated_function


def get_current_user():
    """Get current authenticated user"""
    return getattr(g, 'current_user', None)


def validate_json(**kwargs):
    """Decorator to validate JSON request body"""
    def decorator(f):
        @wraps(f)
        def decorated_function(*args, **kwargs):
            if not request.is_json:
                return jsonify({'error': 'Request must be JSON'}), 400
            
            data = request.get_json()
            if not data:
                return jsonify({'error': 'Request body is empty'}), 400
            
            # Check required fields
            required_fields = kwargs.get('required_fields', [])
            missing_fields = [field for field in required_fields if field not in data]
            
            if missing_fields:
                return jsonify({
                    'error': 'Missing required fields',
                    'missing': missing_fields
                }), 400
            
            return f(*args, **kwargs)
        
        return decorated_function
    
    return decorator


def paginate_query(query, page=1, per_page=20):
    """Paginate a SQLAlchemy query"""
    # Limit per_page to max value
    max_per_page = Config.MAX_ITEMS_PER_PAGE
    if per_page > max_per_page:
        per_page = max_per_page
    
    return query.paginate(page=page, per_page=per_page, error_out=False)


def success_response(data=None, message=None, status_code=200):
    """Create a success response"""
    response = {}
    if message:
        response['message'] = message
    if data:
        response.update(data)
    
    return jsonify(response), status_code


def error_response(message, status_code=400, errors=None):
    """Create an error response"""
    response = {'error': message}
    if errors:
        response['errors'] = errors
    
    return jsonify(response), status_code
