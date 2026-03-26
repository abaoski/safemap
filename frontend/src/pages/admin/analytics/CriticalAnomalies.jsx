function CriticalAnomalies() {
    const anomalies = [
        { date: "2023-08-14", time: "09:21", metric: "Hotspot Cluster\nDetected", region: "District 4", severity: "CRITICAL", severityBg: "bg-red-100", severityText: "text-red-500" },
        { date: "2023-08-14", time: "11:46", metric: "SLA Violation\nAlert", region: "District 2", severity: "WARNING", severityBg: "bg-yellow-100", severityText: "text-yellow-600" },
    ]

    return (
        <div className="w-full bg-white rounded-xl shadow-sm border border-gray-100 py-4 px-5">
            <h2 className="text-zinc-800 text-[15px] font-extrabold font-['DM_Sans'] leading-tight mb-4">
                Critical Anomalies & Priority Flags
            </h2>

            <div className="w-full">
                <div className="grid grid-cols-[80px_1fr_60px_60px] gap-2 pb-2 border-b border-gray-100">
                    {["Flag Time", "Metric Type", "Region", "Severity"].map((h) => (
                        <div key={h} className="text-gray-400 text-[9px] font-bold font-['DM_Sans']">{h}</div>
                    ))}
                </div>

                {anomalies.map((a, i) => (
                    <div key={i} className="grid grid-cols-[80px_1fr_60px_60px] gap-2 py-4 border-b border-gray-100 items-center">
                        <div className="text-zinc-800 text-[9px] font-medium font-['DM_Sans']">
                            {a.date}<br />{a.time}
                        </div>
                        <div className="text-[#1e3a8a] text-[10px] font-bold font-['DM_Sans'] leading-tight whitespace-pre-line">
                            {a.metric}
                        </div>
                        <div className="text-[#1e3a8a] text-[9px] font-medium font-['DM_Sans']">{a.region}</div>
                        <div>
                            <span className={`px-1.5 py-0.5 ${a.severityBg} ${a.severityText} text-[8px] font-bold font-['DM_Sans'] rounded`}>
                                {a.severity}
                            </span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default CriticalAnomalies
