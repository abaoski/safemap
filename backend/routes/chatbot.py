"""
SafeMap-PH Chatbot API Routes
Handle AI chatbot interactions - Updated for workflow
"""

from flask import request, jsonify
from routes import api_bp
from models import HelpContact
from utils import require_auth, get_current_user

@api_bp.route('/chatbot/query', methods=['POST'])
def chatbot_query():
    """Process chatbot query"""
    data = request.get_json()
    message = data.get('message', '')
    context = data.get('context', {})
    
    if not message:
        return jsonify({'error': 'Message is required'}), 400
    
    # Process the message and generate a response
    response = process_message(message.lower(), context)
    
    return jsonify({
        'response': response,
        'timestamp': None
    }), 200


@api_bp.route('/chatbot/suggestions', methods=['GET'])
def get_suggestions():
    """Get suggested questions/actions based on workflow"""
    suggestions = [
        {
            'id': 'how_to_report',
            'text': 'How do I submit a report?',
            'icon': 'clipboard'
        },
        {
            'id': 'hotspot_colors',
            'text': 'What do hotspot colors mean?',
            'icon': 'palette'
        },
        {
            'id': 'map_filters',
            'text': 'How do I use map filters?',
            'icon': 'filter'
        },
        {
            'id': 'pnp_contact',
            'text': 'How do I contact PNP?',
            'icon': 'phone'
        },
        {
            'id': 'vawc_contact',
            'text': 'Where can I find VAWC hotline?',
            'icon': 'heart'
        },
        {
            'id': 'emergency_help',
            'text': 'I need emergency help',
            'icon': 'alert'
        },
        {
            'id': 'check_reference',
            'text': 'Check my report status',
            'icon': 'search'
        },
        {
            'id': 'safety_tips',
            'text': 'Safety tips',
            'icon': 'shield'
        }
    ]
    
    return jsonify({'suggestions': suggestions}), 200


@api_bp.route('/chatbot/history', methods=['GET'])
@require_auth
def get_chat_history():
    """Get chatbot conversation history"""
    current_user = get_current_user()
    # In production, fetch from database
    history = []
    return jsonify({'history': history}), 200


@api_bp.route('/chatbot/history', methods=['DELETE'])
@require_auth
def clear_chat_history():
    """Clear chatbot conversation history"""
    current_user = get_current_user()
    return jsonify({'message': 'Chat history cleared'}), 200


def process_message(message, context):
    """Process user message and generate response based on workflow"""
    
    # ==================== MAP & FILTERS ====================
    if any(word in message for word in ['filter', 'filters', 'filtering', 'use map']):
        return {
            'text': """📍 **Using Map Filters**

To filter the hotspot map:
1. Click the 'Filter' button on the map controls
2. Select incident types you want to see:
   - Theft/Robbery (🔴 Red)
   - Assault (🟠 Orange)
   - Fraud (🔵 Blue)
   - Harassment (🟣 Purple)
   - Accidents (🟡 Yellow)
3. Toggle date range to see recent incidents
4. You can combine multiple filters at once

Would you like me to show you how to submit a report?""",
            'type': 'info',
            'action': 'show_filters'
        }
    
    # ==================== HOTSPOT COLORS ====================
    if any(word in message for word in ['color', 'colors', 'hotspot', 'meaning', 'legend']):
        return {
            'text': """🎨 **Hotspot Color Legend**

Here's what the colors mean on the map:

🔴 **RED (Critical/High)** - Serious crimes, verified incidents
🟠 **ORANGE (High)** - Assault, violent incidents  
🟡 **YELLOW (Medium)** - Accidents, minor incidents
🔵 **BLUE (Low)** - Fraud, non-violent crimes
🟣 **PURPLE** - Harassment cases
⚪ **WHITE/GRAY** - Pending review (only visible to admins)

**Verified vs Unverified:**
- ✅ Verified (PNP Confirmed) - Official records
- ⭕ Unverified (Pending) - Under review

Would you like more information about any specific type?""",
            'type': 'info',
            'action': 'show_legend'
        }
    
    # ==================== REPORTING PROCESS ====================
    if any(word in message for word in ['report', 'reporting', 'submit', 'file report', 'how to report']):
        return {
            'text': """📝 **How to Submit a Report**

1. **Start**: Click 'Report Incident' on the main menu
2. **Fill Details**: 
   - Incident type (theft, assault, fraud, etc.)
   - What happened (description)
   - When (date/time)
   - Where (location - click on map or enter address)
3. **Submit**: Click submit - you'll get a reference code

**Important:**
- Reports are ANONYMOUS by default
- All submissions are reviewed by admin staff
- You'll receive a reference code (e.g., SMPH-A1B2C3)
- Use this code to check your report status

**Safety Notice:** Do not confront suspects directly. In emergencies, dial 911.

Would you like to submit a report now?""",
            'type': 'action',
            'action': 'open_report_form'
        }
    
    # ==================== EMERGENCY CONTACTS ====================
    
    # PNP
    if any(word in message for word in ['pnp', 'police', 'crime']):
        pnp_info = get_contact_info('pnp')
        return {
            'text': f"""🚔 **Philippine National Police (PNP)**

{pnp_info}

**For Emergencies:** Dial 117 or 911
**Text PNP:** 0917-847-5757
**Website:** pnp.gov.ph

Would you like me to show other emergency contacts?""",
            'type': 'info',
            'action': 'show_contacts'
        }
    
    # WCPD / VAWC
    if any(word in message for word in ['wcpd', 'vawc', 'women', 'children', 'abuse']):
        vawc_info = get_contact_info('vawc')
        return {
            'text': f"""👩‍👩‍👧 **Women and Children Protection**

**VAWC Hotline:** 1388 (24/7)
{vawc_info}

**For Immediate Help:**
- VAWC Desk at local police stations
- DSWD Social Workers
- Women Crisis Centers

**Your Safety Matters:** All calls and reports are confidential.

Would you like more information?""",
            'type': 'info',
            'action': 'show_contacts'
        }
    
    
    # DSWD
    if any(word in message for word in ['dswd', 'welfare', 'social']):
        dswd_info = get_contact_info('dswd')
        return {
            'text': f"""🏛️ **Department of Social Welfare (DSWD)**

**Hotline:** 02-8931-8101
{dswd_info}

**Services:**
- Crisis intervention
- Temporary shelter
- Financial assistance
- Social case management

Would you like to know about other emergency contacts?""",
            'type': 'info',
            'action': 'show_contacts'
        }
    
    # Fire
    if any(word in message for word in ['fire', 'burning']):
        return {
            'text': """🔥 **Fire Emergency**

**BFP Emergency:** Dial 117 or 911

**What to do in case of fire:**
1. Stay calm
2. Alert others
3. Call emergency hotlines
4. Evacuate if safe
5. Don't use elevators
6. Close doors behind you

Stay safe! Would you like more help?""",
            'type': 'emergency',
            'action': 'show_contacts'
        }
    
    # Medical
    if any(word in message for word in ['medical', 'hospital', 'doctor', 'injured']):
        return {
            'text': """🏥 **Medical Emergency**

**Call:** Dial 117 or 911

**Red Cross:** 143
**Nearest Hospital:** Check the 'Get Help Now' section on the map

**If someone is injured:**
1. Call for help
2. Don't move injured person unless in danger
3. Apply first aid if trained
4. Stay with them until help arrives

Would you like me to show hospitals on the map?""",
            'type': 'emergency',
            'action': 'show_hospitals'
        }
    
    # ==================== EMERGENCY ====================
    if any(word in message for word in ['emergency', 'help me', 'danger', 'urgent', 'now']):
        return {
            'text': """🚨 **IMMEDIATE EMERGENCY HELP**

**DIAL 911 or 117** (24/7 - All emergencies)

**What's your emergency?**
- 🔴 Crime in progress → Police
- 🔥 Fire → Fire Department
- 🚑 Medical → Ambulance
- 👨‍👩‍👧 Child/Women abuse → VAWC 1388

**Stay Safe:**
- Move to a safe location if possible
- Don't confront attackers
- Note the location/description
- Call for help immediately

Shall I show emergency contacts on the map?""",
            'type': 'emergency',
            'action': 'show_emergency'
        }
    
    # ==================== CHECK REFERENCE CODE ====================
    if any(word in message for word in ['reference', 'code', 'check status', 'track']):
        return {
            'text': """🔍 **Check Report Status**

To check your report status:

1. Go to 'Track Report' in the menu
2. Enter your reference code (e.g., SMPH-A1B2C3)
3. View current status

**Report Statuses:**
- ⏳ Pending Review - Under admin review
- ✅ Approved - Visible on public map
- ✅ Verified - PNP confirmed
- ❌ Dismissed - Spam/duplicate

Would you like to check a specific report?""",
            'type': 'info',
            'action': 'check_status'
        }
    
    # ==================== SAFETY TIPS ====================
    if any(word in message for word in ['safety', 'tips', 'advice', 'protect']):
        return {
            'text': """🛡️ **Safety Tips**

**General Safety:**
- Stay aware of your surroundings
- Avoid isolated areas at night
- Keep valuables hidden
- Use well-lit, busy routes
- Trust your instincts

**Online Safety:**
- Don't share personal info
- Verify before trusting
- Report suspicious activity

**In Case of Emergency:**
- Call 911 immediately
- Note your location
- Stay calm

Would you like specific tips for any situation?""",
            'type': 'info',
            'action': 'show_safety'
        }
    
    # ==================== GREETINGS ====================
    if any(word in message for word in ['hello', 'hi', 'hey', 'good', 'start', 'help']):
        return {
            'text': """👋 Hello! I'm SafeMap Assistant

I can help you with:

📍 **Map Help**
- How to use filters
- What hotspot colors mean

📝 **Reporting**
- How to submit a report
- Check report status

📞 **Emergency Contacts**
- PNP, VAWC, DSWD hotlines
- Medical & Fire emergencies

🛡️ **Safety Tips**
- General safety advice
- Emergency procedures

What would you like to know about?""",
            'type': 'greeting',
            'suggestions': ['How to submit a report', 'Emergency contacts', 'Safety tips']
        }
    
    # ==================== THANKS ====================
    if any(word in message for word in ['thank', 'thanks', 'appreciate']):
        return {
            'text': "You're welcome! Stay safe out there. Remember, if you see something, say something. 💪",
            'type': 'closing'
        }
    
    # ==================== DEFAULT ====================
    return {
        'text': """I'm not sure I understand that. Here are things I can help with:

📝 **Reporting** - How to submit incidents
🗺️ **Map** - Filters and hotspot colors
📞 **Contacts** - PNP, VAWC, DSWD, emergency
🛡️ **Safety** - Tips and advice

Just ask me anything! Or type 'help' to see all options.""",
        'type': 'clarification'
    }


def get_contact_info(category):
    """Get contact information for a category"""
    try:
        contacts = HelpContact.get_by_category(category)
        if contacts:
            contact = contacts[0]
            return f"**{contact.name}**: {contact.phone}"
    except:
        pass
    return "Hotline available"
