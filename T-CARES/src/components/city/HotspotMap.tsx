import { useEffect } from "react"
import { MapContainer, Marker, Popup, TileLayer, useMap } from "react-leaflet"
import L from "leaflet"
import { StatusBadge } from "@/components/common/StatusBadge"
import { Button } from "@/components/ui/button"
import { DEFAULT_MAP_CENTER } from "@/lib/constants"
import { createTicketMarkerIcon } from "@/lib/map-icons"
import { getDaysOpen } from "@/lib/storage"
import type { Ticket } from "@/lib/types"
import { ExternalLink, Users } from "lucide-react"

interface HotspotMapProps {
  tickets: Ticket[]
  selectedTicketId?: string
  onSelectTicket: (ticket: Ticket) => void
}

function MapController({
  tickets,
  selectedTicketId,
}: {
  tickets: Ticket[]
  selectedTicketId?: string
}) {
  const map = useMap()

  // Invalidate map size so Leaflet tiles and viewport calculate correctly
  useEffect(() => {
    const timer = setTimeout(() => {
      map.invalidateSize()
    }, 150)
    return () => clearTimeout(timer)
  }, [map])

  // Center on selected ticket if requested
  useEffect(() => {
    if (!selectedTicketId) return
    const target = tickets.find((t) => t.id === selectedTicketId)
    if (target) {
      map.setView([target.lat, target.lng], 16, { animate: true })
    }
  }, [selectedTicketId, tickets, map])

  // Automatically fit bounds whenever the ticket collection updates
  useEffect(() => {
    if (selectedTicketId) return

    if (tickets.length === 0) {
      map.setView([DEFAULT_MAP_CENTER.lat, DEFAULT_MAP_CENTER.lng], 14, {
        animate: true,
      })
      return
    }

    if (tickets.length === 1) {
      map.setView([tickets[0].lat, tickets[0].lng], 15, { animate: true })
      return
    }

    const bounds = L.latLngBounds(tickets.map((t) => [t.lat, t.lng]))
    map.fitBounds(bounds, { padding: [50, 50], maxZoom: 16, animate: true })
  }, [tickets, selectedTicketId, map])

  return null
}

export function HotspotMap({
  tickets,
  selectedTicketId,
  onSelectTicket,
}: HotspotMapProps) {
  const center: [number, number] = [
    DEFAULT_MAP_CENTER.lat,
    DEFAULT_MAP_CENTER.lng,
  ]

  return (
    <div className="relative h-[360px] w-full overflow-hidden rounded-xl border border-border bg-card shadow-xs">
      <MapContainer
        center={center}
        zoom={14}
        scrollWheelZoom={false}
        className="z-0 h-full w-full"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <MapController
          tickets={tickets}
          selectedTicketId={selectedTicketId}
        />

        {tickets.map((t) => {
          const icon = createTicketMarkerIcon(t.status, t.reports.length)
          const days = getDaysOpen(t)
          const isOverdue = days > 7 && t.status !== "resolved"

          return (
            <Marker key={t.id} position={[t.lat, t.lng]} icon={icon}>
              <Popup className="city-map-popup">
                <div className="min-w-[200px] space-y-2 p-1">
                  <div className="flex items-center justify-between border-b pb-1">
                    <span className="font-mono text-xs font-bold text-primary">
                      {t.id}
                    </span>
                    <StatusBadge status={t.status} />
                  </div>

                  <div className="text-xs">
                    <div className="font-semibold text-foreground">
                      {t.barangay}
                    </div>
                    <div className="text-[11px] text-muted-foreground capitalize">
                      {t.category.replace(/_/g, " ")}
                    </div>
                  </div>

                  <div className="flex items-center justify-between rounded bg-muted/60 p-1.5 text-[11px]">
                    <span className="flex items-center gap-1 font-semibold">
                      <Users className="size-3 text-primary" />
                      {t.reports.length} report
                      {t.reports.length === 1 ? "" : "s"}
                    </span>
                    <span
                      className={`font-semibold ${
                        isOverdue ? "text-red-500" : "text-muted-foreground"
                      }`}
                    >
                      {days}d open
                    </span>
                  </div>

                  {t.reports[0]?.description && (
                    <p className="line-clamp-2 text-[11px] text-muted-foreground italic">
                      &quot;{t.reports[0].description}&quot;
                    </p>
                  )}

                  <Button
                    size="xs"
                    onClick={() => onSelectTicket(t)}
                    className="mt-1.5 w-full cursor-pointer gap-1 text-[11px] font-semibold"
                  >
                    Manage Ticket
                    <ExternalLink className="size-3" />
                  </Button>
                </div>
              </Popup>
            </Marker>
          )
        })}
      </MapContainer>
    </div>
  )
}
