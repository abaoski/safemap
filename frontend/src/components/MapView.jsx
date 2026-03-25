import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet'
import { useEffect } from 'react'
import L from 'leaflet'
import ZoomControls from './ZoomControls'

// Mock data for demonstration - General Santos City (GBV incidents only)
const MOCK_REPORTS = [
  { id: 1, title: 'Sexual Assault', category: 'sexual_assault', severity: 'high', lat: 6.1167, lng: 125.1667, status: 'approved_awareness' },
  { id: 2, title: 'Domestic Violence', category: 'domestic_violence', severity: 'high', lat: 6.105, lng: 125.175, status: 'verified_pnp' },
  { id: 3, title: 'Harassment', category: 'harassment', severity: 'medium', lat: 6.125, lng: 125.16, status: 'approved_awareness' },
]

// Emergency locations data with correct coordinates
const EMERGENCY_LOCATIONS = {
  "type": "FeatureCollection",
  "features": [
    { "type": "Feature", "properties": { "name": "Gensan Medical Center", "type": "hospital", "contact": "887-9898", "lat": 6.082848378647546, "lng": 125.14814878609288 } },
    { "type": "Feature", "properties": { "name": "St. Elizabeth Hospital", "type": "hospital", "contact": "552-3162 / 0919-071-9004", "lat": 6.1186906805198, "lng": 125.17990092527259 } },
    { "type": "Feature", "properties": { "name": "Mindanao Medical Center", "type": "hospital", "contact": "553-8207 / 554-9640", "lat": 6.128140973066608, "lng": 125.16013162335923 } },
    { "type": "Feature", "properties": { "name": "Dadiangas Medical Center", "type": "hospital", "contact": "0917-190-2561", "lat": 6.125146051208208, "lng": 125.17780208294442 } },
    { "type": "Feature", "properties": { "name": "Sarangani Bay Specialists Medical Center", "type": "hospital", "contact": "887-8888 / 0919-067-8395", "lat": 6.119403451074248, "lng": 125.14686598109384} },
    { "type": "Feature", "properties": { "name": "Gensan Doctors Hospital", "type": "hospital", "contact": "250-2777 / 0933-821-7257", "lat": 6.1205193798244775, "lng":  125.17829398294444 } },
    { "type": "Feature", "properties": { "name": "Dr. Jorge P. Royeca City Hospital", "type": "hospital", "contact": "552-2811 / 0912-376-2331", "lat": 6.1260614210312925,"lng": 125.18573462712328} },
    { "type": "Feature", "properties": { "name": "GSC Police Office", "type": "police", "contact": "552-5573 / 0998-598-7207", "lat": 6.110370865940478,  "lng": 125.16682861271755 } },
    { "type": "Feature", "properties": { "name": "Police Station 1 (Dad. East)", "type": "police", "contact": "0998-598-7208", "lat": 6.11432864656382, "lng": 125.17065885410874 } },
    { "type": "Feature", "properties": { "name": "Police Station 2 (Makar Wharf)", "type": "police", "contact": "0918-921-3580", "lat": 6.094686794224281,  "lng": 125.1546590847949 } },
    { "type": "Feature", "properties": { "name": "Police Station 3 (Lagao)", "type": "police", "contact": "0998-598-7212", "lat": 6.128284606756957,"lng": 125.19698807712341 } },
    { "type": "Feature", "properties": { "name": "Police Station 4 (San Isidro)", "type": "police", "contact": "0998-598-7214", "lat": 6.138473907635937, "lng": 125.16834834246667  } },
    { "type": "Feature", "properties": { "name": "Police Station 5", "type": "police", "contact": "0907-313-4517", "lat": 6.07269034380546, "lng": 125.14324851953891 } },
    { "type": "Feature", "properties": { "name": "Police Station 6 (Bula)", "type": "police", "contact": "0998-598-7218", "lat": 6.10762945266241, "lng": 125.1892411829445 } },
    { "type": "Feature", "properties": { "name": "Police Station 7 (Fatima)", "type": "police", "contact": "0998-598-7220", "lat": 6.076678872414175,  "lng": 125.12008103658187 } },
    { "type": "Feature", "properties": { "name": "Police Station 8 (Tinagacan)", "type": "police", "contact": "0998-598-7223", "lat": 6.211474069388708, "lng": 125.23810430568996 } },
    { "type": "Feature", "properties": { "name": "Police Station 9 (Mabuhay)", "type": "police", "contact": "0948-874-1661", "lat": 6.16148313283533,  "lng": 125.15958797130241 } },
    { "type": "Feature", "properties": { "name": "Police Station 10 (Calumpang)", "type": "police", "contact": "0999-548-9244", "lat": 6.080748468803172,  "lng": 125.13148385780974 } },
    { "type": "Feature", "properties": { "name": "Bureau of Fire Protection (BFP)", "type": "fire", "contact": "552-1160 / 0943-341-5561 / 160", "lat": 6.115633495787534, "lng": 125.1731673237921 } },
    { "type": "Feature", "properties": { "name": "CDRRMO Gensan", "type": "rescue", "contact": "552-3939 / 0943-461-4548", "lat": 6.113659178971407,  "lng": 125.17178537870461 } },
  ]
}

// Custom marker icons
const createIcon = (color) => L.divIcon({
  className: 'custom-marker',
  html: `<div style="background-color: ${color}; width: 24px; height: 24px; border-radius: 50%; border: 2px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3);"></div>`,
  iconSize: [24, 24],
  iconAnchor: [12, 12],
  popupAnchor: [0, -12]
})

const icons = {
  hospital: createIcon('#16A34A'),
  police: createIcon('#1E3A8A'),
  fire: createIcon('#F59E0B'),
  rescue: createIcon('#7C3AED'),
  vawc: createIcon('#EC4899')
}

// Component to handle map centering when search changes
function MapCenterHandler({ center }) {
  const map = useMap()
  
  useEffect(() => {
    if (center) {
      map.flyTo(center, 15, { duration: 1 })
    }
  }, [center, map])
  
  return null
}

function MapView({ activeFilter, searchQuery }) {
  // Get all searchable locations
  const allLocations = EMERGENCY_LOCATIONS.features.map(f => ({
    name: f.properties.name,
    type: f.properties.type,
    contact: f.properties.contact,
    lat: f.properties.lat,
    lng: f.properties.lng
  }))
  
  // Filter locations based on search query
  const getSearchResults = () => {
    if (!searchQuery || searchQuery.length < 2) return []
    const query = searchQuery.toLowerCase()
    return allLocations.filter(loc => 
      loc.name.toLowerCase().includes(query) ||
      loc.type.toLowerCase().includes(query)
    )
  }
  
  const searchResults = getSearchResults()
  const searchCenter = searchResults.length > 0 
    ? [searchResults[0].lat, searchResults[0].lng] 
    : null
  // Filter emergency locations based on active filter
  const getFilteredLocations = () => {
    if (!activeFilter) return EMERGENCY_LOCATIONS.features
    if (['hospital', 'police', 'fire', 'rescue'].includes(activeFilter)) {
      return EMERGENCY_LOCATIONS.features.filter(f => f.properties.type === activeFilter)
    }
    return EMERGENCY_LOCATIONS.features
  }

  return (
    <MapContainer 
      center={[6.1167, 125.1667]} 
      zoom={12}
      className="h-full w-full"
      zoomControl={false}
      maxBounds={[[5.9, 124.9], [6.3, 125.4]]}
      maxBoundsViscosity={1.0}
    >
      <MapCenterHandler center={searchCenter} />
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <ZoomControls />
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
      {/* Search Results Markers */}
      {searchResults.map((loc, index) => (
        <Marker 
          key={`search-${index}`}
          position={[loc.lat, loc.lng]}
          icon={L.divIcon({
            className: 'custom-marker',
            html: `<div style="background-color: #EF4444; width: 32px; height: 32px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 8px rgba(239,68,68,0.5); display: flex; align-items: center; justify-content: center; font-size: 14px;">🔍</div>`,
            iconSize: [32, 32],
            iconAnchor: [16, 16],
            popupAnchor: [0, -16]
          })}
        >
          <Popup>
            <div className="p-1 min-w-[150px]">
              <h3 className="font-bold text-sm">{loc.name}</h3>
              <p className="text-xs text-gray-600 capitalize">{loc.type}</p>
              <p className="text-xs mt-1">📞 {loc.contact}</p>
            </div>
          </Popup>
        </Marker>
      ))}
      {/* Emergency Location Markers */}
      {getFilteredLocations().map((feature, index) => (
        <Marker 
          key={`emergency-${index}`}
          position={[feature.properties.lat, feature.properties.lng]}
          icon={icons[feature.properties.type] || icons.hospital}
        >
          <Popup>
            <div className="p-1 min-w-[150px]">
              <h3 className="font-bold text-sm">{feature.properties.name}</h3>
              <p className="text-xs text-gray-600 capitalize">{feature.properties.type}</p>
              <p className="text-xs mt-1">📞 {feature.properties.contact}</p>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  )
}

export default MapView
