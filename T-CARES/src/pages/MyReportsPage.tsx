import { useMemo, useState } from "react"
import { Link } from "react-router-dom"
import { CategoryBadge } from "@/components/common/CategoryBadge"
import { StatusBadge } from "@/components/common/StatusBadge"
import { Button } from "@/components/ui/button"
import { useApp } from "@/context/AppContext"
import {
  getDaysOpen,
  getQueuedReports,
  markNotificationRead,
} from "@/lib/storage"
import type { QueuedReport, Ticket } from "@/lib/types"
import {
  Calendar,
  ChevronDown,
  ChevronRight,
  Clock,
  ExternalLink,
  FileText,
  MapPin,
  PlusCircle,
  Sparkles,
  Users,
} from "lucide-react"

export function MyReportsPage() {
  const { tickets, reporterId, notifications, refreshData } = useApp()
  const [selectedTicketId, setSelectedTicketId] = useState<string | null>(null)

  // Get offline queued reports
  const queuedReports: QueuedReport[] = getQueuedReports()

  // Get tickets the user reported or follows
  const userTickets = useMemo(() => {
    return tickets.filter(
      (t) =>
        t.followers.includes(reporterId) ||
        t.reports.some((r) => r.reporterId === reporterId)
    )
  }, [tickets, reporterId])

  // Track which tickets have unread notifications
  const updatedTicketIds = useMemo(() => {
    const unread = notifications.filter((n) => !n.read)
    return new Set(unread.map((n) => n.ticketId))
  }, [notifications])

  const handleOpenTimeline = (ticket: Ticket) => {
    setSelectedTicketId((prev) => (prev === ticket.id ? null : ticket.id))
    // Mark notifications for this ticket as read
    const relevantNotifs = notifications.filter(
      (n) => n.ticketId === ticket.id && !n.read
    )
    relevantNotifs.forEach((n) => markNotificationRead(n.id))
    if (relevantNotifs.length > 0) {
      refreshData()
    }
  }

  return (
    <main className="mx-auto max-w-md p-4 pb-24 sm:p-6">
      {/* Header */}
      <div className="mb-5 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-foreground">
            My Reports & Follows
          </h1>
          <p className="mt-0.5 text-xs text-muted-foreground">
            Real-time status updates for issues you reported or joined.
          </p>
        </div>
        <Link to="/">
          <Button
            size="sm"
            className="cursor-pointer gap-1.5 text-xs font-semibold"
          >
            <PlusCircle className="size-3.5" />
            New
          </Button>
        </Link>
      </div>

      {/* Offline Pending Sync Queue Items */}
      {queuedReports.length > 0 && (
        <div className="mb-4 space-y-2">
          <div className="flex items-center gap-1.5 text-[11px] font-semibold tracking-wider text-amber-600 uppercase dark:text-amber-400">
            <Clock className="size-3.5" />
            Pending Synchronization ({queuedReports.length})
          </div>
          {queuedReports.map((q) => (
            <div
              key={q.id}
              className="rounded-xl border border-amber-500/40 bg-amber-500/5 p-3.5 shadow-xs"
            >
              <div className="flex items-start justify-between">
                <div>
                  <span className="rounded-full border border-amber-500/30 bg-amber-500/20 px-2 py-0.5 text-[10px] font-bold text-amber-600 dark:text-amber-400">
                    Pending sync
                  </span>
                  <div className="mt-1 text-xs font-semibold text-foreground">
                    {q.barangay} • {q.landmark || "Location pinned"}
                  </div>
                </div>
                <CategoryBadge category={q.category} />
              </div>
              <p className="mt-2 text-xs text-muted-foreground italic">
                {q.description
                  ? `"${q.description}"`
                  : "No description provided"}
              </p>
              <div className="mt-2 text-[10px] text-muted-foreground">
                Will be submitted automatically when device is online.
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Ticket List */}
      {userTickets.length === 0 && queuedReports.length === 0 ? (
        <div className="rounded-2xl border border-border bg-card p-8 text-center shadow-xs">
          <div className="mx-auto mb-3 flex size-12 items-center justify-center rounded-full bg-muted text-muted-foreground">
            <FileText className="size-6" />
          </div>
          <h3 className="text-sm font-semibold text-foreground">
            No reports yet
          </h3>
          <p className="mx-auto mt-1 max-w-xs text-xs leading-relaxed text-muted-foreground">
            When you submit a civic issue or follow an existing ticket, you will
            track live status updates here.
          </p>
          <div className="mt-4">
            <Link to="/">
              <Button className="cursor-pointer gap-2 text-xs">
                <PlusCircle className="size-4" />
                File your first complaint
              </Button>
            </Link>
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          {userTickets.map((ticket) => {
            const isUpdated = updatedTicketIds.has(ticket.id)
            const daysOpen = getDaysOpen(ticket)
            const isSelected = selectedTicketId === ticket.id
            const isOverdue = daysOpen > 7 && ticket.status !== "resolved"

            return (
              <div
                key={ticket.id}
                className={`overflow-hidden rounded-xl border bg-card shadow-xs transition-all duration-200 ${
                  isUpdated
                    ? "border-emerald-500/60 ring-2 ring-emerald-500/20"
                    : "border-border hover:border-border/80"
                }`}
              >
                {/* Clickable Card Header */}
                <button
                  type="button"
                  onClick={() => handleOpenTimeline(ticket)}
                  className="flex w-full cursor-pointer flex-col gap-2.5 p-4 text-left"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-primary">
                        {ticket.id}
                      </span>
                      {isUpdated && (
                        <span className="flex animate-pulse items-center gap-1 rounded-full bg-emerald-500 px-2 py-0.5 text-[10px] font-bold text-white shadow-xs">
                          <Sparkles className="size-2.5" />
                          Updated
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-1.5">
                      <StatusBadge status={ticket.status} />
                      {isSelected ? (
                        <ChevronDown className="size-4 text-muted-foreground" />
                      ) : (
                        <ChevronRight className="size-4 text-muted-foreground" />
                      )}
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs">
                    <span className="flex items-center gap-1 font-medium text-foreground">
                      <MapPin className="size-3 text-muted-foreground" />
                      {ticket.barangay}
                    </span>
                    <CategoryBadge category={ticket.category} />
                  </div>

                  {ticket.reports[0]?.description && (
                    <div className="line-clamp-1 text-xs text-muted-foreground italic">
                      &quot;{ticket.reports[0].description}&quot;
                    </div>
                  )}

                  <div className="flex items-center justify-between border-t border-border/60 pt-2 text-[11px] text-muted-foreground">
                    <span className="flex items-center gap-1 font-semibold text-foreground">
                      <Users className="size-3 text-primary" />
                      {ticket.reports.length}{" "}
                      {ticket.reports.length === 1 ? "person" : "people"}{" "}
                      reported this
                    </span>
                    <span
                      className={`flex items-center gap-1 ${
                        isOverdue
                          ? "font-bold text-red-500"
                          : "text-muted-foreground"
                      }`}
                    >
                      <Calendar className="size-3" />
                      {daysOpen} day{daysOpen === 1 ? "" : "s"} open
                    </span>
                  </div>
                </button>

                {/* Expanded Status Timeline */}
                {isSelected && (
                  <div className="animate-in space-y-4 border-t border-border/80 bg-muted/30 p-4 duration-200 fade-in">
                    <div className="flex items-center justify-between">
                      <div className="text-xs font-bold tracking-wider text-foreground uppercase">
                        Status Timeline
                      </div>
                      <Link
                        to={`/t/${ticket.id}`}
                        className="flex items-center gap-1 text-[11px] font-medium text-primary hover:underline"
                      >
                        Public link
                        <ExternalLink className="size-3" />
                      </Link>
                    </div>

                    {/* Timeline entries */}
                    <div className="relative space-y-4 pl-6 before:absolute before:top-2 before:bottom-2 before:left-2 before:w-0.5 before:bg-border">
                      {ticket.history.map((h, idx) => (
                        <div key={idx} className="relative">
                          {/* Dot */}
                          <div className="absolute top-1 -left-6 flex size-4 items-center justify-center rounded-full border-2 border-primary bg-background">
                            <div className="size-1.5 rounded-full bg-primary" />
                          </div>

                          <div>
                            <div className="flex items-center gap-2">
                              <StatusBadge status={h.status} />
                              <span className="font-mono text-[10px] text-muted-foreground">
                                {new Date(h.at).toLocaleDateString("en-US", {
                                  month: "short",
                                  day: "numeric",
                                  hour: "2-digit",
                                  minute: "2-digit",
                                })}
                              </span>
                            </div>
                            {h.note && (
                              <p className="mt-1 rounded-md border border-border/50 bg-background/80 p-2 text-xs text-foreground">
                                {h.note}
                              </p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Department Assignment Info */}
                    {ticket.department && (
                      <div className="rounded-lg border border-border bg-background p-2.5 text-xs">
                        <span className="text-muted-foreground">
                          Assigned Department:{" "}
                        </span>
                        <strong className="text-foreground">
                          {ticket.department}
                        </strong>
                      </div>
                    )}

                    {/* Reports on this master ticket */}
                    <div className="rounded-lg border border-border/60 bg-background/80 p-2.5 text-xs">
                      <div className="mb-1 font-semibold text-foreground">
                        Reports bundled: {ticket.reports.length}
                      </div>
                      <p className="text-[11px] text-muted-foreground">
                        Your report is actively combined with other civic inputs
                        to give city leaders accurate density metrics.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}
    </main>
  )
}
