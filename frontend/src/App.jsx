import { useState } from 'react'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import { Shield, AlertTriangle, Phone, FileText, MessageCircle, Menu, X, User, LogIn, MapPin } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'

// Mock data for demonstration
const MOCK_REPORTS = [
  { id: 1, title: 'Theft Incident', category: 'theft', severity: 'high', lat: 14.607, lng: 121.0, status: 'approved_awareness' },
  { id: 2, title: 'Suspicious Activity', category: 'suspicious', severity: 'medium', lat: 14.59, lng: 120.98, status: 'verified_pnp' },
  { id: 3, title: 'Accident', category: 'accident', severity: 'low', lat: 14.61, lng: 120.99, status: 'approved_awareness' },
]

const EMERGENCY_CONTACTS = [
  { name: 'PNP Emergency', phone: '117', category: 'pnp' },
  { name: 'VAWC Hotline', phone: '1388', category: 'vawc' },
  { name: 'DSWD', phone: '02-8931-8101', category: 'dswd' },
  { name: 'Fire/BFP', phone: '117', category: 'fire' },
  { name: 'Medical/Red Cross', phone: '143', category: 'medical' },
]

function App() {
  const [currentView, setCurrentView] = useState('map')
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isChatOpen, setIsChatOpen] = useState(false)
  const [chatMessages, setChatMessages] = useState([{ text: 'Hello! How can I help you today?', sender: 'bot' }])
  const [chatInput, setChatInput] = useState('')

  const handleSendMessage = () => {
    if (!chatInput.trim()) return
    
    setChatMessages([...chatMessages, { text: chatInput, sender: 'user' }])
    setChatInput('')
    
    // Simulate bot response
    setTimeout(() => {
      setChatMessages(prev => [...prev, { 
        text: 'I can help you with reporting incidents, viewing the map, or finding emergency contacts. What would you like to do?', 
        sender: 'bot' 
      }])
    }, 500)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b shadow-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Shield className="h-8 w-8 text-green-600" />
            <span className="text-xl font-bold text-gray-900">SafeMap PH</span>
          </div>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-4">
            <Button variant="ghost" onClick={() => setCurrentView('map')}>
              <MapPin className="mr-2 h-4 w-4" /> Map
            </Button>
            <Button variant="ghost" onClick={() => setCurrentView('report')}>
              <FileText className="mr-2 h-4 w-4" /> Report
            </Button>
            <Button variant="ghost" onClick={() => setCurrentView('help')}>
              <Phone className="mr-2 h-4 w-4" /> Get Help
            </Button>
            <Button variant="ghost" onClick={() => setIsChatOpen(true)}>
              <MessageCircle className="mr-2 h-4 w-4" /> Chat
            </Button>
            <Button variant="outline">
              <LogIn className="mr-2 h-4 w-4" /> Login
            </Button>
          </nav>

          {/* Mobile Menu Button */}
          <Button variant="ghost" className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X /> : <Menu />}
          </Button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden border-t p-4 bg-white space-y-2">
            <Button variant="ghost" className="w-full justify-start" onClick={() => { setCurrentView('map'); setIsMenuOpen(false) }}>
              <MapPin className="mr-2 h-4 w-4" /> Map
            </Button>
            <Button variant="ghost" className="w-full justify-start" onClick={() => { setCurrentView('report'); setIsMenuOpen(false) }}>
              <FileText className="mr-2 h-4 w-4" /> Report Incident
            </Button>
            <Button variant="ghost" className="w-full justify-start" onClick={() => { setCurrentView('help'); setIsMenuOpen(false) }}>
              <Phone className="mr-2 h-4 w-4" /> Get Help
            </Button>
            <Button variant="ghost" className="w-full justify-start" onClick={() => { setIsChatOpen(true); setIsMenuOpen(false) }}>
              <MessageCircle className="mr-2 h-4 w-4" /> AI Chat
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <LogIn className="mr-2 h-4 w-4" /> Login
            </Button>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6">
        {currentView === 'map' && <MapView />}
        {currentView === 'report' && <ReportView />}
        {currentView === 'help' && <HelpView />}
      </main>

      {/* Chat Widget */}
      {isChatOpen && (
        <div className="fixed bottom-4 right-4 w-80 h-96 bg-white rounded-lg shadow-xl border flex flex-col z-50">
          <div className="p-4 border-b flex items-center justify-between bg-green-600 rounded-t-lg">
            <h3 className="font-semibold text-white">SafeMap Assistant</h3>
            <Button variant="ghost" size="sm" className="text-white hover:bg-green-700" onClick={() => setIsChatOpen(false)}>
              <X className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {chatMessages.map((msg, i) => (
              <div key={i} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] rounded-lg p-3 ${msg.sender === 'user' ? 'bg-green-600 text-white' : 'bg-gray-100'}`}>
                  {msg.text}
                </div>
              </div>
            ))}
          </div>
          <div className="p-3 border-t flex gap-2">
            <Input 
              placeholder="Ask me anything..." 
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            />
            <Button onClick={handleSendMessage}>Send</Button>
          </div>
        </div>
      )}
    </div>
  )
}

// Map View Component
function MapView() {
  const [selectedCategory, setSelectedCategory] = useState('all')
  
  const categories = [
    { value: 'all', label: 'All' },
    { value: 'theft', label: 'Theft' },
    { value: 'assault', label: 'Assault' },
    { value: 'accident', label: 'Accident' },
    { value: 'suspicious', label: 'Suspicious' },
  ]

  return (
    <div className="space-y-4">
      {/* Filters */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Map Filters</CardTitle>
          <CardDescription>Filter incidents by category</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {categories.map(cat => (
              <Button 
                key={cat.value}
                variant={selectedCategory === cat.value ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedCategory(cat.value)}
              >
                {cat.label}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Map */}
      <Card>
        <CardContent className="p-0">
          <div className="h-[600px] rounded-lg overflow-hidden">
            <MapContainer center={[14.5995, 120.9842]} zoom={12} className="h-full w-full">
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              {MOCK_REPORTS.map(report => (
                <Marker key={report.id} position={[report.lat, report.lng]}>
                  <Popup>
                    <div className="p-2">
                      <h3 className="font-semibold">{report.title}</h3>
                      <p className="text-sm text-gray-600 capitalize">{report.category}</p>
                      <span className={`inline-block px-2 py-1 text-xs rounded mt-2 ${
                        report.severity === 'high' ? 'bg-red-100 text-red-800' :
                        report.severity === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-blue-100 text-blue-800'
                      }`}>
                        {report.severity}
                      </span>
                    </div>
                  </Popup>
                </Marker>
              ))}
            </MapContainer>
          </div>
        </CardContent>
      </Card>

      {/* Legend */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm">Legend</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-red-500"></div>
              <span>Critical/High</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-orange-500"></div>
              <span>Medium</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-blue-500"></div>
              <span>Low</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-green-500"></div>
              <span>PNP Verified</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

// Report View Component
function ReportView() {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    severity: 'medium',
    lat: '',
    lng: '',
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    alert('Report submitted! Reference code: SMPH-' + Math.random().toString(36).substr(2, 6).toUpperCase())
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-yellow-500" />
            Submit Incident Report
          </CardTitle>
          <CardDescription>
            Your report is anonymous. Fill in all required fields.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Title *</label>
              <Input 
                required
                placeholder="Brief title of the incident"
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Category *</label>
              <select 
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                required
                value={formData.category}
                onChange={(e) => setFormData({...formData, category: e.target.value})}
              >
                <option value="">Select category</option>
                <option value="theft">Theft/Robbery</option>
                <option value="assault">Assault</option>
                <option value="fraud">Fraud</option>
                <option value="harassment">Harassment</option>
                <option value="accident">Accident</option>
                <option value="suspicious">Suspicious Activity</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Description *</label>
              <textarea 
                className="flex min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                required
                placeholder="Describe what happened..."
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Latitude *</label>
                <Input 
                  required
                  type="number"
                  step="any"
                  placeholder="e.g., 14.5995"
                  value={formData.lat}
                  onChange={(e) => setFormData({...formData, lat: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Longitude *</label>
                <Input 
                  required
                  type="number"
                  step="any"
                  placeholder="e.g., 120.9842"
                  value={formData.lng}
                  onChange={(e) => setFormData({...formData, lng: e.target.value})}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Severity</label>
              <select 
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                value={formData.severity}
                onChange={(e) => setFormData({...formData, severity: e.target.value})}
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="critical">Critical</option>
              </select>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
              <p className="text-sm text-yellow-800">
                <strong>Note:</strong> Your report will be reviewed by admin staff. 
                Do not confront suspects directly. In emergencies, dial 911.
              </p>
            </div>

            <Button type="submit" className="w-full">Submit Report</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

// Help View Component
function HelpView() {
  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <Card className="border-red-200 bg-red-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-red-700">
            <Phone className="h-5 w-5" />
            Emergency Hotlines
          </CardTitle>
          <CardDescription className="text-red-600">
            Call these numbers for immediate assistance
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            {EMERGENCY_CONTACTS.map((contact, i) => (
              <div key={i} className="flex items-center justify-between p-4 bg-white rounded-lg border">
                <div>
                  <h4 className="font-semibold">{contact.name}</h4>
                  <p className="text-sm text-gray-500 capitalize">{contact.category}</p>
                </div>
                <Button variant="destructive" size="lg">
                  {contact.phone}
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Get Help Now</CardTitle>
          <CardDescription>Additional resources and support</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Button variant="outline" className="h-auto py-4 flex-col gap-2">
              <User className="h-6 w-6" />
              <span>VAWC Desk</span>
            </Button>
            <Button variant="outline" className="h-auto py-4 flex-col gap-2">
              <Shield className="h-6 w-6" />
              <span>PNP Station</span>
            </Button>
            <Button variant="outline" className="h-auto py-4 flex-col gap-2">
              <Phone className="h-6 w-6" />
              <span>DSWD Office</span>
            </Button>
            <Button variant="outline" className="h-auto py-4 flex-col gap-2">
              <AlertTriangle className="h-6 w-6" />
              <span>Crisis Center</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default App
