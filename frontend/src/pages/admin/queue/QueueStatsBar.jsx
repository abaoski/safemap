function QueueStatsBar({ stats, statusFilter, setStatusFilter }) {
    const tabs = [
        {
            key: "pending_review",
            label: "Pending",
            count: stats.pending,
            color: "text-amber-500",
        },
        {
            key: "in_progress",
            label: "In Progress",
            count: stats.approved,
            color: "text-green-500",
        },
        {
            key: "dismissed",
            label: "Dismissed",
            count: stats.dismissed,
            color: "text-red-500",
        },
        { key: "", label: "All", count: stats.total, color: "text-[#1e3a8a]" },
    ]

  const handleTabClick = (key) => {
    setStatusFilter(key)
    if (setSearchQuery) setSearchQuery("")
  }

  return (
    <div className="mt-4">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 px-4">
        {tabs.map((t) => {
          const isActive = statusFilter === t.key
          return (
            <button
              key={t.key}
              onClick={() => handleTabClick(t.key)}
              className={`rounded-xl p-3 text-center transition-all duration-150 bg-white ${
                isActive
                  ? `shadow-md ring-2 ${t.activeRing} ring-offset-1`
                  : "shadow-sm border border-gray-100 hover:border-gray-200"
              }`}
            >
              <div
                className={`text-2xl font-extrabold font-['DM_Sans'] leading-none mb-1 ${isActive ? t.color : "text-slate-400"}`}
              >
                {t.count ?? 0}
              </div>
              <div
                className={`text-[9px] font-bold font-['DM_Sans'] uppercase tracking-wide ${
                  isActive ? t.color : "text-slate-400"
                }`}
              >
                {t.label}
              </div>
            </button>
          )
        })}
      </div>

      {/* Urgent indicator — shown only when there are urgent reports */}
      {stats.urgent > 0 && (
        <div className="mx-4 mt-3 flex items-center gap-2 px-3 py-2 bg-red-50 border border-red-200 rounded-xl">
          <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse shrink-0" />
          <span className="text-red-600 text-[11px] font-extrabold font-['DM_Sans'] uppercase tracking-wide">
            {stats.urgent} Urgent {stats.urgent === 1 ? "Report" : "Reports"} — Requires Immediate Attention
          </span>
        </div>
      )}
    </div>
  )
}

export default QueueStatsBar
