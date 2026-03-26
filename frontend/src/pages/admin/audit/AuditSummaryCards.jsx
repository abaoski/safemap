import { CheckCircle, XCircle, Shield } from "lucide-react"

function AuditSummaryCards({ stats }) {
    return (
        <div className="w-full max-w-sm px-4 mt-4">
            <div className="grid grid-cols-3 gap-2">
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-3 text-center">
                    <CheckCircle className="w-5 h-5 text-green-500 mx-auto mb-1" />
                    <div className="text-lg font-extrabold font-['DM_Sans'] text-green-600">
                        {stats.approvals}
                    </div>
                    <div className="text-[8px] font-bold font-['DM_Sans'] uppercase text-gray-400">
                        Approved
                    </div>
                </div>
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-3 text-center">
                    <XCircle className="w-5 h-5 text-red-500 mx-auto mb-1" />
                    <div className="text-lg font-extrabold font-['DM_Sans'] text-red-500">
                        {stats.dismissals}
                    </div>
                    <div className="text-[8px] font-bold font-['DM_Sans'] uppercase text-gray-400">
                        Dismissed
                    </div>
                </div>
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-3 text-center">
                    <Shield className="w-5 h-5 text-[#1e3a8a] mx-auto mb-1" />
                    <div className="text-lg font-extrabold font-['DM_Sans'] text-[#1e3a8a]">
                        {stats.verifications}
                    </div>
                    <div className="text-[8px] font-bold font-['DM_Sans'] uppercase text-gray-400">
                        Verified
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AuditSummaryCards
