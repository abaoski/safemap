<<<<<<< Updated upstream
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import ZoomControls from './ZoomControls'
import RiskLegend from './RiskLegend'
=======
import { useEffect, useState } from "react"
import { API_BASE } from "@/lib/api-base"
import {
    Map,
    MapMarker,
    MarkerContent,
    MarkerPopup,
    MarkerTooltip,
} from "@/components/ui/map"
import { Hospital, Siren, Flame, Ambulance, AlertTriangle } from "lucide-react"
import ZoomControls from "./ZoomControls"
>>>>>>> Stashed changes

// Mock data for demonstration - General Santos City
const MOCK_REPORTS = [
  { id: 1, title: 'Theft Incident', category: 'theft', severity: 'high', lat: 6.1167, lng: 125.1667, status: 'approved_awareness' },
  { id: 2, title: 'Suspicious Activity', category: 'suspicious', severity: 'medium', lat: 6.105, lng: 125.175, status: 'verified_pnp' },
  { id: 3, title: 'Accident', category: 'accident', severity: 'low', lat: 6.125, lng: 125.16, status: 'approved_awareness' },
]

function MapView() {
  return (
    <MapContainer 
      center={[6.1167, 125.1667]} 
      zoom={12}
      className="h-full w-full"
      zoomControl={false}
      maxBounds={[[5.9, 124.9], [6.3, 125.4]]}
      maxBoundsViscosity={1.0}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <ZoomControls />
      <RiskLegend />
      {MOCK_REPORTS.map(report => (
        <Marker key={report.id} position={[report.lat, report.lng]}>
          <Popup>
            <div className="p-2">
              <h3 className="font-semibold">{report.title}</h3>
              <p className="text-sm text-gray-600 capitalize">{report.category}</p>
              <span className={`inline-block px-2 py-1 text-xs rounded mt-2 ${
                report.severity === 'high' ? 'bg-red-100 text-red-800' :
                report.severity === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                'bg-blue-100 text-blue-800'
              }`}>
                {report.severity}
              </span>
            </div>
<<<<<<< Updated upstream
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  )
=======
            {/* tail */}
            <div
                style={{
                    width: 0,
                    height: 0,
                    borderLeft: "6px solid transparent",
                    borderRight: "6px solid transparent",
                    borderTop: `8px solid ${cfg.color}`,
                    marginTop: -1,
                }}
            />
        </div>
    )
}

// Neon aura circle — used for incidents
function IncidentPin({ severity, status }) {
    const isResolved = status === "verified" || status === "verified_pnp"
    const cfg = isResolved
        ? SEVERITY_CONFIG.low
        : SEVERITY_CONFIG[severity] || SEVERITY_CONFIG.medium
    return (
        <div
            style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: 44,
                height: 44,
            }}>
            {/* outer aura ring */}
            <div
                style={{
                    position: "absolute",
                    width: 44,
                    height: 44,
                    borderRadius: "50%",
                    background: cfg.aura,
                    boxShadow: `0 0 16px 6px ${cfg.aura}`,
                    animation: "pulse 2s ease-in-out infinite",
                }}
            />
            {/* inner glow ring */}
            <div
                style={{
                    position: "absolute",
                    width: 32,
                    height: 32,
                    borderRadius: "50%",
                    border: `2px solid ${cfg.color}`,
                    boxShadow: `0 0 10px ${cfg.glow}, inset 0 0 6px ${cfg.aura}`,
                }}
            />
            {/* core dot */}
            <div
                style={{
                    position: "absolute",
                    width: 16,
                    height: 16,
                    borderRadius: "50%",
                    background: cfg.color,
                    boxShadow: `0 0 8px ${cfg.glow}, 0 0 16px ${cfg.glow}`,
                }}
            />
        </div>
    )
}

function PopupCard({ title, subtitle, badge, badgeBg, status, extra }) {
    // Status badge colors
    const statusColors = {
        pending_review: "bg-yellow-500",
        in_progress: "bg-green-500",
        verified: "bg-green-600",
        verified_pnp: "bg-green-600",
        dismissed: "bg-gray-500",
        false_report: "bg-red-600",
        spam: "bg-orange-600",
    }

    const statusLabels = {
        pending_review: "Pending",
        in_progress: "In Progress",
        verified: "Resolved",
        verified_pnp: "Verified",
        dismissed: "Dismissed",
        false_report: "False Report",
        spam: "Spam",
    }

    return (
        <div className="min-w-45 p-1">
            <p className="font-bold text-[#1f295b] text-sm leading-tight mb-1">
                {title}
            </p>
            {subtitle && (
                <p className="text-gray-500 text-xs mb-1.5">{subtitle}</p>
            )}
            <div className="flex flex-wrap gap-1 mb-1">
                {badge && (
                    <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase text-white ${badgeBg}`}>
                        {badge}
                    </span>
                )}
                {status && (
                    <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase text-white ${statusColors[status] || "bg-gray-500"}`}>
                        {statusLabels[status] || status}
                    </span>
                )}
            </div>
            {extra && <p className="text-gray-400 text-[10px]">{extra}</p>}
        </div>
    )
}

// ── Main component ───────────────────────────────────────────────────────────

function MapView({ activeFilter }) {
    const [reports, setReports] = useState([])

    useEffect(() => {
        fetch(`${API_BASE}/reports/public`)
            .then(r => (r.ok ? r.json() : { reports: [] }))
            .then(d => setReports(d.reports || []))
            .catch(() => { /* ignore */ })
    }, [])

    const SERVICE_TYPES = ["hospital", "police", "fire", "rescue"]
    const SEVERITY_TYPES = ["critical", "high", "medium", "low"]

    const isServiceFilter = SERVICE_TYPES.includes(activeFilter)
    const isSeverityFilter = SEVERITY_TYPES.includes(activeFilter)

    // Service markers: show all when no filter, show only type when service filter,
    // hide all when severity filter is active
    const filteredLocations = EMERGENCY_LOCATIONS.features.filter(f => {
        if (!activeFilter) return true
        if (isSeverityFilter) return false
        return f.properties.type === activeFilter
    })

    // Incident markers: show all when no filter, hide when service filter,
    // show only matching severity when severity filter is active
    const filteredReports = reports.filter(r => {
        if (!activeFilter) return true
        if (isServiceFilter) return false
        return r.severity === activeFilter
    })

    return (
        <Map
            center={[125.1667, 6.1167]}
            zoom={12}
            minZoom={11}
            maxZoom={18}
            maxBounds={[124.98, 6.02, 125.32, 6.28]}
            maxBoundsViscosity={1.0}
            theme="light"
            className="h-full w-full"
            styles={{
                light: "https://basemaps.cartocdn.com/gl/positron-gl-style/style.json",
                dark: "https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json",
            }}>
            <ZoomControls />

            {/* Emergency service markers */}
            {filteredLocations.map((f, i) => (
                <MapMarker
                    key={`svc-${i}`}
                    longitude={f.properties.lng}
                    latitude={f.properties.lat}>
                    <MarkerContent>
                        <ServicePin type={f.properties.type} />
                    </MarkerContent>
                    <MarkerTooltip>
                        <span className="font-semibold">
                            {f.properties.name}
                        </span>
                    </MarkerTooltip>
                    <MarkerPopup closeButton>
                        <PopupCard
                            title={f.properties.name}
                            subtitle={`📞 ${f.properties.contact}`}
                            badge={f.properties.type}
                            badgeBg={
                                f.properties.type === "hospital"
                                    ? "bg-[#0EA5E9]"
                                    : f.properties.type === "police"
                                      ? "bg-[#6366F1]"
                                      : f.properties.type === "fire"
                                        ? "bg-[#F97316]"
                                        : "bg-[#10B981]"
                            }
                        />
                    </MarkerPopup>
                </MapMarker>
            ))}

            {/* Incident report markers */}
            {filteredReports.map(report => (
                <MapMarker
                    key={`rpt-${report.id}`}
                    longitude={report.location.longitude}
                    latitude={report.location.latitude}>
                    <MarkerContent>
                        <IncidentPin
                            severity={report.severity}
                            status={report.status}
                        />
                    </MarkerContent>
                    <MarkerTooltip>
                        <span className="font-semibold">{report.title}</span>
                    </MarkerTooltip>
                    <MarkerPopup closeButton>
                        <PopupCard
                            title={report.title}
                            subtitle={
                                report.description ? report.description : "N/A"
                            }
                            badge={report.severity}
                            badgeBg={
                                report.severity === "critical"
                                    ? "bg-red-600"
                                    : report.severity === "high"
                                      ? "bg-orange-500"
                                      : report.severity === "medium"
                                        ? "bg-amber-400"
                                        : "bg-green-500"
                            }
                            status={report.status}
                            extra={new Date(
                                report.created_at,
                            ).toLocaleDateString()}
                        />
                    </MarkerPopup>
                </MapMarker>
            ))}
        </Map>
    )
>>>>>>> Stashed changes
}

export default MapView
