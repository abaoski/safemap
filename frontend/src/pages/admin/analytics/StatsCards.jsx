function StatsCards({ stats }) {
    return (
        <div className="w-full max-w-sm px-4 mt-4 space-y-3">
            {/* Total Active Cases */}
            <div className="w-full h-[88px] bg-white rounded-xl shadow-[0px_0px_4px_0px_rgba(0,0,0,0.08)] border-l-[6px] border-green-500 px-5 relative flex flex-col justify-center">
                <div className="absolute top-4 right-4 px-2 py-0.5 bg-green-100 rounded text-green-500 text-[10px] font-bold font-['DM_Sans']">
                    +12%
                </div>
                <div className="text-gray-400 text-[11px] font-bold font-['DM_Sans'] uppercase">Total Active Cases</div>
                <div className="text-[#1e3a8a] text-[28px] font-extrabold font-['DM_Sans'] leading-none mt-1 mb-1">
                    {stats?.total || "1,284"}
                </div>
                <div className="text-gray-400 text-[10px] font-medium font-['DM_Sans']">Across all regional centers</div>
            </div>

            {/* High Urgency */}
            <div className="w-full h-[88px] bg-white rounded-xl shadow-[0px_0px_4px_0px_rgba(0,0,0,0.08)] border-l-[6px] border-green-500 px-5 relative flex flex-col justify-center">
                <div className="absolute top-4 right-4 px-2 py-0.5 bg-green-100 rounded text-green-500 text-[10px] font-bold font-['DM_Sans']">
                    +5.2%
                </div>
                <div className="text-gray-400 text-[11px] font-bold font-['DM_Sans'] uppercase">High Urgency</div>
                <div className="text-[#1e3a8a] text-[28px] font-extrabold font-['DM_Sans'] leading-none mt-1 mb-1">
                    {stats?.pending_review || "42"}
                </div>
                <div className="text-gray-400 text-[10px] font-medium font-['DM_Sans']">Requires immediate response</div>
            </div>

            {/* Avg. Response Time */}
            <div className="w-full h-[88px] bg-white rounded-xl shadow-[0px_0px_4px_0px_rgba(0,0,0,0.08)] border-l-[6px] border-red-500 px-5 relative flex flex-col justify-center">
                <div className="absolute top-4 right-4 px-2 py-0.5 bg-red-100 rounded text-red-500 text-[10px] font-bold font-['DM_Sans']">
                    -18m
                </div>
                <div className="text-gray-400 text-[11px] font-bold font-['DM_Sans'] uppercase">Avg. Response Time</div>
                <div className="text-[#1e3a8a] text-[28px] font-extrabold font-['DM_Sans'] leading-none mt-1 mb-1">2.4 hrs</div>
                <div className="text-gray-400 text-[10px] font-medium font-['DM_Sans']">First contact achievement</div>
            </div>

            {/* Resolution Rate */}
            <div className="w-full h-[88px] bg-white rounded-xl shadow-[0px_0px_4px_0px_rgba(0,0,0,0.08)] border-l-[6px] border-[#1e3a8a] px-5 relative flex flex-col justify-center">
                <div className="absolute top-4 right-4 px-2 py-0.5 bg-gray-200 rounded text-gray-500 text-[10px] font-bold font-['DM_Sans']">
                    94%
                </div>
                <div className="text-gray-400 text-[11px] font-bold font-['DM_Sans'] uppercase">Resolution Rate</div>
                <div className="text-[#1e3a8a] text-[28px] font-extrabold font-['DM_Sans'] leading-none mt-1 mb-1">88.5%</div>
                <div className="text-gray-400 text-[10px] font-medium font-['DM_Sans']">Completed case workflows</div>
            </div>
        </div>
    )
}

export default StatsCards
