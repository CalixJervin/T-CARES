import { useEffect, useMemo, useRef } from "react"
import {
  MapContainer,
  Marker,
  TileLayer,
  useMap,
  useMapEvents,
} from "react-leaflet"
import L from "leaflet"
import { createLocationPinIcon } from "@/lib/map-icons"

interface LocationPickerMapProps {
  lat: number
  lng: number
  onChange: (lat: number, lng: number) => void
}

function MapUpdater({ lat, lng }: { lat: number; lng: number }) {
  const map = useMap()
  useEffect(() => {
    map.setView([lat, lng], map.getZoom(), { animate: true })
  }, [lat, lng, map])
  return null
}

function DraggableMarker({
  lat,
  lng,
  onChange,
}: {
  lat: number
  lng: number
  onChange: (lat: number, lng: number) => void
}) {
  const markerRef = useRef<L.Marker>(null)
  const icon = useMemo(() => createLocationPinIcon(), [])

  useMapEvents({
    click(e) {
      onChange(Number(e.latlng.lat.toFixed(6)), Number(e.latlng.lng.toFixed(6)))
    },
  })

  const eventHandlers = useMemo(
    () => ({
      dragend() {
        const marker = markerRef.current
        if (marker != null) {
          const latlng = marker.getLatLng()
          onChange(Number(latlng.lat.toFixed(6)), Number(latlng.lng.toFixed(6)))
        }
      },
    }),
    [onChange]
  )

  return (
    <Marker
      draggable={true}
      eventHandlers={eventHandlers}
      position={[lat, lng]}
      ref={markerRef}
      icon={icon}
    />
  )
}

export function LocationPickerMap({
  lat,
  lng,
  onChange,
}: LocationPickerMapProps) {
  return (
    <div className="relative h-48 w-full overflow-hidden rounded-xl border border-border shadow-xs">
      <MapContainer
        center={[lat, lng]}
        zoom={15}
        scrollWheelZoom={false}
        className="z-0 h-full w-full"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <MapUpdater lat={lat} lng={lng} />
        <DraggableMarker lat={lat} lng={lng} onChange={onChange} />
      </MapContainer>
      <div className="pointer-events-none absolute bottom-1.5 left-2 z-[400] rounded border border-border/50 bg-background/90 px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground backdrop-blur-xs">
        Tap map or drag pin to adjust
      </div>
    </div>
  )
}
