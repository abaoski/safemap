import { AlertTriangle, User, MapPin, Eye } from "lucide-react"

function NeedReviewSection({ reports }) {
    return (
        <div className="w-full max-w-sm px-4 mt-8">
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-zinc-800 text-[15px] font-extrabold font-['DM_Sans']">
                    Need Review
                </h2>
                <button className="text-[#1e3a8a] text-xs font-bold font-['DM_Sans'] hover:underline">
                    View Queue
                </button>
            </div>

            <div className="space-y-4">
                {reports.map((report, idx) => (
                    <div
                        key={report.id || idx}
                        className={`w-full bg-white rounded-xl shadow-[0px_2px_8px_rgba(0,0,0,0.04)] border-l-[4px] p-4 flex gap-3 ${report.borderColor}`}>
                        {/* Status Icon */}
                        <div className="pt-1">
                            <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${report.iconBg}`}>
                                <report.icon className={`w-4 h-4 ${report.iconColor}`} />
                            </div>
                        </div>

                        <div className="flex-1">
                            {/* Header row (Code & Category) */}
                            <div className="flex items-center gap-2 mb-1.5">
                                <span className="text-gray-400 text-[10px] font-bold font-['DM_Sans']">
                                    {report.code}
                                </span>
                                <span className={`px-2 py-0.5 rounded text-[8px] font-bold font-['DM_Sans'] uppercase tracking-wider ${report.categoryBg} ${report.categoryColor}`}>
                                    {report.category}
                                </span>
                            </div>

                            {/* Title */}
                            <h3 className="text-zinc-800 text-[13px] font-bold font-['DM_Sans'] leading-tight mb-1.5">
                                {report.title}
                            </h3>

                            {/* Location */}
                            <div className="flex items-center gap-1.5 mb-3 text-gray-400 text-[10px] font-normal font-['DM_Sans']">
                                <MapPin className="w-3 h-3" />
                                {report.location}
                            </div>

                            {/* Footer (Time & Button) */}
                            <div className="flex items-center justify-between mt-1">
                                <span className="text-gray-400 text-[10px] font-normal font-['DM_Sans']">
                                    {report.time}
                                </span>
                                <button className="h-7 px-4 bg-[#1f295b] hover:bg-[#151c3d] transition-colors rounded-lg text-white text-[10px] font-bold font-['DM_Sans'] flex items-center justify-center">
                                    Review
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default NeedReviewSection
