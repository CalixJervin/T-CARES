import { Link, useParams } from "react-router-dom"
import { CategoryBadge } from "@/components/common/CategoryBadge"
import { StatusBadge } from "@/components/common/StatusBadge"
import { Button } from "@/components/ui/button"
import { useApp } from "@/context/AppContext"
import { getDaysOpen } from "@/lib/storage"
import {
  ArrowLeft,
  Building2,
  Clock,
  Eye,
  MapPin,
  ShieldCheck,
  Users,
} from "lucide-react"

export function PublicTicketPage() {
  const { id } = useParams<{ id: string }>()
  const { tickets } = useApp()

  const ticket = tickets.find(
    (t) => t.id.toLowerCase() === (id || "").toLowerCase()
  )

  if (!ticket) {
    return (
      <main className="mx-auto max-w-lg p-6 text-center">
        <div className="rounded-2xl border border-border bg-card p-8">
          <h2 className="text-lg font-bold text-foreground">
            Ticket Not Found
          </h2>
          <p className="mt-2 text-xs text-muted-foreground">
            Ticket ID &quot;{id}&quot; does not exist or has been removed.
          </p>
          <div className="mt-4">
            <Link to="/">
              <Button size="sm" className="cursor-pointer gap-2 text-xs">
                <ArrowLeft className="size-4" />
                Return to Citizen Portal
              </Button>
            </Link>
          </div>
        </div>
      </main>
    )
  }

  const daysOpen = getDaysOpen(ticket)
  const isOverdue = daysOpen > 7 && ticket.status !== "resolved"

  return (
    <main className="mx-auto max-w-xl animate-in p-4 pb-20 duration-200 fade-in sm:p-6">
      {/* Top back button */}
      <div className="mb-4 flex items-center justify-between">
        <Link
          to="/"
          className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="size-3.5" />
          Back to Reports
        </Link>
        <span className="flex items-center gap-1 rounded bg-muted px-2 py-0.5 text-[11px] font-medium text-muted-foreground">
          <ShieldCheck className="size-3 text-emerald-500" />
          Public Transparency Record
        </span>
      </div>

      <div className="space-y-5 rounded-2xl border border-border bg-card p-5 shadow-xs sm:p-6">
        {/* Header */}
        <div className="flex flex-col justify-between gap-3 border-b border-border/80 pb-4 sm:flex-row sm:items-center">
          <div>
            <div className="font-mono text-[11px] font-bold tracking-wider text-muted-foreground uppercase">
              City Action Ticket
            </div>
            <h1 className="font-mono text-2xl font-extrabold tracking-tight text-foreground">
              {ticket.id}
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <StatusBadge status={ticket.status} showTagalog />
          </div>
        </div>

        {/* Aggregate overview grid */}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <div className="rounded-xl border border-border/70 bg-muted/40 p-3">
            <div className="text-[10px] font-bold text-muted-foreground uppercase">
              Category
            </div>
            <div className="mt-1">
              <CategoryBadge category={ticket.category} variant="short" />
            </div>
          </div>

          <div className="rounded-xl border border-border/70 bg-muted/40 p-3">
            <div className="flex items-center gap-1 text-[10px] font-bold text-muted-foreground uppercase">
              <MapPin className="size-3" />
              Barangay
            </div>
            <div className="mt-1 truncate text-xs font-semibold text-foreground">
              {ticket.barangay}
            </div>
          </div>

          <div className="rounded-xl border border-border/70 bg-muted/40 p-3">
            <div className="flex items-center gap-1 text-[10px] font-bold text-muted-foreground uppercase">
              <Users className="size-3" />
              Citizen Reports
            </div>
            <div className="mt-1 text-sm font-bold text-foreground">
              {ticket.reports.length}{" "}
              <span className="text-[10px] font-normal text-muted-foreground">
                merged
              </span>
            </div>
          </div>

          <div className="rounded-xl border border-border/70 bg-muted/40 p-3">
            <div className="flex items-center gap-1 text-[10px] font-bold text-muted-foreground uppercase">
              <Clock className="size-3" />
              Days Open
            </div>
            <div
              className={`mt-1 text-sm font-bold ${
                isOverdue ? "font-extrabold text-red-500" : "text-foreground"
              }`}
            >
              {daysOpen} {daysOpen === 1 ? "day" : "days"}
            </div>
          </div>
        </div>

        {/* Department Info */}
        <div className="flex items-center justify-between rounded-xl border border-border bg-muted/20 px-4 py-3 text-xs">
          <div className="flex items-center gap-2">
            <Building2 className="size-4 text-primary" />
            <span className="text-muted-foreground">Assigned Department:</span>
          </div>
          <span className="font-semibold text-foreground">
            {ticket.department || "Pending Assignment"}
          </span>
        </div>

        {/* Public Timeline */}
        <div>
          <h2 className="mb-3 text-xs font-bold tracking-wider text-foreground uppercase">
            Official Audit Timeline
          </h2>
          <div className="relative space-y-4 pl-6 before:absolute before:top-2 before:bottom-2 before:left-2 before:w-0.5 before:bg-border">
            {ticket.history.map((h, i) => (
              <div key={i} className="relative">
                <div className="absolute top-1 -left-6 flex size-4 items-center justify-center rounded-full border-2 border-primary bg-background">
                  <div className="size-1.5 rounded-full bg-primary" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <StatusBadge status={h.status} />
                    <span className="font-mono text-[11px] text-muted-foreground">
                      {new Date(h.at).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                  {h.note && (
                    <p className="mt-1 rounded-md border border-border/40 bg-muted/60 p-2 text-xs text-foreground">
                      {h.note}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Privacy Note */}
        <div className="rounded-xl border border-border/60 bg-muted/30 p-3 text-center text-[11px] text-muted-foreground">
          <Eye className="mr-1 inline size-3.5 text-primary" />
          Public transparency record. Individual citizen identities and contact
          details are strictly protected under Tuguegarao Data Privacy Rules.
        </div>
      </div>
    </main>
  )
}
