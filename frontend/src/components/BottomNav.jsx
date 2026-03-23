import { useNavigate } from 'react-router-dom'
import homeImg from '/src/assets/images/ft_home.svg'
import mapImg from '/src/assets/images/ft_map.svg'
import helpImg from '/src/assets/images/ft_help.svg'
import chatImg from '/src/assets/images/ft_admin-panel.svg'

function BottomNav({ onHelpClick, onChatClick }) {
  const navigate = useNavigate()

  return (
    <nav className="bg-white shadow-[0_-4px_20px_0px_rgba(0,0,0,0.08)] z-50">
      <div className="flex items-center justify-around h-16">
        <button 
          className="flex flex-col items-center gap-1 text-blue-950"
          onClick={() => navigate('/')}
        >
          <img src={homeImg} alt="Home" className="w-6 h-6" />
          <div className="text-xs">Home</div>
        </button>

        <button 
          className="flex flex-col items-center gap-1 text-gray-400"
          onClick={() => navigate('/')}
        >
          <img src={mapImg} alt="Map" className="w-6 h-6" />
          <div className="text-xs">Map</div>
        </button>

        {/* Spacer for Report button */}
        <div className="w-14" />

        <button 
          className="flex flex-col items-center gap-1 text-gray-400"
          onClick={onHelpClick}
        >
          <img src={helpImg} alt="Help" className="w-6 h-6" />
          <div className="text-xs">Help</div>
        </button>

        <button 
          className="flex flex-col items-center gap-1 text-gray-400"
          onClick={onChatClick}
        >
          <img src={chatImg} alt="Admin" className="w-6 h-6 text-gray-400" />
          <div className="text-xs text-gray-400">Admin</div>
        </button>
      </div>
    </nav>
  )
}

export default BottomNav
