import { useState } from 'react'
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet'
import { X, Plus, Minus } from 'lucide-react'
import myLocationImg from '/src/assets/images/My_location.svg'
import cityCentralImg from '/src/assets/images/City_central_button.svg'
import { Button } from '@/components/ui/button'

// Import images properly for Vite
import logoImg from '/src/assets/images/Logo.svg'
import reportVectorImg from '/src/assets/images/ft_report.svg'
import searchImg from '/src/assets/images/search.svg'
import homeImg from '/src/assets/images/ft_home.svg'
import mapImg from '/src/assets/images/ft_map.svg'
import helpImg from '/src/assets/images/ft_help.svg'
import chatImg from '/src/assets/images/ft_admin-panel.svg'
import reportAnonQAImg from '/src/assets/images/QA_report.svg'
import aiAsstQAImg from '/src/assets/images/QA_AI.svg'
import emergencyQAImg from '/src/assets/images/QA_emergency.svg'

// Mock data for demonstration - General Santos City
const MOCK_REPORTS = [
  { id: 1, title: 'Theft Incident', category: 'theft', severity: 'high', lat: 6.1167, lng: 125.1667, status: 'approved_awareness' },
  { id: 2, title: 'Suspicious Activity', category: 'suspicious', severity: 'medium', lat: 6.105, lng: 125.175, status: 'verified_pnp' },
  { id: 3, title: 'Accident', category: 'accident', severity: 'low', lat: 6.125, lng: 125.16, status: 'approved_awareness' },
]

// Zoom Controls Component
function ZoomControls() {
  const map = useMap()
  
  const handleZoomIn = () => {
    map.zoomIn()
  }
  
  const handleZoomOut = () => {
    map.zoomOut()
  }
  
  const handleLocation = () => {
    map.setView([6.1167, 125.1667], 13)
  }
  
  const handleCityCentral = () => {
    map.setView([6.1167, 125.1667], 12)
  }

  return (
    <div className="absolute top-4 right-4 z-[1000] flex flex-col gap-2">
      {/* City Central */}
      <button
        className="w-12 h-12 p-3 rounded-[10px] shadow-[0px_2px_8px_0px_rgba(0,0,0,0.00)] flex items-center justify-center"
        style={{ backgroundColor: '#ffffff' }}
        onClick={handleCityCentral}
      >
        <img src={cityCentralImg} alt="City Central" className="w-6 h-6" />
      </button>
      {/* Zoom In */}
      <button
        className="w-12 h-12 p-3 rounded-[10px] shadow-[0px_2px_8px_0px_rgba(0,0,0,0.00)] flex items-center justify-center"
        style={{ backgroundColor: '#ffffff' }}
        onClick={handleZoomIn}
      >
        <Plus className="w-6 h-6 text-black" />
      </button>
      {/* Zoom Out */}
      <button
        className="w-12 h-12 p-3 rounded-[10px] shadow-[0px_2px_8px_0px_rgba(0,0,0,0.00)] flex items-center justify-center"
        style={{ backgroundColor: '#ffffff' }}
        onClick={handleZoomOut}
      >
        <Minus className="w-6 h-6 text-black" />
      </button>
      {/* My Location */}
      <button
        className="w-12 h-12 p-3 rounded-[10px] shadow-[0px_2px_8px_0px_rgba(0,0,0,0.00)] flex items-center justify-center"
        style={{ backgroundColor: '#2563eb' }}
        onClick={handleLocation}
      >
        <img src={myLocationImg} alt="My Location" className="w-6 h-6" />
      </button>
    </div>
  )
}

function App() {
  const [currentView, setCurrentView] = useState('map')
  const [showQuickActions, setShowQuickActions] = useState(true)
  // Default position directly above the Report button
  const [qaPosition, setQaPosition] = useState({ x: 0, y: 0 })
  const [isDraggingQA, setIsDraggingQA] = useState(false)
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 })
  const [dragStartPos, setDragStartPos] = useState({ x: 0, y: 0 })

  // No boundaries for dragging - can move freely

  const handleQADragStart = (e) => {
    setIsDraggingQA(true)
    const clientX = e.touches ? e.touches[0].clientX : e.clientX
    const clientY = e.touches ? e.touches[0].clientY : e.clientY
    setDragOffset({ x: clientX, y: clientY })
    setDragStartPos({ x: clientX, y: clientY })
  }

  const handleQADragMove = (e) => {
    if (!isDraggingQA) return
    const clientX = e.touches ? e.touches[0].clientX : e.clientX
    const clientY = e.touches ? e.touches[0].clientY : e.clientY
    
    const deltaX = clientX - dragOffset.x
    const deltaY = clientY - dragOffset.y
    
    // Update position - can move freely in any direction
    setQaPosition(prev => ({
      x: prev.x + deltaX,
      y: prev.y + deltaY
    }))
    setDragOffset({ x: clientX, y: clientY })
  }

  const handleQADragEnd = () => {
    setIsDraggingQA(false)
    setDragOffset({ x: 0, y: 0 })
    setDragStartPos({ x: 0, y: 0 })
  }
  const [isChatOpen, setIsChatOpen] = useState(false)
  const [chatMessages, setChatMessages] = useState([{ text: 'Hello! How can I help you today?', sender: 'bot' }])
  const [chatInput, setChatInput] = useState('')
  
  const handleSendMessage = () => {
    if (!chatInput.trim()) return
    
    setChatMessages([...chatMessages, { text: chatInput, sender: 'user' }])
    setChatInput('')
    
    setTimeout(() => {
      setChatMessages(prev => [...prev, { 
        text: 'I can help you with reporting incidents, viewing the map, or finding emergency contacts. What would you like to do?', 
        sender: 'bot' 
      }])
    }, 500)
  }

  return (
    <div className="h-screen flex flex-col">
      {/* HEADER */}
      <header className="bg-white shadow-md z-40">
        <div className="flex flex-col items-center px-4 py-3 gap-3">
          <img src={logoImg} alt="SafeMap" className="h-10 w-auto" />
          
          <div className="w-full max-w-md">
            <div className="relative">
              <img src={searchImg} alt="search" className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5" />
              <input 
                type="text" 
                placeholder="Search safe zones or locations..." 
                className="w-full h-10 pl-10 pr-4 bg-gray-100 rounded-full outline-none"
              />
            </div>
          </div>
        </div>
      </header>

      {/* MAIN CONTENT - Map */}
      <main className="flex-1 relative">
        <MapContainer 
          center={[6.1167, 125.1667]} 
          zoom={12}
          className="h-full w-full"
          zoomControl={false}
          maxBounds={[[5.9, 124.9], [6.3, 125.4]]}
          maxBoundsViscosity={1.0}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <ZoomControls />
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

        {/* Risk Density Legend */}
        <div className="absolute top-4 left-4 z-[1000] bg-white/90 rounded-lg shadow-lg p-3">
          <div className="text-xs font-bold text-gray-500 mb-2">RISK DENSITY</div>
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-red-500 rounded-full" />
              <span className="text-xs">High Risk</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-yellow-500 rounded-full" />
              <span className="text-xs">Medium</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-500 rounded-full" />
              <span className="text-xs">Low Risk</span>
            </div>
          </div>
        </div>

        {/* Show Quick Actions button when hidden */}
        {!showQuickActions && (
          <button
            className="fixed z-[1001] flex flex-col items-center gap-1 bg-white px-4 py-2 rounded-full shadow-lg"
            style={{ left: '50%', bottom: '90px', transform: 'translateX(-50%)' }}
            onClick={() => { setShowQuickActions(true); setQaPosition({ x: 0, y: 0 }); }}
          >
            <span className="text-xs text-gray-600 font-medium">Show Quick Actions</span>
          </button>
        )}

        {/* Quick Actions - Draggable */}
        {showQuickActions && (
        <div 
          className="fixed z-[1000] w-[90%] max-w-sm touch-none cursor-grab active:cursor-grabbing quick-actions-mobile"
          tabIndex={-1}
          onKeyDown={(e) => e.preventDefault()}
          style={{ 
            left: `calc(40% + ${qaPosition.x}px)`, 
            bottom: `calc(90px + ${-qaPosition.y}px)`
          }}
          onMouseDown={handleQADragStart}
          onMouseMove={handleQADragMove}
          onMouseUp={handleQADragEnd}
          onMouseLeave={handleQADragEnd}
          onTouchStart={handleQADragStart}
          onTouchMove={handleQADragMove}
          onTouchEnd={handleQADragEnd}
        >
          <div className="bg-white rounded-[20px] shadow-[0px_-4px_20px_0px_rgba(0,0,0,0.08)] overflow-hidden">
            {/* Drag Handle */}
            <div className="w-10 h-1 mx-auto mt-4 bg-gray-300 rounded-sm cursor-pointer" onClick={() => setShowQuickActions(false)} tabIndex={-1} onKeyDown={(e) => e.preventDefault()} />
            <div className="px-5 pt-2 pb-3">
              <div className="flex justify-between items-center mb-3">
                <div className="text-xl font-bold text-zinc-800 font-['DM_Sans'] tracking-tight">Quick Actions</div>
                <div className="inline-flex items-center gap-1.5">
                  <span className="text-blue-900 text-xs font-semibold font-['DM_Sans'] tracking-tight">Live Updates</span>
                  <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                </div>
              </div>
              <div className="flex justify-around">
                {/* Report Anon */}
                <button className="flex flex-col items-center gap-2" onClick={() => setCurrentView('report')}>
                  <div className="w-24 h-24 px-2.5 py-3 bg-white rounded-2xl flex flex-col justify-start items-center gap-2.5">
                    <div className="w-10 h-10 p-2 bg-blue-50 rounded-[20px] flex items-center justify-center">
                      <img src={reportAnonQAImg} alt="Report" className="w-8 h-8" />
                    </div>
                    <span className="text-neutral-600 text-xs font-semibold font-['DM_Sans'] tracking-tight">Report Anon</span>
                  </div>
                </button>
                {/* Emergency */}
                <button className="flex flex-col items-center gap-2" onClick={() => setCurrentView('help')}>
                  <div className="w-24 h-24 px-3.5 py-3 bg-white rounded-2xl flex flex-col justify-start items-center gap-2.5">
                    <div className="w-10 h-10 p-2 bg-red-100 rounded-[20px] flex items-center justify-center">
                      <img src={emergencyQAImg} alt="Emergency" className="w-8 h-8" />
                    </div>
                    <span className="text-red-500 text-xs font-semibold font-['DM_Sans'] tracking-tight">Emergency</span>
                  </div>
                </button>
                {/* AI Assistant */}
                <button className="flex flex-col items-center gap-2" onClick={() => setIsChatOpen(true)}>
                  <div className="w-24 h-24 px-3 py-3 bg-white rounded-2xl flex flex-col justify-start items-center gap-2.5">
                    <div className="w-10 h-10 p-2 bg-blue-50 rounded-[20px] flex items-center justify-center">
                      <img src={aiAsstQAImg} alt="AI" className="w-8 h-8" />
                    </div>
                    <span className="text-neutral-600 text-xs font-semibold font-['DM_Sans'] tracking-tight">AI Assistant</span>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>
        )}

      </main>

      {/* Report Button - Always on top, outside nav */}
      <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-[1001] flex flex-col items-center">
        <button 
          onClick={() => setCurrentView('report')}
          className="flex flex-col items-center gap-1"
        >
          <div className="h-12 p-3 bg-blue-950 rounded-[20px] shadow-[0px_4px_16px_0px_rgba(26,42,108,0.40)] outline outline-[3px] outline-white flex items-center justify-center">
            <img src={reportVectorImg} alt="Report" className="w-6 h-6" />
          </div>
          <span className="text-xs text-blue-950 font-medium bg-white px-2 rounded">Report</span>
        </button>
      </div>

      {/* BOTTOM NAVIGATION */}
      <nav className="bg-white shadow-[0_-4px_20px_0px_rgba(0,0,0,0.08)] z-50">
        <div className="flex items-center justify-around h-16">
          <button 
            className={`flex flex-col items-center gap-1 ${currentView === 'map' ? 'text-blue-950' : 'text-gray-400'}`}
            onClick={() => setCurrentView('map')}
          >
            <img src={homeImg} alt="Home" className="w-6 h-6" />
            <div className="text-xs">Home</div>
          </button>

          <button 
            className="flex flex-col items-center gap-1 text-gray-400"
            onClick={() => setCurrentView('map')}
          >
            <img src={mapImg} alt="Map" className="w-6 h-6" />
            <div className="text-xs">Map</div>
          </button>

          {/* Spacer for Report button */}
          <div className="w-14" />

          <button 
            className="flex flex-col items-center gap-1 text-gray-400"
            onClick={() => setCurrentView('help')}
          >
            <img src={helpImg} alt="Help" className="w-6 h-6" />
            <div className="text-xs">Help</div>
          </button>

          <button 
            className="flex flex-col items-center gap-1 text-gray-400"
            onClick={() => setIsChatOpen(true)}
          >
            <img src={chatImg} alt="Admin" className="w-6 h-6 text-gray-400" />
            <div className="text-xs text-gray-400">Admin</div>
          </button>
        </div>
      </nav>

      {/* Chat Widget */}
      {isChatOpen && (
        <div className="fixed bottom-24 right-4 w-80 h-96 bg-white rounded-lg shadow-xl border flex flex-col z-[1001]">
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
          <div className="p-4 border-t">
            <div className="flex gap-2">
              <input 
                type="text" 
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="Type a message..." 
                className="flex-1 border rounded-full px-4 py-2 outline-none focus:border-green-500"
              />
              <Button onClick={handleSendMessage} className="rounded-full px-4">
                Send
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default App
