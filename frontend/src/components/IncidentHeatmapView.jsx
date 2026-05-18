import { Map, useMap } from '@/components/ui/map'
import { useEffect } from 'react'

function HeatLayer({ points }) {
  const { map } = useMap()

  useEffect(() => {
    if (!map || !points || points.length === 0) return

    const sourceId = 'heatmap-source'
    const layerId = 'heatmap-layer'

    // Transform points to GeoJSON
    const geojsonData = {
      type: 'FeatureCollection',
      features: points.map(p => ({
        type: 'Feature',
        geometry: {
          type: 'Point',
          coordinates: [p.lng, p.lat]
        },
        properties: {
          intensity: p.intensity
        }
      }))
    }

    map.addSource(sourceId, {
      type: 'geojson',
      data: geojsonData
    })

    map.addLayer({
      id: layerId,
      type: 'heatmap',
      source: sourceId,
      maxzoom: 17,
      paint: {
        'heatmap-weight': [
          'interpolate',
          ['linear'],
          ['get', 'intensity'],
          0, 0,
          1, 1
        ],
        'heatmap-intensity': [
          'interpolate',
          ['linear'],
          ['zoom'],
          0, 1,
          17, 3
        ],
        'heatmap-color': [
          'interpolate',
          ['linear'],
          ['heatmap-density'],
          0, 'rgba(30, 58, 138, 0)',
          0.2, '#1e3a8a', // deep blue - sparse
          0.4, '#f59e0b', // amber - warning
          0.7, '#ef4444', // red - critical
          1, '#7f1d1d' // dark red - extreme
        ],
        'heatmap-radius': [
          'interpolate',
          ['linear'],
          ['zoom'],
          0, 15,
          17, 30
        ],
        'heatmap-opacity': [
          'interpolate',
          ['linear'],
          ['zoom'],
          14, 1,
          17, 0.8
        ]
      }
    })

    return () => {
      if (map.getLayer(layerId)) map.removeLayer(layerId)
      if (map.getSource(sourceId)) map.removeSource(sourceId)
    }
  }, [points, map])

  return null
}

function IncidentHeatmapView({ heatPoints = [] }) {
  return (
    <Map
      viewport={{ center: [125.1667, 6.1167], zoom: 12 }}
      className="h-full w-full pointer-events-none"
      theme="light"
      interactive={false}
    >
      <HeatLayer points={heatPoints} />
    </Map>
  )
}

export default IncidentHeatmapView
