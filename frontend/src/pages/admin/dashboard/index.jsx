import { useState, useEffect } from "react"
import { AlertCircle, Clock, ShieldAlert, CheckCircle2 } from "lucide-react"
import AdminLayout from "../../../components/admin/AdminLayout"

function AdminDashboardPage() {
    const [stats, setStats] = useState({
        pending: 0,
        approved: 0,
        total: 0,
    })
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetchStats()
    }, [])

    const fetchStats = async () => {
        try {
            const response = await fetch("http://localhost:5000/api/reports/stats")
            if (response.ok) {
                const data = await response.json()
                setStats({
                    pending: data.pending_review || 0,
                    approved: data.public_visible || 0,
                    total: data.total || 0,
                })
            }
        } catch (error) {
            console.error("Error fetching stats:", error)
        } finally {
            setLoading(false)
        }
    }

    return (
        <AdminLayout activeTab="dashboard">
            <div className="w-full max-w-sm px-4">
                <div className="flex items-center justify-between">
                    <h1 className="text-zinc-800 text-2xl font-extrabold font-['DM_Sans']">Dashboard</h1>
                    <div className="px-3 py-1.5 bg-green-50 rounded-full border border-emerald-100 flex items-center">
                        <span className="text-green-500 text-[11px] font-semibold font-['DM_Sans']">All Systems Operational</span>
                    </div>
                </div>
            </div>

            {/* Quick Stats Grid */}
            <div className="w-full max-w-sm px-4 mt-6 grid grid-cols-2 gap-3">
                {/* Pending Review Card */}
                <div className="bg-white rounded-[20px] p-5 shadow-[0px_8px_24px_rgba(149,157,165,0.1)] border border-slate-100 flex flex-col justify-between h-[130px]">
                    <div className="flex justify-between items-start">
                        <div className="w-10 h-10 rounded-full bg-amber-50 flex items-center justify-center">
                            <Clock className="w-5 h-5 text-amber-500" strokeWidth={2.5} />
                        </div>
                        <span className="text-amber-500 text-xs font-bold font-['DM_Sans'] bg-amber-50 px-2 py-1 rounded-md">
                            Action Req
                        </span>
                    </div>
                    <div>
                        <div className="text-3xl font-black font-['DM_Sans'] text-slate-800">
                            {loading ? "..." : stats.pending}
                        </div>
                        <div className="text-slate-400 text-xs font-medium font-['DM_Sans'] mt-0.5">
                            Pending Review
                        </div>
                    </div>
                </div>

                {/* Approved/Active Card */}
                <div className="bg-white rounded-[20px] p-5 shadow-[0px_8px_24px_rgba(149,157,165,0.1)] border border-slate-100 flex flex-col justify-between h-[130px]">
                    <div className="flex justify-between items-start">
                        <div className="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center">
                            <CheckCircle2 className="w-5 h-5 text-emerald-500" strokeWidth={2.5} />
                        </div>
                    </div>
                    <div>
                        <div className="text-3xl font-black font-['DM_Sans'] text-slate-800">
                            {loading ? "..." : stats.approved}
                        </div>
                        <div className="text-slate-400 text-xs font-medium font-['DM_Sans'] mt-0.5">
                            Active Reports
                        </div>
                    </div>
                </div>
            </div>

            {/* Recent Alerts Section */}
            <div className="w-full max-w-sm px-4 mt-8">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-slate-800 text-lg font-bold font-['DM_Sans']">Priority Alerts</h2>
                    <button className="text-[#1e3a8a] text-xs font-bold font-['DM_Sans']">View All</button>
                </div>

                <div className="space-y-3">
                    {/* Alert Card 1 */}
                    <div className="bg-white rounded-2xl p-4 shadow-sm border border-red-100 flex gap-4 items-start relative overflow-hidden">
                        <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-red-500 rounded-l-2xl"></div>
                        <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center shrink-0">
                            <ShieldAlert className="w-5 h-5 text-red-500" />
                        </div>
                        <div className="flex-1 pt-0.5">
                            <div className="flex justify-between items-start">
                                <h3 className="text-slate-800 text-sm font-bold font-['DM_Sans']">High Severity Report</h3>
                                <span className="text-slate-400 text-[10px] font-medium">10m ago</span>
                            </div>
                            <p className="text-slate-500 text-xs font-normal mt-1 leading-snug">
                                Multiple reports of physical harassment in Quezon Blvd area.
                            </p>
                        </div>
                    </div>

                    {/* Alert Card 2 */}
                    <div className="bg-white rounded-2xl p-4 shadow-sm border border-amber-100 flex gap-4 items-start relative overflow-hidden">
                        <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-amber-400 rounded-l-2xl"></div>
                        <div className="w-10 h-10 rounded-full bg-amber-50 flex items-center justify-center shrink-0">
                            <AlertCircle className="w-5 h-5 text-amber-500" />
                        </div>
                        <div className="flex-1 pt-0.5">
                            <div className="flex justify-between items-start">
                                <h3 className="text-slate-800 text-sm font-bold font-['DM_Sans']">Unverified Cluster</h3>
                                <span className="text-slate-400 text-[10px] font-medium">1h ago</span>
                            </div>
                            <p className="text-slate-500 text-xs font-normal mt-1 leading-snug">
                                4 new reports flagged for investigation in same vicinity.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Quick Actions */}
            <div className="w-full max-w-sm px-4 mt-8 pb-8">
                <h2 className="text-slate-800 text-lg font-bold font-['DM_Sans'] mb-4">Quick Links</h2>
                <div className="grid grid-cols-2 gap-3">
                    <button className="bg-[#1f295b] text-white p-4 rounded-xl flex flex-col items-center justify-center gap-2 shadow-sm hover:bg-[#151c3d] transition-colors">
                        <span className="text-sm font-bold font-['DM_Sans']">Export Data</span>
                        <span className="text-[10px] text-blue-200 font-medium">CSV/PDF formats</span>
                    </button>
                    <button className="bg-white border border-slate-200 text-slate-700 p-4 rounded-xl flex flex-col items-center justify-center gap-2 shadow-sm hover:bg-slate-50 transition-colors">
                        <span className="text-sm font-bold font-['DM_Sans']">System Logs</span>
                        <span className="text-[10px] text-slate-400 font-medium">View audit trail</span>
                    </button>
                </div>
            </div>
        </AdminLayout>
    )
}

export default AdminDashboardPage
