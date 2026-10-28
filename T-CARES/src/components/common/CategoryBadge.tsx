import { CATEGORIES } from "@/lib/constants"
import type { Category } from "@/lib/types"

interface CategoryBadgeProps {
  category: Category
  variant?: "short" | "full" | "tagalog"
  className?: string
}

export function CategoryBadge({
  category,
  variant = "short",
  className = "",
}: CategoryBadgeProps) {
  const meta = CATEGORIES[category] || CATEGORIES.other_services
  const text =
    variant === "full"
      ? meta.fullLabel
      : variant === "tagalog"
        ? meta.tagalog
        : meta.name

  return (
    <span
      className={`inline-flex items-center rounded-md border border-border/60 bg-secondary/80 px-2 py-0.5 text-xs font-medium text-secondary-foreground ${className}`}
    >
      {text}
    </span>
  )
}
