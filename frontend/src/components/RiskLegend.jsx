function RiskLegend() {
  return (
    <div className="absolute top-4 left-4 z-1000 bg-white/90 rounded-lg shadow-lg p-3">
      <div className="text-xs font-bold text-gray-500 mb-2">RISK DENSITY</div>
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-red-500 rounded-full" />
          <span className="text-xs">High Risk</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-yellow-500 rounded-full" />
          <span className="text-xs">Medium</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-green-500 rounded-full" />
          <span className="text-xs">Low Risk</span>
        </div>
      </div>
    </div>
  )
}

export default RiskLegend
