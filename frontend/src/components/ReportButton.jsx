import { useNavigate } from 'react-router-dom'
import reportVectorImg from '/src/assets/images/ft_report.svg'

function ReportButton() {
  const navigate = useNavigate()

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-[1001] flex flex-col items-center">
      <button 
        onClick={() => navigate('/report')}
        className="flex flex-col items-center gap-1"
      >
        <div className="h-12 p-3 bg-blue-950 rounded-[20px] shadow-[0px_4px_16px_0px_rgba(26,42,108,0.40)] outline outline-[3px] outline-white flex items-center justify-center">
          <img src={reportVectorImg} alt="Report" className="w-6 h-6" />
        </div>
        <span className="text-xs text-blue-950 font-medium bg-white px-2 rounded">Report</span>
      </button>
    </div>
  )
}

export default ReportButton
