import { useState } from 'react'

function RiskLegend({ onFilterChange, activeFilter }) {
  const [isExpanded, setIsExpanded] = useState(true)
  
  const toggleFilter = (type) => {
    if (activeFilter === type) {
      onFilterChange(null) // Deselect to show all
    } else {
      onFilterChange(type) // Select to filter
    }
  }

  return (
    <div className="absolute top-4 left-4 z-1000 bg-white/90 rounded-lg shadow-lg">
      <button 
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full px-3 py-2 flex items-center justify-between hover:bg-gray-50 rounded-lg"
      >
        <span className="text-xs font-bold text-gray-500">Legend</span>
        <span className="text-gray-400 text-xs font-bold">{isExpanded ? '−' : '+'}</span>
      </button>
      {isExpanded && (
        <div className="px-3 pb-3 flex flex-col gap-1">
        {/* Emergency Services */}
        <div className="text-xs font-semibold text-gray-400 mb-1 mt-1">Emergency Services</div>
        <button 
          onClick={() => toggleFilter('hospital')}
          className={`flex items-center gap-2 px-1 py-0.5 rounded ${activeFilter === 'hospital' ? 'bg-green-100' : 'hover:bg-gray-100'}`}
        >
          <div className="w-3 h-3 bg-green-600 rounded-full" />
          <span className="text-xs">Hospital</span>
        </button>
        <button 
          onClick={() => toggleFilter('police')}
          className={`flex items-center gap-2 px-1 py-0.5 rounded ${activeFilter === 'police' ? 'bg-blue-100' : 'hover:bg-gray-100'}`}
        >
          <div className="w-3 h-3 bg-blue-900 rounded-full" />
          <span className="text-xs">Police</span>
        </button>
        <button 
          onClick={() => toggleFilter('fire')}
          className={`flex items-center gap-2 px-1 py-0.5 rounded ${activeFilter === 'fire' ? 'bg-amber-100' : 'hover:bg-gray-100'}`}
        >
          <div className="w-3 h-3 bg-amber-500 rounded-full" />
          <span className="text-xs">Fire</span>
        </button>
        <button 
          onClick={() => toggleFilter('rescue')}
          className={`flex items-center gap-2 px-1 py-0.5 rounded ${activeFilter === 'rescue' ? 'bg-purple-100' : 'hover:bg-gray-100'}`}
        >
          <div className="w-3 h-3 bg-purple-600 rounded-full" />
          <span className="text-xs">Rescue</span>
        </button>
        
        {/* Risk Density */}
        <div className="text-xs font-semibold text-gray-400 mb-1 mt-2">Risk Density</div>
        <button 
          onClick={() => toggleFilter('high')}
          className={`flex items-center gap-2 px-1 py-0.5 rounded ${activeFilter === 'high' ? 'bg-red-100' : 'hover:bg-gray-100'}`}
        >
          <div className="w-3 h-3 bg-red-500 rounded-full" />
          <span className="text-xs">High Risk</span>
        </button>
        <button 
          onClick={() => toggleFilter('medium')}
          className={`flex items-center gap-2 px-1 py-0.5 rounded ${activeFilter === 'medium' ? 'bg-yellow-100' : 'hover:bg-gray-100'}`}
        >
          <div className="w-3 h-3 bg-yellow-500 rounded-full" />
          <span className="text-xs">Medium</span>
        </button>
        <button 
          onClick={() => toggleFilter('low')}
          className={`flex items-center gap-2 px-1 py-0.5 rounded ${activeFilter === 'low' ? 'bg-green-100' : 'hover:bg-gray-100'}`}
        >
          <div className="w-3 h-3 bg-green-500 rounded-full" />
          <span className="text-xs">Low Risk</span>
        </button>
        
        {/* Show All Button */}
        {activeFilter && (
          <button 
            onClick={() => onFilterChange(null)}
            className="mt-2 text-xs text-blue-600 hover:underline"
          >
            Show All
          </button>
        )}
        </div>
      )}
    </div>
  )
}

export default RiskLegend
