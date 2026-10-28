import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet"
import { StatusBadge } from "@/components/common/StatusBadge"
import { Button } from "@/components/ui/button"
import { DEFAULT_MAP_CENTER } from "@/lib/constants"
import { createTicketMarkerIcon } from "@/lib/map-icons"
import { getDaysOpen } from "@/lib/storage"
import type { Ticket } from "@/lib/types"
import { ExternalLink, Users } from "lucide-react"

interface HotspotMapProps {
  tickets: Ticket[]
  onSelectTicket: (ticket: Ticket) => void
}

export function HotspotMap({ tickets, onSelectTicket }: HotspotMapProps) {
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
                    className="mt-1 w-full cursor-pointer gap-1 text-[11px]"
                  >
                    Open Ticket Detail
                    <ExternalLink className="size-3" />
                  </Button>
                </div>
              </Popup>
            </Marker>
          )
        })}
      </MapContainer>

      {/* Map Legend */}
      <div className="pointer-events-none absolute right-2 bottom-2 z-[400] flex flex-wrap gap-2 rounded-lg border border-border/70 bg-background/95 p-2 text-[10px] shadow-sm backdrop-blur-xs">
        <span className="flex items-center gap-1">
          <span className="size-2 rounded-full bg-slate-500" /> Received
        </span>
        <span className="flex items-center gap-1">
          <span className="size-2 rounded-full bg-blue-600" /> Assigned
        </span>
        <span className="flex items-center gap-1">
          <span className="size-2 rounded-full bg-amber-500" /> In Progress
        </span>
        <span className="flex items-center gap-1">
          <span className="size-2 rounded-full bg-emerald-500" /> Resolved
        </span>
      </div>
    </div>
  )
}
