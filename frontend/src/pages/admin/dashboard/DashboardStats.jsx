function DashboardStats({ stats }) {
    return (
        <div className="w-full max-w-sm px-4 mt-6 space-y-3">
            {/* Active Cases */}
            <div className="w-full h-20 bg-white rounded-xl shadow-[0px_0px_10px_rgba(0,0,0,0.03)] border-l-[4px] border-[#00c853] flex flex-col justify-center px-5">
                <div className="text-gray-400 text-[10px] font-bold font-['DM_Sans'] mb-0.5">Active Cases</div>
                <div className="flex items-baseline gap-2">
                    <span className="text-[#1e3a8a] text-[28px] font-black font-['DM_Sans'] leading-none">
                        {stats?.total?.toLocaleString() || "1,284"}
                    </span>
                    <span className="text-[#00c853] text-[10px] font-bold font-['DM_Sans']">
                        General Santos
                    </span>
                </div>
            </div>

            {/* Pending Review */}
            <div className="w-full h-20 bg-white rounded-xl shadow-[0px_0px_10px_rgba(0,0,0,0.03)] border-l-[4px] border-[#f44336] flex flex-col justify-center px-5">
                <div className="text-gray-400 text-[10px] font-bold font-['DM_Sans'] mb-0.5">Pending Review</div>
                <div className="flex items-baseline gap-2">
                    <span className="text-[#1e3a8a] text-[28px] font-black font-['DM_Sans'] leading-none">
                        {stats?.pending || "42"}
                    </span>
                    <span className="text-[#f44336] text-[10px] font-bold font-['DM_Sans']">
                        High Urgency
                    </span>
                </div>
            </div>

            {/* Today's Report */}
            <div className="w-full h-20 bg-white rounded-xl shadow-[0px_0px_10px_rgba(0,0,0,0.03)] border-l-[4px] border-[#1e3a8a] flex flex-col justify-center px-5">
                <div className="text-gray-400 text-[10px] font-bold font-['DM_Sans'] mb-0.5">Today's Report</div>
                <div className="flex items-baseline gap-2">
                    <span className="text-[#1e3a8a] text-[28px] font-black font-['DM_Sans'] leading-none">
                        +12%
                    </span>
                    <span className="text-gray-500 text-[10px] font-bold font-['DM_Sans']">
                        vs Yesterday
                    </span>
                </div>
            </div>
        </div>
    )
}

export default DashboardStats
