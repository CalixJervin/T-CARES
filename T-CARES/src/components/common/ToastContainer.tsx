import { useApp } from "@/context/AppContext"
import { AlertCircle, CheckCircle2, Info, X } from "lucide-react"

export function ToastContainer() {
  const { toasts, removeToast } = useApp()

  if (toasts.length === 0) return null

  return (
    <div className="pointer-events-none fixed right-4 bottom-4 z-50 flex max-w-sm flex-col gap-2">
      {toasts.map((toast) => {
        const isSuccess = toast.variant === "success"
        const isDestructive = toast.variant === "destructive"
        const isWarning = toast.variant === "warning"

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto flex animate-in items-start gap-3 rounded-lg border p-3.5 shadow-lg backdrop-blur-md transition-all duration-300 fade-in slide-in-from-bottom-2 ${
              isSuccess
                ? "border-emerald-500/40 bg-emerald-950/90 text-emerald-100"
                : isDestructive
                  ? "border-red-500/40 bg-red-950/90 text-red-100"
                  : isWarning
                    ? "border-amber-500/40 bg-amber-950/90 text-amber-100"
                    : "border-border bg-card/95 text-card-foreground"
            }`}
          >
            {isSuccess && (
              <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-emerald-400" />
            )}
            {isDestructive && (
              <AlertCircle className="mt-0.5 size-4 shrink-0 text-red-400" />
            )}
            {isWarning && (
              <AlertCircle className="mt-0.5 size-4 shrink-0 text-amber-400" />
            )}
            {!isSuccess && !isDestructive && !isWarning && (
              <Info className="mt-0.5 size-4 shrink-0 text-primary" />
            )}

            <div className="flex-1 text-xs">
              <div className="font-semibold">{toast.title}</div>
              {toast.description && (
                <div className="mt-0.5 text-xs leading-relaxed opacity-90">
                  {toast.description}
                </div>
              )}
            </div>

            <button
              onClick={() => removeToast(toast.id)}
              className="shrink-0 p-0.5 text-foreground/60 transition-colors hover:text-foreground"
              aria-label="Close notification"
            >
              <X className="size-3.5" />
            </button>
          </div>
        )
      })}
    </div>
  )
}
