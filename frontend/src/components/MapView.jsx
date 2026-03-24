import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import ZoomControls from './ZoomControls'
import RiskLegend from './RiskLegend'

// Mock data for demonstration - General Santos City (GBV incidents only)
const MOCK_REPORTS = [
  { id: 1, title: 'Sexual Assault', category: 'sexual_assault', severity: 'high', lat: 6.1167, lng: 125.1667, status: 'approved_awareness' },
  { id: 2, title: 'Domestic Violence', category: 'domestic_violence', severity: 'high', lat: 6.105, lng: 125.175, status: 'verified_pnp' },
  { id: 3, title: 'Harassment', category: 'harassment', severity: 'medium', lat: 6.125, lng: 125.16, status: 'approved_awareness' },
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
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  )
}

export default MapView
