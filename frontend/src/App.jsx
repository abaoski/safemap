import { useState } from 'react'
import { Routes, Route } from 'react-router-dom'
import ReportPage from './pages/ReportPage'
import IncidentDetailsPage from './pages/IncidentDetailsPage'
import LocationDetailsPage from './pages/LocationDetailsPage'
import ReviewSubmitPage from './pages/ReviewSubmitPage'
import ReportSuccessPage from './pages/ReportSuccessPage'
import TrackReportPage from './pages/TrackReportPage'

// Import modular components
import Header from './components/Header'
import MapView from './components/MapView'
import QuickActions from './components/QuickActions'
import BottomNav from './components/BottomNav'
import ChatWidget from './components/ChatWidget'
import ReportButton from './components/ReportButton'

function App() {
  const [currentView, setCurrentView] = useState('map')
  const [showQuickActions, setShowQuickActions] = useState(true)
  
  // Quick Actions drag state
  const [qaPosition, setQaPosition] = useState({ x: 0, y: 0 })
  const [isDraggingQA, setIsDraggingQA] = useState(false)
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 })
  const [dragStartPos, setDragStartPos] = useState({ x: 0, y: 0 })

  // Chat state
  const [isChatOpen, setIsChatOpen] = useState(false)

  // Handlers
  const handleEmergencyClick = () => {
    setCurrentView('help')
  }

  const handleAIChatClick = () => {
    setIsChatOpen(true)
  }

  const handleChatOpen = () => {
    setIsChatOpen(true)
  }

  const handleHelpClick = () => {
    setCurrentView('help')
  }

  return (
    <Routes>
      <Route path="/" element={
        <div className="h-screen flex flex-col">
          {/* Header */}
          <Header />

          {/* Main Content - Map */}
          <main className="flex-1 relative">
            <MapView />

            {/* Quick Actions - Draggable */}
            <QuickActions
              showQuickActions={showQuickActions}
              setShowQuickActions={setShowQuickActions}
              qaPosition={qaPosition}
              setQaPosition={setQaPosition}
              isDraggingQA={isDraggingQA}
              setIsDraggingQA={setIsDraggingQA}
              dragOffset={dragOffset}
              setDragOffset={setDragOffset}
              dragStartPos={dragStartPos}
              setDragStartPos={setDragStartPos}
              onEmergencyClick={handleEmergencyClick}
              onAIChatClick={handleAIChatClick}
            />
          </main>

          {/* Report Button - Floating on main page only */}
          <ReportButton />

          {/* Bottom Navigation */}
          <BottomNav
            onHelpClick={handleHelpClick}
            onChatClick={handleChatOpen}
          />

          {/* Chat Widget */}
          <ChatWidget
            isOpen={isChatOpen}
            onClose={() => setIsChatOpen(false)}
          />
        </div>
      }
      />
      <Route path="/report" element={<ReportPage />} />
      <Route path="/incident-details" element={<IncidentDetailsPage />} />
      <Route path="/location-details" element={<LocationDetailsPage />} />
      <Route path="/review-submit" element={<ReviewSubmitPage />} />
      <Route path="/report-success" element={<ReportSuccessPage />} />
      <Route path="/track" element={<TrackReportPage />} />
    </Routes>
  )
}

export default App
