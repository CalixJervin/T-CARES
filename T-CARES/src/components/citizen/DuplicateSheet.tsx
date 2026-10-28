import { StatusBadge } from "@/components/common/StatusBadge"
import { Button } from "@/components/ui/button"
import { getDaysOpen } from "@/lib/storage"
import type { Ticket } from "@/lib/types"
import {
  AlertTriangle,
  Calendar,
  CheckCircle,
  CopyPlus,
  Users,
  X,
} from "lucide-react"

interface DuplicateSheetProps {
  existingTicket: Ticket
  distanceMeters: number
  onFollowExisting: () => void
  onCreateNew: () => void
  onCancel: () => void
}

export function DuplicateSheet({
  existingTicket,
  distanceMeters,
  onFollowExisting,
  onCreateNew,
  onCancel,
}: DuplicateSheetProps) {
  const daysOpen = getDaysOpen(existingTicket)
  const isOverdue = daysOpen > 7 && existingTicket.status !== "resolved"
  const firstPhoto =
    existingTicket.reports.find((r) => r.photo)?.photo ||
    existingTicket.reports[0]?.photo

  return (
    <div className="fixed inset-0 z-50 flex animate-in items-end justify-center bg-black/60 p-0 backdrop-blur-xs duration-200 fade-in sm:items-center sm:p-4">
      <div
        className="max-h-[92vh] w-full max-w-md animate-in overflow-y-auto rounded-t-2xl border border-border bg-card p-5 shadow-2xl duration-300 slide-in-from-bottom sm:rounded-2xl"
        role="dialog"
        aria-modal="true"
        aria-labelledby="dup-title"
      >
        {/* Header */}
        <div className="flex items-start justify-between border-b border-border/80 pb-3">
          <div className="flex items-center gap-2">
            <div className="flex size-8 items-center justify-center rounded-full bg-amber-500/10 text-amber-500">
              <AlertTriangle className="size-4" />
            </div>
            <div>
              <h2
                id="dup-title"
                className="text-base font-bold text-foreground"
              >
                Looks like this is already reported
              </h2>
              <p className="text-xs text-muted-foreground">
                An active ticket was found ~{distanceMeters}m away
              </p>
            </div>
          </div>
          <button
            onClick={onCancel}
            className="rounded-lg p-1 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            aria-label="Close"
          >
            <X className="size-4" />
          </button>
        </div>

        {/* Existing Ticket Preview */}
        <div className="my-4 space-y-3 rounded-xl border border-border bg-muted/40 p-3.5">
          <div className="flex items-center justify-between">
            <span className="font-mono text-xs font-bold text-primary">
              {existingTicket.id}
            </span>
            <StatusBadge status={existingTicket.status} />
          </div>

          {/* Photo */}
          {firstPhoto ? (
            <div className="relative aspect-video w-full overflow-hidden rounded-lg border border-border/80 bg-background">
              <img
                src={firstPhoto}
                alt="Existing report photo"
                className="h-full w-full object-cover"
              />
              <div className="absolute top-2 left-2 rounded bg-black/70 px-2 py-0.5 text-[10px] font-semibold text-white">
                Existing ticket photo
              </div>
            </div>
          ) : null}

          {/* Key metrics */}
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="flex items-center gap-1.5 rounded-lg border border-border/60 bg-background/80 p-2">
              <Users className="size-3.5 text-primary" />
              <div>
                <div className="font-bold text-foreground">
                  {existingTicket.reports.length} people
                </div>
                <div className="text-[10px] text-muted-foreground">
                  Already reported
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1.5 rounded-lg border border-border/60 bg-background/80 p-2">
              <Calendar className="size-3.5 text-muted-foreground" />
              <div>
                <div
                  className={`font-bold ${
                    isOverdue
                      ? "font-extrabold text-red-500"
                      : "text-foreground"
                  }`}
                >
                  {daysOpen} day{daysOpen === 1 ? "" : "s"} open
                </div>
                <div className="text-[10px] text-muted-foreground">
                  {isOverdue ? "Overdue (>7 days)" : "Under review"}
                </div>
              </div>
            </div>
          </div>

          {/* Description snippet */}
          {existingTicket.reports[0]?.description && (
            <div className="rounded-lg border border-border/50 bg-background/80 p-2 text-xs text-muted-foreground italic">
              &quot;{existingTicket.reports[0].description}&quot;
            </div>
          )}
        </div>

        <p className="mb-4 text-xs leading-relaxed text-muted-foreground">
          Joining this ticket groups your report with existing complaints,
          increases visibility for city engineers, and notifies you whenever its
          status changes.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col gap-2">
          <Button
            onClick={onFollowExisting}
            className="h-10 w-full cursor-pointer gap-2 bg-primary font-semibold text-primary-foreground shadow-xs hover:bg-primary/90"
          >
            <CheckCircle className="size-4" />
            Same issue, follow it (+1 report)
          </Button>

          <Button
            variant="outline"
            onClick={onCreateNew}
            className="h-10 w-full cursor-pointer gap-2 border-border text-foreground hover:bg-muted"
          >
            <CopyPlus className="size-4" />
            No, it&apos;s different (Create new ticket)
          </Button>
        </div>
      </div>
    </div>
  )
}
