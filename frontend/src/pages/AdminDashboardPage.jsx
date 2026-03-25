import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import logoImg from '/src/assets/images/Logo.svg'
import backImg from '/src/assets/images/rpt_back.svg'

function AdminDashboardPage() {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('dashboard')
  const [reports, setReports] = useState([])
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) {
      navigate('/admin')
      return
    }
    fetchData()
  }, [activeTab])

  const getAuthHeaders = () => ({
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${localStorage.getItem('token')}`
  })

  const fetchData = async () => {
    setLoading(true)
    try {
      if (activeTab === 'dashboard' || activeTab === 'review') {
        const response = await fetch('http://localhost:5000/api/reports/pending', {
          headers: getAuthHeaders()
        })
        if (response.ok) {
          const data = await response.json()
          setReports(data.reports || [])
        }
      }
      if (activeTab === 'dashboard' || activeTab === 'analytics') {
        const response = await fetch('http://localhost:5000/api/reports/stats')
        if (response.ok) {
          const data = await response.json()
          setStats(data)
        }
      }
    } catch (err) {
      console.error('Error fetching data:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleApprove = async (reportId) => {
    try {
      const response = await fetch(`http://localhost:5000/api/reports/${reportId}/approve`, {
        method: 'POST',
        headers: getAuthHeaders()
      })
      if (response.ok) {
        fetchData()
      }
    } catch (err) {
      console.error('Error approving report:', err)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    navigate('/admin')
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending_review': return 'border-red-500'
      case 'approved_awareness': return 'border-green-500'
      case 'verified_pnp': return 'border-blue-900'
      default: return 'border-gray-300'
    }
  }

  const getCategoryColor = (category) => {
    switch (category?.toLowerCase()) {
      case 'harassment': return 'bg-red-100 text-red-500'
      case 'physical_assault': return 'bg-red-100 text-red-500'
      case 'stalking': return 'bg-amber-100 text-amber-500'
      case 'verbal_abuse': return 'bg-yellow-100 text-yellow-500'
      default: return 'bg-gray-100 text-gray-500'
    }
  }

  return (
    <div className="w-full min-h-screen bg-slate-50 overflow-hidden flex flex-col items-center">
      {/* Header */}
      <div className="w-96 max-w-[95vw] relative h-[120px] mt-8">
        <img 
          className="w-24 h-11 mx-auto" 
          src={logoImg} 
          alt="SafeMap" 
        />
        <div className="mt-4 text-zinc-800 text-lg font-extrabold font-['DM_Sans']">
          Dashboard
        </div>
        {/* Status Badge */}
        <div className="w-40 h-7 px-1.5 py-1 mt-2 mx-auto bg-green-50 rounded-[20px] outline outline-1 outline-offset-[-1px] outline-emerald-100 flex items-center justify-center">
          <span className="text-green-500 text-xs font-semibold font-['DM_Sans']">All Systems Operational</span>
        </div>
        {/* User Menu */}
        <div className="absolute top-8 right-0 flex items-center gap-2">
          <div className="w-4 h-4 relative overflow-hidden">
            <div className="w-3 h-3.5 left-[2px] top-[1.33px] absolute bg-blue-900" />
          </div>
          <img className="w-4 h-4 rounded-full" src="https://placehold.co/16x16" alt="User" />
        </div>
      </div>

      {/* Stats Cards */}
      <div className="w-96 max-w-[95vw] px-4 space-y-4">
        {/* Active Cases */}
        <div className="w-96 h-20 bg-white rounded-tl-xl rounded-bl-xl shadow-[0px_0px_3px_0px_rgba(0,0,0,0.08)] border-l-[5px] border-green-500 overflow-hidden">
          <div className="w-32 h-14 left-[31px] top-[15px] absolute">
            <div className="left-0 top-0 absolute text-gray-400 text-xs font-bold font-['DM_Sans']">Active Cases</div>
            <div className="left-[0.18px] top-[18px] absolute text-blue-900 text-3xl font-extrabold font-['DM_Sans']">{stats?.total || '1,284'}</div>
            <div className="left-[79px] top-[34px] absolute text-green-500 text-sm font-semibold font-['DM_Sans']">General Santos</div>
          </div>
        </div>

        {/* Pending Review */}
        <div className="w-96 h-20 bg-white rounded-tl-xl rounded-bl-xl shadow-[0px_0px_3px_0px_rgba(0,0,0,0.08)] border-l-[5px] border-red-500 overflow-hidden">
          <div className="w-32 h-14 left-[31px] top-[15px] absolute">
            <div className="left-0 top-0 absolute text-gray-400 text-xs font-bold font-['DM_Sans']">Pending Review</div>
            <div className="left-[0.18px] top-[18px] absolute text-blue-900 text-3xl font-extrabold font-['DM_Sans']">{stats?.pending_review || '42'}</div>
            <div className="left-[42px] top-[34px] absolute text-red-500 text-sm font-semibold font-['DM_Sans']">High Urgency</div>
          </div>
        </div>

        {/* Today's Report */}
        <div className="w-96 h-20 bg-white rounded-tl-xl rounded-bl-xl shadow-[0px_0px_3px_0px_rgba(0,0,0,0.08)] border-l-[5px] border-blue-900 overflow-hidden">
          <div className="w-40 h-14 left-[31px] top-[15px] absolute">
            <div className="left-0 top-0 absolute text-gray-400 text-xs font-bold font-['DM_Sans']">Today's Report</div>
            <div className="left-[0.18px] top-[18px] absolute text-blue-900 text-3xl font-extrabold font-['DM_Sans']">+12%</div>
            <div className="left-[75px] top-[34px] absolute text-gray-500 text-sm font-semibold font-['DM_Sans']">vs Yesterday</div>
          </div>
        </div>
      </div>

      {/* Need Review Section */}
      <div className="mt-8 px-4">
        <div className="flex justify-between items-center">
          <div className="text-zinc-800 text-lg font-extrabold font-['DM_Sans']">Need Review</div>
          <div className="text-blue-900 text-xs font-bold font-['DM_Sans']">View Queue</div>
        </div>

        {loading ? (
          <div className="text-center py-8 text-gray-500">Loading...</div>
        ) : reports.length === 0 ? (
          <div className="text-center py-8 text-gray-500">No pending reports</div>
        ) : (
          <div className="space-y-4 mt-4">
            {reports.slice(0, 3).map((report) => (
              <div key={report.id} className={`w-96 h-36 bg-white rounded-tl-xl rounded-bl-xl shadow-[0px_0px_3px_0px_rgba(0,0,0,0.08)] border-l-[5px] ${getStatusColor(report.status)} overflow-hidden`}>
                <div className="left-[31px] top-[24px] absolute flex items-start gap-3.5">
                  <div className="w-9 h-9 p-2 bg-red-100 rounded-[10px] flex items-center justify-center">
                    <div className="w-4 h-3.5 bg-red-500" />
                  </div>
                  <div className="w-52 h-20 relative">
                    <div className="left-[0.38px] top-[2.62px] absolute text-gray-400 text-xs font-semibold font-['DM_Sans']">
                      {report.reference_code || `SF-${report.id}`}
                    </div>
                    <div className="h-5 px-2.5 left-[56px] top-0 absolute bg-red-100 rounded flex items-center">
                      <span className="text-red-500 text-xs font-bold font-['DM_Sans']">
                        {report.category?.replace('_', ' ').toUpperCase() || 'REPORT'}
                      </span>
                    </div>
                    <div className="left-0 top-[31px] absolute text-zinc-800 text-base font-bold font-['DM_Sans']">
                      {report.title || 'Untitled Report'}
                    </div>
                    <div className="left-0 top-[59px] absolute flex items-center gap-1.5">
                      <div className="w-3.5 h-3.5 relative overflow-hidden">
                        <div className="w-2 h-3 left-[2.92px] top-[1.17px] absolute bg-gray-500" />
                      </div>
                      <span className="text-gray-500 text-xs font-normal font-['DM_Sans']">
                        {report.barangay || report.city || 'General Santos City'}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="left-[31px] top-[113px] absolute text-gray-400 text-xs font-normal font-['DM_Sans']">
                  {new Date(report.created_at).toLocaleDateString()}
                </div>
                <button
                  onClick={() => handleApprove(report.id)}
                  className="w-20 h-8 px-2.5 left-[273px] top-[105px] absolute bg-blue-950 rounded-lg flex items-center justify-center"
                >
                  <span className="text-white text-xs font-bold font-['DM_Sans']">Review</span>
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Audit Feed */}
      <div className="mt-8 px-4">
        <div className="text-zinc-800 text-lg font-extrabold font-['DM_Sans']">Audit Feed</div>
        <div className="w-96 h-80 mt-4 bg-white rounded-xl shadow-[0px_0px_3px_0px_rgba(0,0,0,0.08)] outline outline-1 outline-offset-[-1px] outline-gray-100 overflow-hidden">
          <div className="w-80 h-72 left-[26px] top-[21px] absolute">
            {/* Audit items */}
            <div className="left-0 top-0 absolute flex items-start gap-3.5">
              <div className="w-9 h-9 p-2 bg-indigo-50 rounded-2xl flex items-center justify-center">
                <div className="w-4 h-4 bg-blue-600" />
              </div>
              <div className="w-60 flex items-end gap-[3px] flex-wrap content-end">
                <div className="text-zinc-800 text-sm font-semibold font-['DM_Sans']">Admin approved Case #{reports[0]?.reference_code || 'SF-8294'}</div>
                <div className="text-gray-400 text-xs font-normal font-['DM_Sans']">12:42 PM</div>
                <div className="text-gray-500 text-[10px] font-bold font-['DM_Sans']">SECURITY_ACTION</div>
              </div>
            </div>
            <div className="left-0 top-[85px] absolute flex items-start gap-3.5">
              <div className="w-9 h-9 p-2 bg-slate-100 rounded-2xl flex items-center justify-center">
                <div className="w-4 h-3 bg-gray-500" />
              </div>
              <div className="w-72 flex items-end gap-[3px] flex-wrap content-end">
                <div className="text-zinc-800 text-sm font-semibold font-['DM_Sans']">Staff updated description for #SF-8110</div>
                <div className="text-gray-400 text-xs font-normal font-['DM_Sans']">11:15 AM</div>
                <div className="text-gray-500 text-[10px] font-bold font-['DM_Sans']">META_UPDATE</div>
              </div>
            </div>
            <div className="left-0 top-[171px] absolute flex items-start gap-3.5">
              <div className="w-9 h-9 p-2 bg-red-100 rounded-2xl flex items-center justify-center">
                <div className="w-4 h-4 bg-red-500" />
              </div>
              <div className="w-64 flex items-end gap-[3px] flex-wrap content-end">
                <div className="text-zinc-800 text-sm font-semibold font-['DM_Sans']">System flagged #SF-8299 as duplicate</div>
                <div className="text-gray-400 text-xs font-normal font-['DM_Sans']">10:02 AM</div>
                <div className="text-gray-500 text-[10px] font-bold font-['DM_Sans']">AUTO_MOD</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Staff Management */}
      <div className="mt-8 px-4">
        <div className="text-zinc-800 text-lg font-extrabold font-['DM_Sans']">Staff Management</div>
        
        {/* Search */}
        <div className="w-96 mt-4 shadow-[0px_0px_3px_0px_rgba(0,0,0,0.08)] flex flex-col items-center">
          <div className="self-stretch h-14 pl-5 pr-52 py-5 bg-white rounded-[10px] outline outline-1 outline-offset-[-1px] outline-gray-200 flex flex-col items-start gap-2.5">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 relative overflow-hidden">
                <div className="w-3 h-3 left-[2px] top-[2px] absolute bg-gray-400" />
              </div>
              <span className="text-gray-400 text-xs font-normal font-['DM_Sans']">Search staff members....</span>
            </div>
          </div>
        </div>

        {/* Add New Staff Button */}
        <button className="w-28 h-8 px-2.5 mt-[-40px] ml-[230px] bg-blue-950 rounded-lg flex items-center justify-center">
          <span className="text-white text-xs font-bold font-['DM_Sans']">+ Add New Staff</span>
        </button>

        {/* Staff List */}
        <div className="w-96 mt-5 flex flex-col items-start gap-5">
          {/* Staff 1 */}
          <div className="self-stretch h-52 relative bg-white rounded-xl shadow-[0px_0px_3px_0px_rgba(0,0,0,0.08)] border-l-[5px] border-blue-900 overflow-hidden">
            <div className="w-24 left-[31px] top-[21px] absolute flex flex-col items-start gap-1">
              <div className="text-gray-400 text-xs font-bold font-['DM_Sans']">EMP-ID: 8829</div>
            </div>
            <div className="h-5 px-2.5 left-[301px] top-[18px] absolute bg-blue-50 rounded-md flex items-center">
              <span className="text-blue-900 text-[10px] font-bold font-['DM_Sans']">ACTIVE</span>
            </div>
            <div className="w-64 left-[31px] top-[47px] absolute flex flex-col items-start gap-6">
              <div className="text-blue-900 text-base font-bold font-['DM_Sans']">Linda Walker</div>
              <div className="flex flex-col items-start gap-2">
                <div className="flex items-end gap-3">
                  <div className="w-4 h-4 relative overflow-hidden">
                    <div className="w-2.5 h-3.5 left-[2.67px] top-[1.33px] absolute bg-gray-600" />
                  </div>
                  <span className="text-gray-500 text-xs font-medium font-['DM_Sans']">Administrator</span>
                </div>
                <div className="flex items-end gap-3">
                  <div className="w-4 h-4 relative overflow-hidden">
                    <div className="w-3.5 h-2.5 left-[1.33px] top-[2.67px] absolute bg-gray-600" />
                  </div>
                  <span className="text-gray-500 text-xs font-medium font-['DM_Sans']">walkerlinda_safemapph@gmail.com</span>
                </div>
              </div>
            </div>
            <div className="left-[31px] top-[159px] absolute flex items-center gap-3">
              <div className="w-28 h-6 px-2.5 bg-blue-50 rounded-md flex flex-col items-end gap-2.5">
                <div className="flex items-center gap-2">
                  <div className="w-3.5 h-3.5 relative overflow-hidden">
                    <div className="w-2.5 h-2.5 left-[1.75px] top-[1.75px] absolute bg-blue-900" />
                  </div>
                  <span className="text-blue-900 text-xs font-bold font-['DM_Sans']">Edit</span>
                </div>
              </div>
              <div className="w-28 h-6 px-2.5 bg-red-100 rounded-md flex items-center justify-center">
                <span className="text-red-500 text-xs font-bold font-['DM_Sans']">Deactivate</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="mt-8 w-96 h-20 relative">
        <div className="w-96 h-16 left-0 top-[16px] absolute bg-white rounded-tl-[30px] rounded-tr-[30px] overflow-hidden flex justify-around items-center">
          <div className="w-14 flex flex-col items-center gap-1">
            <div className="w-6 h-6 relative overflow-hidden">
              <div className="w-4 h-2.5 left-[3px] top-[7px] absolute bg-gray-400" />
            </div>
            <span className="text-gray-400 text-base font-medium font-['DM_Sans']">Queue</span>
          </div>
          <div className="w-16 flex flex-col items-center gap-1">
            <div className="w-6 h-6 relative overflow-hidden">
              <div className="w-4 h-4 left-[3px] top-[3px] absolute bg-gray-400" />
            </div>
            <span className="text-gray-400 text-base font-medium font-['DM_Sans']">Analytics</span>
          </div>
          <div className="w-10 flex flex-col items-center gap-1">
            <div className="w-6 h-6 relative overflow-hidden">
              <div className="w-4 h-4 left-[4px] top-[2.50px] absolute bg-gray-400 outline outline-[1.33px] outline-offset-[-0.67px] outline-gray-400" />
            </div>
            <span className="text-gray-400 text-base font-medium font-['DM_Sans']">Audit</span>
          </div>
          <div className="w-14 flex flex-col items-center gap-1">
            <div className="w-6 h-6 relative overflow-hidden">
              <div className="w-5 h-5 left-[2.48px] top-[2px] absolute bg-gray-400" />
            </div>
            <span className="text-gray-400 text-base font-medium font-['DM_Sans']">Settings</span>
          </div>
        </div>
        {/* Dashboard Button (Center) */}
        <div className="w-12 left-[194px] top-0 absolute flex flex-col items-center gap-1">
          <div className="h-12 p-3 bg-blue-950 rounded-3xl shadow-[0px_4px_16px_0px_rgba(26,42,108,0.40)] outline outline-[3px] outline-offset-[-3px] outline-white flex items-start justify-center">
            <div className="w-6 h-6 relative overflow-hidden">
              <div className="w-5 h-5 left-[3.25px] top-[3.25px] absolute bg-white" />
            </div>
          </div>
          <span className="text-blue-950 text-base font-bold font-['DM_Sans']">Dashboard</span>
        </div>
      </div>

      {/* Back Button */}
      <button
        onClick={handleLogout}
        className="absolute top-4 left-4 p-2 flex items-center gap-2 text-gray-600 hover:text-blue-900"
      >
        <img src={backImg} alt="Back" className="w-5 h-5" />
      </button>
    </div>
  )
}

export default AdminDashboardPage
