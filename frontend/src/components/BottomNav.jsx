import { useNavigate, useLocation } from 'react-router-dom'
import { useState } from 'react'
import homeImg from '/src/assets/images/ft_home.svg'
import mapImg from '/src/assets/images/ft_map.svg'
import helpImg from '/src/assets/images/ft_help.svg'
import adminImg from '/src/assets/images/ft_admin-panel.svg'
import reportImg from '/src/assets/images/ft_report.svg'

function BottomNav({ onHelpClick, onChatClick }) {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('home')

  const handleTabClick = (tab, action) => {
    setActiveTab(tab)
    if (action) action()
  }

  return (
    <nav className="bg-white shadow-[0_-4px_20px_0px_rgba(0,0,0,0.08)] z-50">
      <div className="flex items-center justify-around h-16">
        <button 
          className={`flex flex-col items-center gap-1 ${activeTab === 'home' ? 'text-blue-600' : 'text-gray-400'}`}
          onClick={() => handleTabClick('home', () => navigate('/'))}
        >
          <img src={homeImg} alt="Home" className={`w-6 h-6 ${activeTab === 'home' ? '' : 'opacity-60'}`} />
          <div className="text-xs">Home</div>
        </button>

        <button 
          className={`flex flex-col items-center gap-1 ${activeTab === 'map' ? 'text-blue-600' : 'text-gray-400'}`}
          onClick={() => handleTabClick('map', () => navigate('/'))}
        >
          <img src={mapImg} alt="Map" className={`w-6 h-6 ${activeTab === 'map' ? '' : 'opacity-60'}`} />
          <div className="text-xs">Map</div>
        </button>

        {/* Reports Button - Center */}
        <button 
          className="flex flex-col items-center -mt-8"
          onClick={() => navigate('/report')}
        >
          <div className="h-12 p-3 bg-blue-950 rounded-3xl shadow-[0px_4px_16px_0px_rgba(26,42,108,0.40)] outline-solid outline-[3px] outline-offset-[-3px] outline-white inline-flex justify-start items-start gap-2.5">
            <img src={reportImg} alt="Reports" className="w-6 h-6" />
          </div>
          <span className="text-xs text-blue-950 font-medium bg-white px-2 py-0.5 rounded mt-1">Reports</span>
        </button>

        <button 
          className={`flex flex-col items-center gap-1 ${activeTab === 'help' ? 'text-blue-600' : 'text-gray-400'}`}
          onClick={() => handleTabClick('help', () => navigate('/help'))}
        >
          <img src={helpImg} alt="Help" className={`w-6 h-6 ${activeTab === 'help' ? '' : 'opacity-60'}`} />
          <div className="text-xs">Help</div>
        </button>

        <button 
          className={`flex flex-col items-center gap-1 ${activeTab === 'admin' ? 'text-blue-600' : 'text-gray-400'}`}
          onClick={() => handleTabClick('admin', () => navigate('/admin'))}
        >
          <img src={adminImg} alt="Admin" className={`w-6 h-6 ${activeTab === 'admin' ? '' : 'opacity-60'}`} />
          <div className="text-xs">Admin</div>
        </button>
      </div>
    </nav>
  )
}

export default BottomNav
