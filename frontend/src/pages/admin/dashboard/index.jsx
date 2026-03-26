import { useState } from "react"
import AdminLayout from "../../../components/admin/AdminLayout"
import DashboardStats from "./DashboardStats"
import NeedReviewSection from "./NeedReviewSection"
import AuditFeedPreview from "./AuditFeedPreview"
import StaffManagement from "./StaffManagement"
import SystemAnnouncement from "./SystemAnnouncement"
import { AlertTriangle, User, AlertCircle, LogIn, Edit2, Shield } from "lucide-react"

// Mock Data to match Figma
const MOCK_STATS = {
    total: 1284,
    pending: 42,
}

const MOCK_REPORTS = [
    {
        id: "SF-8294",
        code: "SF-8294",
        category: "HARASSMENT",
        categoryBg: "bg-red-100",
        categoryColor: "text-red-500",
        title: "Lagao Public Market Incident",
        location: "General Santos City",
        time: "14 mins ago",
        borderColor: "border-red-500",
        icon: AlertTriangle,
        iconBg: "bg-red-100",
        iconColor: "text-red-500",
    },
    {
        id: "SF-8291",
        code: "SF-8291",
        category: "PHYSICAL ASSAULT",
        categoryBg: "bg-red-100",
        categoryColor: "text-red-500",
        title: "GSC Bulaong Terminal",
        location: "Bulaong Ave, General Santos City",
        time: "28 mins ago",
        borderColor: "border-red-500",
        icon: User,
        iconBg: "bg-red-100",
        iconColor: "text-red-500",
    },
    {
        id: "SF-8288",
        code: "SF-8288",
        category: "STALKING",
        categoryBg: "bg-amber-100",
        categoryColor: "text-amber-500",
        title: "Mindanao State University",
        location: "Dadiangas, General Santos City",
        time: "1 hour ago",
        borderColor: "border-amber-400",
        icon: User,
        iconBg: "bg-amber-100",
        iconColor: "text-amber-500",
    },
]

const MOCK_AUDIT = [
    {
        icon: Shield,
        iconBg: "bg-blue-50",
        iconColor: "text-blue-600",
        description: "Admin-04 approved Case #SF-8291",
        time: "12:42 PM",
        tag: "SECURITY_ACTION"
    },
    {
        icon: Edit2,
        iconBg: "bg-gray-100",
        iconColor: "text-gray-500",
        description: "Staff-21 updated description for #SF-8110",
        time: "11:15 AM",
        tag: "META_UPDATE"
    },
    {
        icon: AlertCircle,
        iconBg: "bg-red-50",
        iconColor: "text-red-500",
        description: "System flagged #SF-8299 as duplicate",
        time: "10:02 AM",
        tag: "AUTO_MOD"
    },
    {
        icon: LogIn,
        iconBg: "bg-indigo-50",
        iconColor: "text-indigo-500",
        description: "Admin-01 signed into HQ Terminal",
        time: "08:00 AM",
        tag: "AUTH_EVENT"
    },
]

const MOCK_STAFF = [
    {
        empId: "EMP-ID: 8829 - X",
        status: "ACTIVE",
        name: "Linda Walker",
        role: "Administrator",
        email: "walkerlinda_safemapph@gmail.com"
    },
    {
        empId: "EMP-ID: 4412 - X",
        status: "ACTIVE",
        name: "Kristaffa Abaok",
        role: "Senior Developer",
        email: "kristaffa_safemaphph@gmail.com"
    },
    {
        empId: "EMP-ID: 9901 - X",
        status: "OFFLINE",
        name: "Elias Thorne",
        role: "Network Admin",
        email: "eliasthorne_safemaphph@gmail.com"
    }
]

function AdminDashboardPage() {
    return (
        <AdminLayout activeTab="dashboard">
            {/* Header Area */}
            <div className="w-full max-w-sm px-4">
                <div className="flex items-center justify-between">
                    <h1 className="text-zinc-800 text-lg font-extrabold font-['DM_Sans']">Dashboard</h1>
                    <div className="px-3 py-1 bg-green-50 rounded-full border border-green-200">
                        <span className="text-green-500 text-[9px] font-bold font-['DM_Sans']">All Systems Operational</span>
                    </div>
                </div>
            </div>

            <DashboardStats stats={MOCK_STATS} />
            <NeedReviewSection reports={MOCK_REPORTS} />
            <AuditFeedPreview events={MOCK_AUDIT} />
            <StaffManagement staffList={MOCK_STAFF} />
            <SystemAnnouncement 
                title="Internal Announcement" 
                message="System-wide maintenance scheduled for Saturday 02:00 UTC. Audit logs will remain active." 
            />

        </AdminLayout>
    )
}

export default AdminDashboardPage
