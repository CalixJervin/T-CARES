import { STATUS_META } from "@/lib/constants"
import type { Status } from "@/lib/types"

interface StatusBadgeProps {
  status: Status
  showTagalog?: boolean
  className?: string
}

export function StatusBadge({
  status,
  showTagalog = false,
  className = "",
}: StatusBadgeProps) {
  const meta = STATUS_META[status] || STATUS_META.received
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-semibold tracking-wide capitalize ${meta.badgeClass} ${className}`}
    >
      <span
        className="h-1.5 w-1.5 rounded-full"
        style={{ backgroundColor: meta.markerColor }}
      />
      <span>{meta.label}</span>
      {showTagalog && (
        <span className="text-[10px] opacity-70">({meta.tagalog})</span>
      )}
    </span>
  )
}
