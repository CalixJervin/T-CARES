import { useMemo, useState } from "react"
import { BARANGAYS } from "@/lib/constants"
import type { Ticket } from "@/lib/types"
import { pluralize, pluralizeWord } from "@/lib/utils"
import { ChevronDown, ChevronUp, MapPin } from "lucide-react"

interface OpenTicketsByBarangayRankedProps {
  tickets: Ticket[]
}

export function OpenTicketsByBarangayRanked({
  tickets,
}: OpenTicketsByBarangayRankedProps) {
  const [showZeroOpen, setShowZeroOpen] = useState(false)

  const { activeBarangays, zeroOpenBarangays, maxCount } = useMemo(() => {
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

    // Sort by open tickets descending, ties broken by report count descending
    list.sort((a, b) => {
      if (b.openTicketsCount !== a.openTicketsCount) {
        return b.openTicketsCount - a.openTicketsCount
      }
      return b.totalReports - a.totalReports
    })

    const active = list.filter((r) => r.openTicketsCount > 0)
    const zero = list.filter((r) => r.openTicketsCount === 0)
    const max = Math.max(...active.map((r) => r.openTicketsCount), 1)

    return {
      activeBarangays: active,
      zeroOpenBarangays: zero,
      maxCount: max,
    }
  }, [tickets])

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
        {activeBarangays.map((item, idx) => {
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
                  {pluralizeWord(item.openTicketsCount, "open ticket")} (
                  {pluralize(item.totalReports, "report")})
                </span>
              </div>
              <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                <div
                  className="h-full rounded-full bg-amber-500 transition-all duration-500"
                  style={{
                    width: `${Math.max(pct, 6)}%`,
                  }}
                />
              </div>
            </div>
          )
        })}

        {/* Collapsed zero-ticket barangays */}
        {zeroOpenBarangays.length > 0 && (
          <div className="border-t border-border/70 pt-2">
            <button
              type="button"
              onClick={() => setShowZeroOpen((prev) => !prev)}
              className="flex w-full cursor-pointer items-center justify-between rounded-lg px-2 py-1.5 text-xs text-muted-foreground transition-colors hover:bg-muted/50 hover:text-foreground"
            >
              <span>
                {pluralize(zeroOpenBarangays.length, "barangay", "barangays")}{" "}
                with no open tickets
              </span>
              {showZeroOpen ? (
                <ChevronUp className="size-3.5" />
              ) : (
                <ChevronDown className="size-3.5" />
              )}
            </button>
            {showZeroOpen && (
              <div className="mt-1.5 space-y-1 rounded-lg bg-muted/20 p-2.5">
                <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground sm:grid-cols-3">
                  {zeroOpenBarangays.map((bgy) => (
                    <div
                      key={bgy.barangay}
                      className="flex items-center gap-1.5 py-0.5"
                    >
                      <span className="size-1.5 rounded-full bg-emerald-500" />
                      <span>{bgy.barangay}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
