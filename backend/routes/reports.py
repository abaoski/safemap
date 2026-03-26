"""
SafeMap-PH Reports API Routes
Handle safety report workflow - Public submission, Admin review
"""

from flask import request, jsonify
from routes import api_bp
from models import Report
from utils import validate_json, paginate_query, require_auth, get_current_user

# Required fields for report submission
REPORT_REQUIRED_FIELDS = ['title', 'description', 'latitude', 'longitude', 'category']
REPORT_OPTIONAL_FIELDS = ['severity', 'barangay', 'address', 'reporter_name', 'reporter_contact', 'image_url']


@api_bp.route('/reports/public', methods=['GET'])
def get_public_reports():
    """Get approved reports for public heatmap"""
    category = request.args.get('category')
    city = request.args.get('city')
    
    query = Report.query.filter(
        Report.status.in_(['approved_awareness', 'verified_pnp'])
    )
    
    if category:
        query = query.filter(Report.category == category)
    if city:
        query = query.filter(Report.city.ilike(f'%{city}%'))
    
    reports = query.order_by(Report.created_at.desc()).all()
    
    return jsonify({
        'reports': [r.to_public_dict() for r in reports if r.to_public_dict()],
        'total': len(reports)
    }), 200


@api_bp.route('/reports/pending', methods=['GET'])
@require_auth
def get_pending_reports():
    """Get pending reports for admin review"""
    page = request.args.get('page', 1, type=int)
    per_page = request.args.get('per_page', 20, type=int)
    
    query = Report.query.filter_by(status='pending_review')
    
    pagination = paginate_query(query, page, per_page)
    
    return jsonify({
        'reports': [r.to_dict(include_private=True) for r in pagination.items],
        'total': pagination.total,
        'page': pagination.page,
        'pages': pagination.pages
    }), 200


@api_bp.route('/reports', methods=['GET'])
@require_auth
def get_all_reports():
    """Get all reports (admin view)"""
    page = request.args.get('page', 1, type=int)
    per_page = request.args.get('per_page', 20, type=int)
    status = request.args.get('status')
    category = request.args.get('category')
    city = request.args.get('city')
    
    query = Report.query
    
    # Apply filters
    if status:
        query = query.filter(Report.status == status)
    if category:
        query = query.filter(Report.category == category)
    if city:
        query = query.filter(Report.city.ilike(f'%{city}%'))
    
    pagination = paginate_query(query.order_by(Report.created_at.desc()), page, per_page)
    
    return jsonify({
        'reports': [r.to_dict(include_private=True) for r in pagination.items],
        'total': pagination.total,
        'page': pagination.page,
        'pages': pagination.pages
    }), 200


@api_bp.route('/reports/<int:report_id>', methods=['GET'])
def get_report(report_id):
    """Get a single report"""
    report = Report.query.get_or_404(report_id)
    
    # Public can only see approved reports
    if report.status not in ['approved_awareness', 'verified_pnp']:
        # Check if user is authenticated admin
        try:
            current_user = get_current_user()
            if not current_user or not current_user.is_admin:
                return jsonify({'error': 'Report not found'}), 404
        except:
            return jsonify({'error': 'Report not found'}), 404
    
    return jsonify(report.to_dict()), 200


@api_bp.route('/reports/reference/<reference_code>', methods=['GET'])
def get_report_by_reference(reference_code):
    """Get report by reference code"""
    report = Report.query.filter_by(reference_code=reference_code).first()
    
    if not report:
        return jsonify({'error': 'Report not found'}), 404
    
    return jsonify(report.to_dict(include_private=True)), 200


@api_bp.route('/reports/submit', methods=['POST'])
@validate_json(required_fields=REPORT_REQUIRED_FIELDS)
def submit_anonymous_report():
    """
    Submit an anonymous report
    Public users can submit without authentication
    """
    data = request.get_json()
    
    # Check required fields
    missing_fields = [f for f in REPORT_REQUIRED_FIELDS if f not in data or not data[f]]
    if missing_fields:
        return jsonify({
            'error': 'Missing required fields',
            'missing': missing_fields,
            'message': 'Please complete all required fields'
        }), 400
    
    # Validate category
    if data['category'] not in Report.CATEGORIES:
        return jsonify({
            'error': 'Invalid category',
            'valid_categories': Report.CATEGORIES
        }), 400
    
    # Check for personal details
    has_personal = bool(data.get('reporter_name') or data.get('reporter_contact'))
    
    # Create report
    report = Report(
        title=data['title'],
        description=data['description'],
        latitude=data['latitude'],
        longitude=data['longitude'],
        category=data['category'],
        severity=data.get('severity', 'medium'),
        city=data.get('city'),
        barangay=data.get('barangay'),
        address=data.get('address'),
        image_url=data.get('image_url'),
        reporter_name=data.get('reporter_name'),
        reporter_contact=data.get('reporter_contact'),
        has_personal_details=has_personal,
        is_anonymous=True,
        status='pending_review'  # Default: Unverified & Pending Review
    )
    
    # Generate reference code
    report.generate_reference_code()
    report.save()
    
    # Run basic safety check (placeholder - can be enhanced)
    safety_check_passed = run_safety_check(report)
    
    return jsonify({
        'message': 'Report submitted successfully',
        'reference_code': report.reference_code,
        'status': 'pending_review',
        'safety_check': 'passed' if safety_check_passed else 'needs_review',
        'safety_notice': get_safety_notice()
    }), 201


def run_safety_check(report):
    """Run basic safety checks on report"""
    # Basic checks - can be enhanced with ML/AI
    checks = []
    
    # Check for minimum description length
    checks.append(len(report.description) >= 10)
    
    # Check for valid coordinates (Philippines bounds)
    lat_valid = 4.5 <= report.latitude <= 21.0
    lng_valid = 116.0 <= report.longitude <= 127.0
    checks.append(lat_valid and lng_valid)
    
    return all(checks)


def get_safety_notice():
    """Get safety notice for users"""
    return (
        "Your report has been submitted and is pending review. "
        "Do not confront any suspects directly. "
        "In case of emergency, dial 911. "
        "Save your reference code for tracking: {code}"
    )


@api_bp.route('/reports/<int:report_id>/approve', methods=['POST'])
@require_auth
def approve_report(report_id):
    """Approve report for public awareness"""
    current_user = get_current_user()
    
    # Check admin role
    if current_user.role not in ['admin', 'moderator']:
        return jsonify({'error': 'Unauthorized - Admin access required'}), 403
    
    report = Report.query.get_or_404(report_id)
    data = request.get_json() or {}
    notes = data.get('notes', '')
    
    report.approve_for_awareness(current_user.id, notes)
    report.save()
    
    return jsonify({
        'message': 'Report approved for awareness',
        'report': report.to_dict()
    }), 200


@api_bp.route('/reports/<int:report_id>/verify', methods=['POST'])
@require_auth
def verify_report_pnp(report_id):
    """Mark report as PNP verified"""
    current_user = get_current_user()
    
    if current_user.role not in ['admin', 'moderator']:
        return jsonify({'error': 'Unauthorized - Admin access required'}), 403
    
    report = Report.query.get_or_404(report_id)
    data = request.get_json() or {}
    case_number = data.get('case_number')
    notes = data.get('notes', '')
    
    report.verify_pnp(current_user.id, case_number, notes)
    report.save()
    
    return jsonify({
        'message': 'Report verified as PNP confirmed',
        'report': report.to_dict()
    }), 200


@api_bp.route('/reports/<int:report_id>/dismiss', methods=['POST'])
@require_auth
def dismiss_report(report_id):
    """Dismiss report as spam/duplicate"""
    current_user = get_current_user()
    
    if current_user.role not in ['admin', 'moderator']:
        return jsonify({'error': 'Unauthorized - Admin access required'}), 403
    
    report = Report.query.get_or_404(report_id)
    data = request.get_json() or {}
    reason = data.get('reason', 'Dismissed by admin')
    
    report.dismiss_report(current_user.id, reason)
    report.save()
    
    return jsonify({
        'message': 'Report dismissed',
        'report': report.to_dict()
    }), 200


@api_bp.route('/reports/<int:report_id>/remove-personal', methods=['POST'])
@require_auth
def remove_personal_details(report_id):
    """Remove personal details from report"""
    current_user = get_current_user()
    
    if current_user.role not in ['admin', 'moderator']:
        return jsonify({'error': 'Unauthorized - Admin access required'}), 403
    
    report = Report.query.get_or_404(report_id)
    report.remove_personal_details()
    report.save()
    
    return jsonify({
        'message': 'Personal details removed',
        'report': report.to_dict(include_private=True)
    }), 200


@api_bp.route('/reports/stats', methods=['GET'])
@require_auth
def get_report_stats():
    """Get report statistics"""
    from sqlalchemy import func
    from models import db
    
    # Total counts by status
    by_status = db.session.query(
        Report.status,
        func.count(Report.id)
    ).group_by(Report.status).all()
    
    # By category
    by_category = db.session.query(
        Report.category,
        func.count(Report.id)
    ).group_by(Report.category).all()
    
    # By severity
    by_severity = db.session.query(
        Report.severity,
        func.count(Report.id)
    ).group_by(Report.severity).all()
    
    # Total
    total = Report.query.count()
    public_count = Report.query.filter(
        Report.status.in_(['approved_awareness', 'verified_pnp'])
    ).count()
    verified_count = Report.query.filter_by(status='verified_pnp').count()
    
    return jsonify({
        'total': total,
        'public_visible': public_count,
        'pnp_verified': verified_count,
        'pending_review': Report.query.filter_by(status='pending_review').count(),
        'by_status': dict(by_status),
        'by_category': dict(by_category),
        'by_severity': dict(by_severity)
    }), 200


@api_bp.route('/reports/heatmap', methods=['GET'])
@require_auth
def get_heatmap_data():
    """Get lat/lng/intensity for all non-dismissed reports (admin heatmap)"""
    # Severity → intensity weight mapping
    intensity_map = {
        'critical': 1.0,
        'high':     0.8,
        'medium':   0.5,
        'low':      0.3
    }

    reports = Report.query.filter(
        Report.status != 'dismissed',
        Report.latitude.isnot(None),
        Report.longitude.isnot(None)
    ).all()

    points = []
    for r in reports:
        intensity = intensity_map.get(r.severity, 0.5)
        points.append({
            'lat':       r.latitude,
            'lng':       r.longitude,
            'intensity': intensity,
            'severity':  r.severity,
            'category':  r.category,
            'status':    r.status,
        })

    return jsonify({'points': points, 'total': len(points)}), 200


@api_bp.route('/reports/categories', methods=['GET'])
def get_categories():
    """Get available report categories"""
    return jsonify({
        'categories': [
            {'value': c, 'label': c.replace('_', ' ').title()}
            for c in Report.CATEGORIES
        ]
    }), 200
