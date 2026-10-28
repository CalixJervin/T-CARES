import { useApp } from "@/context/AppContext"
import { AlertCircle, WifiOff } from "lucide-react"

export function OfflineBanner() {
  const { isOnline, queuedCount } = useApp()

  if (isOnline && queuedCount === 0) return null

  if (!isOnline) {
    return (
      <div className="sticky top-0 z-40 flex items-center justify-between bg-amber-600 px-4 py-1.5 text-xs text-white shadow-sm">
        <div className="mx-auto flex w-full max-w-7xl items-center gap-2">
          <WifiOff className="size-3.5 shrink-0 animate-pulse" />
          <span className="font-medium">You are currently offline.</span>
          <span className="hidden text-amber-100 sm:inline">
            Reports will be saved to your device and submitted automatically
            once connection is restored.
          </span>
          {queuedCount > 0 && (
            <span className="ml-auto rounded-full bg-amber-800 px-2 py-0.5 font-mono text-[11px] font-semibold text-white">
              {queuedCount} pending sync
            </span>
          )}
        </div>
      </div>
    )
  }

  // If online but still reports in queue
  return (
    <div className="sticky top-0 z-40 flex items-center justify-between bg-blue-600 px-4 py-1.5 text-xs text-white">
      <div className="mx-auto flex w-full max-w-7xl items-center gap-2">
        <AlertCircle className="size-3.5 shrink-0" />
        <span className="font-medium">
          {queuedCount} report(s) pending sync.
        </span>
        <span className="hidden text-blue-100 sm:inline">
          Syncing with CityAction data store...
        </span>
      </div>
    </div>
  )
}
