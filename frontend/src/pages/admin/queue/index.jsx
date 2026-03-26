import { useState, useEffect } from "react"
import { Search, Filter, Clock, ChevronDown } from "lucide-react"
import AdminLayout from "../../../components/admin/AdminLayout"
import QueueStatsBar from "./QueueStatsBar"
import QueueReportCard from "./QueueReportCard"

function AdminQueuePage() {
    const [allReports, setAllReports] = useState([])
    const [loading, setLoading] = useState(true)
    const [searchQuery, setSearchQuery] = useState("")
    const [statusFilter, setStatusFilter] = useState("pending_review")
    const [categoryFilter, setCategoryFilter] = useState("")
    const [showFilters, setShowFilters] = useState(false)
    const [stats, setStats] = useState({ pending: 0, approved: 0, dismissed: 0, total: 0 })

    useEffect(() => {
        fetchData()
    }, [statusFilter, categoryFilter])

    const getAuthHeaders = () => ({
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
    })

    const fetchData = async () => {
        setLoading(true)
        try {
            let url = "http://localhost:5000/api/reports?per_page=50"
            if (statusFilter) url += `&status=${statusFilter}`
            if (categoryFilter) url += `&category=${categoryFilter}`

            const response = await fetch(url, { headers: getAuthHeaders() })
            if (response.ok) setAllReports((await response.json()).reports || [])

            const statsRes = await fetch("http://localhost:5000/api/reports/stats")
            if (statsRes.ok) {
                const data = await statsRes.json()
                setStats({
                    pending: data.pending_review || 0,
                    approved: data.public_visible || 0,
                    dismissed: data.by_status?.dismissed || 0,
                    total: data.total || 0,
                })
            }
        } catch (err) {
            console.error("Error fetching data:", err)
        } finally {
            setLoading(false)
        }
    }

    const handleApprove = async (id) => {
        try {
            const res = await fetch(`http://localhost:5000/api/reports/${id}/approve`, {
                method: "POST",
                headers: getAuthHeaders(),
                body: JSON.stringify({ notes: "Approved for public awareness" }),
            })
            if (res.ok) fetchData()
        } catch (err) { console.error(err) }
    }

    const handleDismiss = async (id) => {
        try {
            const res = await fetch(`http://localhost:5000/api/reports/${id}/dismiss`, {
                method: "POST", headers: getAuthHeaders(), body: JSON.stringify({ reason: "Dismissed by admin" }),
            })
            if (res.ok) fetchData()
        } catch (err) { console.error(err) }
    }

    const filteredReports = allReports.filter((r) => {
        if (!searchQuery) return true
        const q = searchQuery.toLowerCase()
        return (r.title || "").toLowerCase().includes(q) ||
               (r.reference_code || "").toLowerCase().includes(q) ||
               (r.category || "").toLowerCase().includes(q) ||
               (r.location?.barangay || "").toLowerCase().includes(q)
    })

    const CATEGORIES = ["", "harassment", "physical_abuse", "sexual_assault", "domestic_violence", "stalking", "verbal_abuse", "theft", "assault"]

    return (
        <AdminLayout activeTab="queue">
            <div className="w-full max-w-sm px-4">
                <div className="flex items-center justify-between">
                    <h1 className="text-zinc-800 text-2xl font-extrabold font-['DM_Sans']">Report Queue</h1>
                    <div className="px-3 py-1.5 bg-amber-50 rounded-full border border-amber-200 flex items-center gap-1.5">
                        <Clock className="w-3 h-3 text-amber-500" />
                        <span className="text-amber-600 text-[11px] font-semibold font-['DM_Sans']">{stats.pending} Pending</span>
                    </div>
                </div>
            </div>

            <QueueStatsBar stats={stats} statusFilter={statusFilter} setStatusFilter={setStatusFilter} />

            {/* Search & Filters */}
            <div className="w-full max-w-sm px-4 mt-4 space-y-3">
                <div className="w-full h-12 bg-white rounded-xl outline outline-1 outline-offset-[-1px] outline-gray-200 flex items-center px-4 gap-3 shadow-sm">
                    <Search className="w-4 h-4 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search by title, code, category..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="flex-1 bg-transparent outline-none text-sm font-normal text-zinc-800 font-['DM_Sans'] placeholder-gray-400"
                    />
                </div>

                <button
                    onClick={() => setShowFilters(!showFilters)}
                    className="flex items-center gap-2 text-[#1e3a8a] text-xs font-bold font-['DM_Sans']">
                    <Filter className="w-3.5 h-3.5" />
                    Filter by Category
                    <ChevronDown className={`w-3.5 h-3.5 transition-transform ${showFilters ? "rotate-180" : ""}`} />
                </button>

                {showFilters && (
                    <div className="flex flex-wrap gap-2">
                        {CATEGORIES.map((cat) => (
                            <button
                                key={cat}
                                onClick={() => setCategoryFilter(cat)}
                                className={`px-3 py-1.5 rounded-full text-[10px] font-bold font-['DM_Sans'] uppercase transition-colors ${
                                    categoryFilter === cat ? "bg-[#1f295b] text-white" : "bg-white text-gray-500 border border-gray-200"
                                }`}>
                                {cat ? cat.replace("_", " ") : "All Categories"}
                            </button>
                        ))}
                    </div>
                )}
            </div>

            {/* Report Cards */}
            <div className="w-full max-w-sm px-4 mt-5 space-y-3">
                {loading ? (
                    <div className="text-center py-12 text-gray-400 text-sm font-['DM_Sans']">Loading reports...</div>
                ) : filteredReports.length === 0 ? (
                    <div className="text-center py-12">
                        <div className="text-gray-300 text-4xl mb-3">📋</div>
                        <div className="text-gray-400 text-sm font-['DM_Sans']">No reports found</div>
                    </div>
                ) : (
                    filteredReports.map((report) => (
                        <QueueReportCard key={report.id} report={report} onApprove={handleApprove} onDismiss={handleDismiss} />
                    ))
                )}
            </div>
        </AdminLayout>
    )
}

export default AdminQueuePage
