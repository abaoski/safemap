import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import logoImg from "/src/assets/images/Logo.svg"
import backImg from "/src/assets/images/rpt_back.svg"
import { BellIcon } from "lucide-react"
import AdminBottomNav from "./AdminBottomNav"

/**
 * Derive up to 2-letter initials from a name string.
 * "Juan Dela Cruz" → "JD", "admin" → "AD"
 */
function getInitials(name) {
    if (!name) return "AD"
    const parts = name.trim().split(/\s+/)
    if (parts.length >= 2) {
        return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
    }
    return name.slice(0, 2).toUpperCase()
}

/**
 * Shared admin page layout.
 *
 * Props:
 *  - activeTab   : string key for AdminBottomNav highlight
 *  - children    : page-specific body content
 */
function AdminLayout({ activeTab, children }) {
    const navigate = useNavigate()
    const [user, setUser] = useState(null)

    useEffect(() => {
        const token = localStorage.getItem("token")
        if (!token) {
            navigate("/admin")
            return
        }
        try {
            const stored = localStorage.getItem("user")
            if (stored) setUser(JSON.parse(stored))
        } catch {
            /* ignore parse errors */
        }
    }, [navigate])

    const handleLogout = () => {
        localStorage.removeItem("token")
        localStorage.removeItem("user")
        navigate("/admin")
    }

    const avatarUrl = user?.avatar_url || user?.image_url || null
    const initials = getInitials(user?.name || user?.username)

    return (
        <div className="w-full min-h-screen bg-slate-50 overflow-x-hidden flex flex-col items-center">
            {/* Header */}
            <div className="w-full max-w-sm px-4 pt-8 pb-2">
                <div className="relative flex items-center justify-center mb-5">
                    <img className="h-12 w-auto" src={logoImg} alt="SafeMap" />
                    <div className="absolute right-0 flex items-center gap-2">
                        {/* Bell */}
                        <div className="w-8 h-8 bg-[#1f295b] rounded-lg flex items-center justify-center"></div>

                        {/* Avatar or Initials */}
                        {avatarUrl ? (
                            <img
                                className="w-8 h-8 rounded-full object-cover border-2 border-white shadow-sm"
                                src={avatarUrl}
                                alt="User"
                            />
                        ) : (
                            <div className="w-8 h-8 rounded-full bg-[#1e3a8a] border-2 border-white shadow-sm flex items-center justify-center">
                                <span className="text-white text-[10px] font-bold font-['DM_Sans'] leading-none">
                                    {initials}
                                </span>
                            </div>
                        )}
                    </div>
                </div>

                {/* Page content injected here — first child is typically the title row */}
            </div>

            {/* Page body */}
            {children}

            {/* Bottom spacer */}
            <div className="h-28" />

            {/* Bottom Navigation */}
            <AdminBottomNav activeTab={activeTab} />

            {/* Back / Logout Button */}
            <button
                onClick={handleLogout}
                className="absolute top-4 left-4 p-2 flex items-center gap-2 text-gray-600 hover:text-blue-900">
                <img src={backImg} alt="Back" className="w-5 h-5" />
            </button>
        </div>
    )
}

export default AdminLayout
