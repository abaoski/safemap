import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import {
    Search,
    Filter,
    Clock,
    AlertTriangle,
    CheckCircle,
    XCircle,
    ChevronDown,
    Eye,
    MapPin,
} from "lucide-react"
import logoImg from "/src/assets/images/Logo.svg"
import backImg from "/src/assets/images/rpt_back.svg"
import AdminBottomNav from "../components/AdminBottomNav"

function AdminQueuePage() {
    const navigate = useNavigate()
    const [reports, setReports] = useState([])
    const [allReports, setAllReports] = useState([])
    const [loading, setLoading] = useState(true)
    const [searchQuery, setSearchQuery] = useState("")
    const [statusFilter, setStatusFilter] = useState("pending_review")
    const [categoryFilter, setCategoryFilter] = useState("")
    const [showFilters, setShowFilters] = useState(false)
    const [stats, setStats] = useState({
        pending: 0,
        approved: 0,
        dismissed: 0,
        total: 0,
    })

    useEffect(() => {
        const token = localStorage.getItem("token")
        if (!token) {
            navigate("/admin")
            return
        }
        fetchData()
    }, [statusFilter, categoryFilter])

    const getAuthHeaders = () => ({
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
    })

    const fetchData = async () => {
        setLoading(true)
        try {
            // Fetch filtered reports
            let url = "http://localhost:5000/api/reports?per_page=50"
            if (statusFilter) url += `&status=${statusFilter}`
            if (categoryFilter) url += `&category=${categoryFilter}`

            const response = await fetch(url, { headers: getAuthHeaders() })
            if (response.ok) {
                const data = await response.json()
                setAllReports(data.reports || [])
            }

            // Fetch stats
            const statsRes = await fetch(
                "http://localhost:5000/api/reports/stats",
            )
            if (statsRes.ok) {
                const data = await statsRes.json()
                setStats({
                    pending: data.pending_review || 0,
                    approved: data.public_visible || 0,
                    dismissed:
                        data.by_status?.dismissed || 0,
                    total: data.total || 0,
                })
            }
        } catch (err) {
            console.error("Error fetching data:", err)
        } finally {
            setLoading(false)
        }
    }

    const handleApprove = async (reportId) => {
        try {
            const response = await fetch(
                `http://localhost:5000/api/reports/${reportId}/approve`,
                { method: "POST", headers: getAuthHeaders() },
            )
            if (response.ok) fetchData()
        } catch (err) {
            console.error("Error approving report:", err)
        }
    }

    const handleDismiss = async (reportId) => {
        try {
            const response = await fetch(
                `http://localhost:5000/api/reports/${reportId}/dismiss`,
                {
                    method: "POST",
                    headers: getAuthHeaders(),
                    body: JSON.stringify({ reason: "Dismissed by admin" }),
                },
            )
            if (response.ok) fetchData()
        } catch (err) {
            console.error("Error dismissing report:", err)
        }
    }

    const handleLogout = () => {
        localStorage.removeItem("token")
        localStorage.removeItem("user")
        navigate("/admin")
    }

    // Filter by search
    const filteredReports = allReports.filter((r) => {
        if (!searchQuery) return true
        const q = searchQuery.toLowerCase()
        return (
            (r.title || "").toLowerCase().includes(q) ||
            (r.reference_code || "").toLowerCase().includes(q) ||
            (r.category || "").toLowerCase().includes(q) ||
            (r.location?.barangay || "").toLowerCase().includes(q)
        )
    })

    const getStatusBadge = (status) => {
        switch (status) {
            case "pending_review":
                return {
                    bg: "bg-amber-100",
                    text: "text-amber-600",
                    label: "PENDING",
                    border: "border-amber-400",
                }
            case "approved_awareness":
                return {
                    bg: "bg-green-100",
                    text: "text-green-600",
                    label: "APPROVED",
                    border: "border-green-500",
                }
            case "verified_pnp":
                return {
                    bg: "bg-blue-100",
                    text: "text-blue-800",
                    label: "VERIFIED",
                    border: "border-blue-900",
                }
            case "dismissed":
                return {
                    bg: "bg-red-100",
                    text: "text-red-500",
                    label: "DISMISSED",
                    border: "border-red-400",
                }
            default:
                return {
                    bg: "bg-gray-100",
                    text: "text-gray-500",
                    label: status,
                    border: "border-gray-300",
                }
        }
    }

    const getSeverityColor = (severity) => {
        switch (severity) {
            case "critical":
                return "bg-red-500"
            case "high":
                return "bg-orange-500"
            case "medium":
                return "bg-amber-400"
            case "low":
                return "bg-green-400"
            default:
                return "bg-gray-400"
        }
    }

    const formatDate = (dateStr) => {
        if (!dateStr) return "—"
        const d = new Date(dateStr)
        return d.toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
        })
    }

    const formatTime = (dateStr) => {
        if (!dateStr) return ""
        const d = new Date(dateStr)
        return d.toLocaleTimeString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
        })
    }

    return (
        <div className="w-full min-h-screen bg-slate-50 overflow-x-hidden flex flex-col items-center">
            {/* Header */}
            <div className="w-full max-w-sm px-4 pt-8 pb-2">
                <div className="relative flex items-center justify-center mb-5">
                    <img className="h-12 w-auto" src={logoImg} alt="SafeMap" />
                    <div className="absolute right-0 flex items-center gap-2">
                        <div className="w-8 h-8 bg-[#1f295b] rounded-lg flex items-center justify-center">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="w-4 h-4 text-white"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round">
                                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                                <path d="M13.73 21a2 2 0 0 1-3.46 0" />
                            </svg>
                        </div>
                        <img
                            className="w-8 h-8 rounded-full object-cover border-2 border-white shadow-sm"
                            src="https://placehold.co/32x32"
                            alt="User"
                        />
                    </div>
                </div>

                <div className="flex items-center justify-between">
                    <h1 className="text-zinc-800 text-2xl font-extrabold font-['DM_Sans']">
                        Report Queue
                    </h1>
                    <div className="px-3 py-1.5 bg-amber-50 rounded-full border border-amber-200 flex items-center gap-1.5">
                        <Clock className="w-3 h-3 text-amber-500" />
                        <span className="text-amber-600 text-[11px] font-semibold font-['DM_Sans']">
                            {stats.pending} Pending
                        </span>
                    </div>
                </div>
            </div>

            {/* Quick Stats */}
            <div className="w-full max-w-sm px-4 mt-4">
                <div className="grid grid-cols-4 gap-2">
                    <button
                        onClick={() => setStatusFilter("")}
                        className={`rounded-xl p-3 text-center transition-colors ${!statusFilter ? "bg-[#1f295b] shadow-md" : "bg-white shadow-sm border border-gray-100"}`}>
                        <div
                            className={`text-lg font-extrabold font-['DM_Sans'] ${!statusFilter ? "text-white" : "text-[#1e3a8a]"}`}>
                            {stats.total}
                        </div>
                        <div
                            className={`text-[8px] font-bold font-['DM_Sans'] uppercase ${!statusFilter ? "text-blue-200" : "text-gray-400"}`}>
                            All
                        </div>
                    </button>
                    <button
                        onClick={() => setStatusFilter("pending_review")}
                        className={`rounded-xl p-3 text-center transition-colors ${statusFilter === "pending_review" ? "bg-[#1f295b] shadow-md" : "bg-white shadow-sm border border-gray-100"}`}>
                        <div
                            className={`text-lg font-extrabold font-['DM_Sans'] ${statusFilter === "pending_review" ? "text-white" : "text-amber-500"}`}>
                            {stats.pending}
                        </div>
                        <div
                            className={`text-[8px] font-bold font-['DM_Sans'] uppercase ${statusFilter === "pending_review" ? "text-blue-200" : "text-gray-400"}`}>
                            Pending
                        </div>
                    </button>
                    <button
                        onClick={() => setStatusFilter("approved_awareness")}
                        className={`rounded-xl p-3 text-center transition-colors ${statusFilter === "approved_awareness" ? "bg-[#1f295b] shadow-md" : "bg-white shadow-sm border border-gray-100"}`}>
                        <div
                            className={`text-lg font-extrabold font-['DM_Sans'] ${statusFilter === "approved_awareness" ? "text-white" : "text-green-500"}`}>
                            {stats.approved}
                        </div>
                        <div
                            className={`text-[8px] font-bold font-['DM_Sans'] uppercase ${statusFilter === "approved_awareness" ? "text-blue-200" : "text-gray-400"}`}>
                            Approved
                        </div>
                    </button>
                    <button
                        onClick={() => setStatusFilter("dismissed")}
                        className={`rounded-xl p-3 text-center transition-colors ${statusFilter === "dismissed" ? "bg-[#1f295b] shadow-md" : "bg-white shadow-sm border border-gray-100"}`}>
                        <div
                            className={`text-lg font-extrabold font-['DM_Sans'] ${statusFilter === "dismissed" ? "text-white" : "text-red-500"}`}>
                            {stats.dismissed}
                        </div>
                        <div
                            className={`text-[8px] font-bold font-['DM_Sans'] uppercase ${statusFilter === "dismissed" ? "text-blue-200" : "text-gray-400"}`}>
                            Dismissed
                        </div>
                    </button>
                </div>
            </div>

            {/* Search & Filter */}
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
                    <ChevronDown
                        className={`w-3.5 h-3.5 transition-transform ${showFilters ? "rotate-180" : ""}`}
                    />
                </button>

                {showFilters && (
                    <div className="flex flex-wrap gap-2">
                        {[
                            "",
                            "harassment",
                            "physical_abuse",
                            "sexual_assault",
                            "domestic_violence",
                            "stalking",
                            "verbal_abuse",
                            "theft",
                            "assault",
                        ].map((cat) => (
                            <button
                                key={cat}
                                onClick={() => setCategoryFilter(cat)}
                                className={`px-3 py-1.5 rounded-full text-[10px] font-bold font-['DM_Sans'] uppercase transition-colors ${
                                    categoryFilter === cat
                                        ? "bg-[#1f295b] text-white"
                                        : "bg-white text-gray-500 border border-gray-200"
                                }`}>
                                {cat
                                    ? cat.replace("_", " ")
                                    : "All Categories"}
                            </button>
                        ))}
                    </div>
                )}
            </div>

            {/* Report Cards */}
            <div className="w-full max-w-sm px-4 mt-5 space-y-3">
                {loading ? (
                    <div className="text-center py-12 text-gray-400 text-sm font-['DM_Sans']">
                        Loading reports...
                    </div>
                ) : filteredReports.length === 0 ? (
                    <div className="text-center py-12">
                        <div className="text-gray-300 text-4xl mb-3">📋</div>
                        <div className="text-gray-400 text-sm font-['DM_Sans']">
                            No reports found
                        </div>
                    </div>
                ) : (
                    filteredReports.map((report) => {
                        const badge = getStatusBadge(report.status)
                        return (
                            <div
                                key={report.id}
                                className={`w-full bg-white rounded-xl shadow-[0px_0px_3px_0px_rgba(0,0,0,0.08)] border-l-[5px] ${badge.border} p-4 relative`}>
                                {/* Top row: ref code + severity badge + status */}
                                <div className="flex items-center justify-between mb-2">
                                    <div className="flex items-center gap-2">
                                        <span className="text-gray-400 text-[10px] font-bold font-['DM_Sans'] tracking-wider">
                                            {report.reference_code ||
                                                `SF-${report.id}`}
                                        </span>
                                        <div
                                            className={`w-2 h-2 rounded-full ${getSeverityColor(report.severity)}`}
                                            title={report.severity}
                                        />
                                    </div>
                                    <span
                                        className={`px-2 py-0.5 ${badge.bg} ${badge.text} text-[8px] font-bold font-['DM_Sans'] rounded tracking-wider`}>
                                        {badge.label}
                                    </span>
                                </div>

                                {/* Title & Category */}
                                <div className="mb-2">
                                    <div className="text-zinc-800 text-sm font-bold font-['DM_Sans'] leading-tight mb-1">
                                        {report.title || "Untitled Report"}
                                    </div>
                                    <span className="px-2 py-0.5 bg-gray-100 rounded text-gray-500 text-[9px] font-bold font-['DM_Sans'] uppercase">
                                        {report.category
                                            ?.replace("_", " ")
                                            .toUpperCase() || "REPORT"}
                                    </span>
                                </div>

                                {/* Location */}
                                <div className="text-gray-400 text-[11px] font-normal font-['DM_Sans'] flex items-center gap-1.5 mb-3">
                                    <MapPin className="w-3 h-3" />
                                    {report.location?.barangay ||
                                        report.location?.city ||
                                        "General Santos City"}
                                </div>

                                {/* Description preview */}
                                <div className="text-gray-400 text-[10px] font-normal font-['DM_Sans'] leading-relaxed mb-3 line-clamp-2">
                                    {report.description}
                                </div>

                                {/* Footer: date + actions */}
                                <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                                    <div className="flex flex-col">
                                        <span className="text-gray-400 text-[10px] font-['DM_Sans']">
                                            {formatDate(report.created_at)}
                                        </span>
                                        <span className="text-gray-300 text-[9px] font-['DM_Sans']">
                                            {formatTime(report.created_at)}
                                        </span>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        {report.status === "pending_review" && (
                                            <>
                                                <button
                                                    onClick={() =>
                                                        handleDismiss(report.id)
                                                    }
                                                    className="h-7 px-3 bg-red-50 hover:bg-red-100 transition-colors rounded-lg flex items-center gap-1.5"
                                                    title="Dismiss">
                                                    <XCircle className="w-3 h-3 text-red-500" />
                                                    <span className="text-red-500 text-[10px] font-bold font-['DM_Sans']">
                                                        Dismiss
                                                    </span>
                                                </button>
                                                <button
                                                    onClick={() =>
                                                        handleApprove(report.id)
                                                    }
                                                    className="h-7 px-3 bg-[#1f295b] hover:bg-[#151c3d] transition-colors rounded-lg flex items-center gap-1.5"
                                                    title="Approve">
                                                    <CheckCircle className="w-3 h-3 text-white" />
                                                    <span className="text-white text-[10px] font-bold font-['DM_Sans']">
                                                        Approve
                                                    </span>
                                                </button>
                                            </>
                                        )}
                                        {report.status !== "pending_review" && (
                                            <button className="h-7 px-3 bg-[#eff6ff] hover:bg-blue-100 transition-colors rounded-lg flex items-center gap-1.5">
                                                <Eye className="w-3 h-3 text-[#1e3a8a]" />
                                                <span className="text-[#1e3a8a] text-[10px] font-bold font-['DM_Sans']">
                                                    View
                                                </span>
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )
                    })
                )}
            </div>

            <div className="h-28"></div>

            <AdminBottomNav activeTab="queue" />

            {/* Back Button */}
            <button
                onClick={handleLogout}
                className="absolute top-4 left-4 p-2 flex items-center gap-2 text-gray-600 hover:text-blue-900">
                <img src={backImg} alt="Back" className="w-5 h-5" />
            </button>
        </div>
    )
}

export default AdminQueuePage
