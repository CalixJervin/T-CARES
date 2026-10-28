import { useMemo } from "react"
import { BARANGAYS } from "@/lib/constants"
import type { Ticket } from "@/lib/types"
import { MapPin } from "lucide-react"

interface OpenTicketsByBarangayRankedProps {
  tickets: Ticket[]
}

export function OpenTicketsByBarangayRanked({
  tickets,
}: OpenTicketsByBarangayRankedProps) {
  const ranked = useMemo(() => {
    const list = BARANGAYS.map((bgy) => {
      const bgyTickets = tickets.filter((t) => t.barangay === bgy)
      const openTickets = bgyTickets.filter((t) => t.status !== "resolved")
      const totalReports = openTickets.reduce(
        (sum, t) => sum + t.reports.length,
        0
      )
      return {
        barangay: bgy,
        openTicketsCount: openTickets.length,
        totalReports,
      }
    })

    return list.sort((a, b) => b.openTicketsCount - a.openTicketsCount)
  }, [tickets])

  const maxCount = Math.max(...ranked.map((r) => r.openTicketsCount), 1)

  return (
    <div className="rounded-xl border border-border bg-card p-4 shadow-xs">
      <div className="mb-3">
        <h3 className="flex items-center gap-1.5 text-xs font-bold tracking-wider text-foreground uppercase">
          <MapPin className="size-3.5 text-primary" />
          Open Tickets by Barangay (Planning / Resource Allocation)
        </h3>
        <p className="text-[11px] text-muted-foreground">
          Ranked list of Tuguegarao areas with active, uncompleted civic reports
        </p>
      </div>

      <div className="space-y-2.5">
        {ranked.map((item, idx) => {
          const pct = Math.round((item.openTicketsCount / maxCount) * 100)
          return (
            <div key={item.barangay} className="space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="flex items-center gap-1.5 font-semibold text-foreground">
                  <span className="w-4 font-mono text-[10px] text-muted-foreground">
                    #{idx + 1}
                  </span>
                  {item.barangay}
                </span>
                <span className="text-[11px] text-muted-foreground">
                  <strong className="text-foreground">
                    {item.openTicketsCount}
                  </strong>{" "}
                  open tickets ({item.totalReports} complaints)
                </span>
              </div>
              <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                <div
                  className="h-full rounded-full bg-amber-500 transition-all duration-500"
                  style={{
                    width: `${item.openTicketsCount === 0 ? 0 : Math.max(pct, 6)}%`,
                  }}
                />
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
