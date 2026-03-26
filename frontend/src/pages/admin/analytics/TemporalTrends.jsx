function TemporalTrends() {
    return (
        <div className="w-full bg-white rounded-xl shadow-sm border border-gray-100 py-4 px-5">
            <h2 className="text-zinc-800 text-[15px] font-extrabold font-['DM_Sans'] leading-tight">
                Temporal Case Trends
            </h2>
            <p className="text-gray-400 text-[10px] font-normal font-['DM_Sans'] mb-4">
                Comparison of reported cases vs resolution velocity
            </p>

            <div className="flex gap-4 mb-6">
                <div className="flex items-center gap-1.5">
                    <div className="w-2 h-2 rounded-full bg-[#1e3a8a]" />
                    <span className="text-gray-400 text-[10px] font-medium font-['DM_Sans']">New Reports</span>
                </div>
                <div className="flex items-center gap-1.5">
                    <div className="w-2 h-2 rounded-full border border-[#1e3a8a] bg-white" />
                    <span className="text-gray-400 text-[10px] font-medium font-['DM_Sans']">Resolved Cases</span>
                </div>
            </div>

            <div className="relative h-[200px] w-full flex items-end justify-between px-2">
                <div className="absolute inset-0 flex flex-col justify-between p-0 m-0 z-0">
                    {[100, 80, 60, 40, 20, 0].map((val) => (
                        <div key={val} className="w-full flex items-center gap-2">
                            <span className="text-gray-400 text-[9px] w-4 text-right mb-[1px]">{val}</span>
                            <div className="flex-1 h-[1px] border-b border-dashed border-gray-200" />
                        </div>
                    ))}
                </div>
                <div className="relative z-10 w-full h-[180px] flex items-end justify-around ml-6">
                    {[20, 40, 60, 35, 75, 55].map((h, i) => (
                        <div key={i} className="w-4 bg-[#1e3a8a] rounded-t-sm" style={{ height: `${h}%` }} />
                    ))}
                </div>
            </div>

            <div className="flex justify-around ml-6 mt-2 pb-1 border-b border-gray-200">
                {["Jan", "Feb", "Mar", "Apr", "May", "Jun"].map((m) => (
                    <span key={m} className="text-gray-500 text-[9px] font-['DM_Sans']">{m}</span>
                ))}
            </div>
            <div className="flex justify-center items-center mt-2.5 gap-1.5">
                <div className="w-1.5 h-1.5 bg-[#1e3a8a]" />
                <span className="text-gray-500 text-[9px] font-['DM_Sans']">2026</span>
            </div>
        </div>
    )
}

export default TemporalTrends
