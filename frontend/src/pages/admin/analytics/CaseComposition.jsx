function CaseComposition() {
    const items = [
        { label: "PHYSICAL ABUSE", pct: 34, color: "bg-[#1e3a8a]" },
        { label: "NEGLECT / ABANDONMENT", pct: 28, color: "bg-[#9ca3af]" },
        { label: "ECONOMIC EXPLOITATION", pct: 22, color: "bg-[#9ca3af]" },
        { label: "PSYCHOLOGICAL", pct: 15, color: "bg-[#1e3a8a]" },
    ]

    return (
        <div className="w-full bg-white rounded-xl shadow-sm border border-gray-100 py-4 px-5">
            <h2 className="text-zinc-800 text-[15px] font-extrabold font-['DM_Sans'] leading-tight mb-4">
                Case Composition
            </h2>
            <div className="space-y-4">
                {items.map((item) => (
                    <div key={item.label}>
                        <div className="flex justify-between items-center mb-1">
                            <span className="text-zinc-800 text-[10px] font-bold font-['DM_Sans'] uppercase">{item.label}</span>
                            <span className="text-[#1e3a8a] text-[11px] font-extrabold font-['DM_Sans']">{item.pct}%</span>
                        </div>
                        <div className="w-full h-1.5 bg-gray-100 rounded-full">
                            <div className={`h-full ${item.color} rounded-full`} style={{ width: `${item.pct}%` }} />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default CaseComposition
