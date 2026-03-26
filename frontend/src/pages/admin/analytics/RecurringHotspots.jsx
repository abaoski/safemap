import { MapPin } from "lucide-react"

function RecurringHotspots() {
    return (
        <div className="w-full bg-white rounded-xl shadow-sm border border-gray-100 py-4 px-5">
            <div className="flex items-center gap-2 mb-5">
                <MapPin className="w-4 h-4 text-[#1e3a8a]" />
                <h2 className="text-zinc-800 text-[15px] font-extrabold font-['DM_Sans'] leading-tight">
                    Recurring Hotspots
                </h2>
            </div>

            <div className="space-y-5">
                <div className="border-l-[3px] border-red-500 pl-4 py-1 relative">
                    <div className="flex justify-between items-start mb-1">
                        <div>
                            <div className="text-zinc-800 text-xs font-bold font-['DM_Sans']">District 4 - Metro North</div>
                            <div className="text-gray-400 text-[10px] font-normal font-['DM_Sans']">Significant spike in repetitive abuse reports.</div>
                        </div>
                        <div className="px-2 py-0.5 bg-red-100 rounded text-red-500 text-[9px] font-bold font-['DM_Sans']">High Risk</div>
                    </div>
                    <div className="w-full h-1.5 bg-gray-100 rounded-full mt-2">
                        <div className="w-[85%] h-full bg-red-500 rounded-full" />
                    </div>
                </div>

                <div className="border-l-[3px] border-orange-400 pl-4 py-1 relative">
                    <div className="flex justify-between items-start mb-1">
                        <div>
                            <div className="text-zinc-800 text-xs font-bold font-['DM_Sans']">Coastal Zone B</div>
                            <div className="text-gray-400 text-[10px] font-normal font-['DM_Sans']">30% increase in child labor incidents.</div>
                        </div>
                        <div className="px-2 py-0.5 bg-orange-100 rounded text-orange-500 text-[9px] font-bold font-['DM_Sans']">Developing</div>
                    </div>
                    <div className="w-full h-1.5 bg-gray-100 rounded-full mt-2">
                        <div className="w-[60%] h-full bg-orange-400 rounded-full" />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default RecurringHotspots
