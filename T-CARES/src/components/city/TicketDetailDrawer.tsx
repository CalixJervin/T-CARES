import { useState } from "react"
import { StatusBadge } from "@/components/common/StatusBadge"
import { Button } from "@/components/ui/button"
import { useApp } from "@/context/AppContext"
import { DEPARTMENTS } from "@/lib/constants"
import { getDaysOpen, updateTicketStaff } from "@/lib/storage"
import type { Status, Ticket } from "@/lib/types"
import {
  Building2,
  Clock,
  Layers,
  MapPin,
  MessageSquare,
  Phone,
  Save,
  Users,
  X,
} from "lucide-react"

interface TicketDetailDrawerProps {
  ticket: Ticket
  onClose: () => void
}

export function TicketDetailDrawer({
  ticket,
  onClose,
}: TicketDetailDrawerProps) {
  const { addToast, refreshData } = useApp()
  const [status, setStatus] = useState<Status>(ticket.status)
  const [department, setDepartment] = useState<string>(ticket.department || "")
  const [note, setNote] = useState<string>("")
  const [isUpdating, setIsUpdating] = useState(false)

  const daysOpen = getDaysOpen(ticket)
  const isOverdue = daysOpen > 7 && ticket.status !== "resolved"

  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault()
    setIsUpdating(true)
    try {
      const updated = updateTicketStaff(ticket.id, {
        status,
        department: department || undefined,
        note: note.trim() || undefined,
      })

      refreshData()
      setNote("")
      addToast({
        title: `Ticket ${ticket.id} Updated`,
        description: `Status: ${updated.status}. Follower alerts triggered.`,
        variant: "success",
      })
    } catch {
      addToast({
        title: "Update failed",
        description: "Could not save ticket modifications.",
        variant: "destructive",
      })
    } finally {
      setIsUpdating(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex animate-in justify-end bg-black/60 backdrop-blur-xs duration-200 fade-in">
      <div
        className="flex h-full w-full max-w-xl animate-in flex-col overflow-hidden border-l border-border bg-card shadow-2xl duration-300 slide-in-from-right"
        role="dialog"
        aria-modal="true"
      >
        {/* Drawer Header */}
        <div className="flex items-center justify-between border-b border-border bg-muted/40 p-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-base font-extrabold text-primary">
                {ticket.id}
              </span>
              <StatusBadge status={ticket.status} />
              {isOverdue && (
                <span className="rounded border border-red-500/20 bg-red-500/10 px-2 py-0.5 text-[10px] font-bold text-red-500">
                  Overdue (&gt;7d)
                </span>
              )}
            </div>
            <div className="mt-0.5 flex items-center gap-1.5 text-xs text-muted-foreground">
              <MapPin className="size-3" />
              <span>{ticket.barangay}</span>
              <span>•</span>
              <span className="capitalize">
                {ticket.category.replace(/_/g, " ")}
              </span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="cursor-pointer rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            aria-label="Close drawer"
          >
            <X className="size-5" />
          </button>
        </div>

        {/* Drawer Body */}
        <div className="flex-1 space-y-5 overflow-y-auto p-4 sm:p-5">
          {/* Prominent Master Ticket Highlight */}
          <div className="rounded-xl border border-primary/30 bg-primary/5 p-4 shadow-xs">
            <div className="flex items-center gap-2 text-primary">
              <Layers className="size-4" />
              <span className="text-xs font-bold tracking-wider uppercase">
                One Master Ticket — Merged Civic Reports
              </span>
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-2xl font-black text-foreground">
                {ticket.reports.length}
              </span>
              <span className="text-xs font-semibold text-muted-foreground">
                citizen complaint{ticket.reports.length === 1 ? "" : "s"} merged
                here
              </span>
            </div>
            <p className="mt-1 text-[11px] leading-relaxed text-muted-foreground">
              Instead of generating separate duplicate tickets for each citizen,
              CityAction clusters nearby reports into this single master ticket.
              All {ticket.followers.length} citizen followers receive updates.
            </p>
          </div>

          {/* Staff Action Box */}
          <form
            onSubmit={handleUpdate}
            className="space-y-3 rounded-xl border border-border bg-card p-4 shadow-xs"
          >
            <div className="flex items-center gap-1.5 text-xs font-bold tracking-wider text-foreground uppercase">
              <Building2 className="size-3.5 text-primary" />
              Staff Resolution Controls
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div>
                <label className="mb-1 block text-[11px] font-semibold text-foreground">
                  Assign Department
                </label>
                <select
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  className="w-full cursor-pointer rounded-lg border border-border bg-background px-3 py-1.5 text-xs text-foreground focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none"
                >
                  <option value="">-- Select Department --</option>
                  {DEPARTMENTS.map((dept) => (
                    <option key={dept} value={dept}>
                      {dept}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-1 block text-[11px] font-semibold text-foreground">
                  Ticket Status
                </label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as Status)}
                  className="w-full cursor-pointer rounded-lg border border-border bg-background px-3 py-1.5 text-xs text-foreground focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none"
                >
                  <option value="received">Received</option>
                  <option value="assigned">Assigned</option>
                  <option value="in_progress">In Progress</option>
                  <option value="resolved">Resolved</option>
                </select>
              </div>
            </div>

            <div>
              <label className="mb-1 block text-[11px] font-semibold text-foreground">
                Resolution Note / Action Log (Dispatched to followers)
              </label>
              <input
                type="text"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="e.g. Electrical crew assigned to replace 250W bulb."
                className="w-full rounded-lg border border-border bg-background px-3 py-1.5 text-xs text-foreground focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none"
              />
            </div>

            <Button
              type="submit"
              disabled={isUpdating}
              className="h-9 w-full cursor-pointer gap-2 bg-primary text-xs font-bold text-primary-foreground shadow-xs hover:bg-primary/90"
            >
              <Save className="size-3.5" />
              {isUpdating
                ? "Saving..."
                : "Update Master Ticket & Notify Followers"}
            </Button>
          </form>

          {/* Merged Reports List */}
          <div>
            <div className="mb-2 flex items-center justify-between">
              <h4 className="flex items-center gap-1.5 text-xs font-bold tracking-wider text-foreground uppercase">
                <Users className="size-3.5 text-primary" />
                Merged Citizen Reports ({ticket.reports.length})
              </h4>
            </div>

            <div className="space-y-3">
              {ticket.reports.map((report, idx) => (
                <div
                  key={report.id || idx}
                  className="space-y-2 rounded-xl border border-border bg-muted/30 p-3 text-xs"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[10px] font-semibold text-primary">
                      Report #{idx + 1} ({report.id})
                    </span>
                    <span className="font-mono text-[10px] text-muted-foreground">
                      {new Date(report.createdAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>

                  {report.photo && (
                    <div className="aspect-video w-full max-w-xs overflow-hidden rounded-lg border border-border/70 bg-black/10">
                      <img
                        src={report.photo}
                        alt="Citizen report photo"
                        className="h-full w-full object-cover"
                      />
                    </div>
                  )}

                  {report.description && (
                    <p className="text-foreground italic">
                      &quot;{report.description}&quot;
                    </p>
                  )}

                  {report.landmark && (
                    <div className="flex items-center gap-1 text-[11px] text-muted-foreground">
                      <MapPin className="size-3 shrink-0" />
                      Landmark: {report.landmark}
                    </div>
                  )}

                  {/* Staff Contact Access */}
                  <div className="flex items-center justify-between rounded-lg border border-border/60 bg-background p-2 text-[11px]">
                    <span className="text-muted-foreground">
                      Citizen contact:
                    </span>
                    <span className="flex items-center gap-1 font-semibold text-foreground">
                      {report.contactType === "phone" ? (
                        <Phone className="size-3 text-blue-500" />
                      ) : (
                        <MessageSquare className="size-3 text-blue-500" />
                      )}
                      {report.contact}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* History Timeline */}
          <div>
            <h4 className="mb-2 flex items-center gap-1.5 text-xs font-bold tracking-wider text-foreground uppercase">
              <Clock className="size-3.5 text-primary" />
              History Timeline
            </h4>
            <div className="relative space-y-3 pl-6 before:absolute before:top-2 before:bottom-2 before:left-2 before:w-0.5 before:bg-border">
              {ticket.history.map((h, i) => (
                <div key={i} className="relative">
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
                      <p className="mt-1 rounded border border-border/40 bg-muted/60 p-1.5 text-xs text-foreground">
                        {h.note}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
