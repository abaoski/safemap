import { Plus, Minus } from 'lucide-react'
import { useMap } from 'react-leaflet'
import myLocationImg from '/src/assets/images/My_location.svg'
import cityCentralImg from '/src/assets/images/City_central_button.svg'

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

export default ZoomControls
