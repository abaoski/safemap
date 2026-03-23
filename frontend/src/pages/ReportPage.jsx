import { useNavigate } from 'react-router-dom'
import logoImg from '/src/assets/images/Logo.svg'
import rptBackImg from '/src/assets/images/rpt_back.svg'
import rptSafetyImg from '/src/assets/images/rpt_safety.svg'
import rptImpReminderImg from '/src/assets/images/rpt_imp_reminder.svg'

export default function ReportPage() {
  const navigate = useNavigate()

  return (
    <div className="w-full h-screen bg-slate-50 overflow-y-auto">
      {/* Header with back button and logo */}
      <div className="relative w-full h-auto p-4">
        <button 
          onClick={() => navigate('/')}
          className="absolute left-4 top-4 p-2 bg-slate-100 rounded-md"
        >
          <img src={rptBackImg} alt="Back" className="w-3 h-3" />
        </button>
        
        <div className="flex flex-col items-center pt-8">
          <img src={logoImg} alt="SafeMap" className="h-11 mb-4" />
        </div>
      </div>
      
      {/* Safety First Section */}
      <div className="w-full max-w-md mx-auto px-4 flex flex-col items-center gap-3">
        <div className="w-20 h-20 p-5 bg-blue-50 rounded-[20px] flex items-center justify-center">
          <img src={rptSafetyImg} alt="Safety" className="w-10 h-10" />
        </div>
        
        <div className="text-center">
          <h1 className="text-blue-900 text-3xl font-extrabold font-['DM_Sans'] tracking-tight">Safety First</h1>
          <p className="text-gray-500 text-base font-normal mt-2">Your security is our priority. Please review these essential guidelines before submitting your report.</p>
        </div>
      </div>
      
      {/* Image Section */}
      <div className="w-full max-w-md mx-auto mt-8 shadow-[0px_0px_3px_0px_rgba(0,0,0,0.08)]">
        <div className="w-full h-56 bg-gray-200 rounded-t-xl overflow-hidden">
          <img src="https://placehold.co/389x232" alt="Placeholder" className="w-full h-full object-cover" />
        </div>
        <div className="w-full h-10 bg-white flex items-center px-4">
          <div className="flex items-center gap-2">
            <img src={rptImpReminderImg} alt="Important" className="w-4 h-4" />
            <span className="text-blue-900 text-sm font-medium">Important Reminders</span>
          </div>
        </div>
      </div>
      
      {/* Info Cards */}
      <div className="w-full max-w-md mx-auto mt-8 px-4 flex flex-col gap-4">
        {/* Emergency Protocol */}
        <div className="w-full h-20 bg-white rounded-2xl shadow-[0px_0px_3px_0px_rgba(0,0,0,0.08)] outline outline-1 outline-offset-[-1px] outline-gray-200 px-5 py-4 flex items-center gap-3.5">
          <img src={rptImpReminderImg} alt="Emergency" className="w-6 h-6" />
          <div className="flex flex-col gap-1">
            <span className="text-zinc-800 text-xs font-medium">Emergency Protocol</span>
            <span className="text-gray-400 text-xs">If you are in immediate danger, call <span className="text-blue-900 font-bold">911</span> immediately.</span>
          </div>
        </div>
        
        {/* Privacy Rule */}
        <div className="w-full h-20 bg-white rounded-2xl shadow-[0px_0px_3px_0px_rgba(0,0,0,0.08)] outline outline-1 outline-offset-[-1px] outline-gray-200 px-5 py-4 flex items-center gap-3.5">
          <img src={rptImpReminderImg} alt="Privacy" className="w-6 h-6" />
          <div className="flex flex-col gap-1">
            <span className="text-zinc-800 text-xs font-medium">Privacy Rule</span>
            <span className="text-gray-400 text-xs">Your report will be treated with strict confidentiality. We never share your personal information.</span>
          </div>
        </div>
      </div>
      
      {/* Submit Button */}
      <div className="w-full max-w-md mx-auto mt-8 px-4 pb-8">
        <button 
          onClick={() => alert('Report submission functionality coming soon!')}
          className="w-full h-14 bg-blue-950 rounded-xl shadow-[0px_4px_16px_0px_rgba(26,42,108,0.40)] flex items-center justify-center"
        >
          <span className="text-white text-base font-semibold font-['DM_Sans'] tracking-tight">Submit Report</span>
        </button>
      </div>
    </div>
  )
}
