import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react"
import {
  getNotifications,
  getQueuedReports,
  getReporterId,
  getTickets,
  processOfflineQueue,
  resetDemoData as storageResetDemoData,
} from "@/lib/storage"
import type { NotificationItem, Ticket } from "@/lib/types"

export interface ToastMessage {
  id: string
  title: string
  description?: string
  variant?: "default" | "success" | "warning" | "destructive"
}

interface AppContextType {
  isOnline: boolean
  tickets: Ticket[]
  reporterId: string
  queuedCount: number
  toasts: ToastMessage[]
  addToast: (toast: Omit<ToastMessage, "id">) => void
  removeToast: (id: string) => void
  refreshData: () => void
  resetDemo: () => void
  notifications: NotificationItem[]
  unreadNotificationsCount: number
}

const AppContext = createContext<AppContextType | undefined>(undefined)

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [isOnline, setIsOnline] = useState<boolean>(
    typeof navigator !== "undefined" ? navigator.onLine : true
  )
  const [tickets, setTickets] = useState<Ticket[]>(() => getTickets())
  const [reporterId] = useState<string>(() => getReporterId())
  const [queuedCount, setQueuedCount] = useState<number>(
    () => getQueuedReports().length
  )
  const [notifications, setNotifications] = useState<NotificationItem[]>(() =>
    getNotifications()
  )
  const [toasts, setToasts] = useState<ToastMessage[]>([])

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  const addToast = useCallback(
    (toast: Omit<ToastMessage, "id">) => {
      const id = "toast_" + Math.random().toString(36).substring(2, 9)
      setToasts((prev) => [...prev, { ...toast, id }])
      setTimeout(() => {
        removeToast(id)
      }, 5000)
    },
    [removeToast]
  )

  const refreshData = useCallback(() => {
    const updatedTickets = getTickets()
    setTickets(updatedTickets)
    setQueuedCount(getQueuedReports().length)
    setNotifications(getNotifications())
  }, [])

  const resetDemo = useCallback(() => {
    storageResetDemoData()
    refreshData()
    addToast({
      title: "Demo Data Reset",
      description: "Default 8 tickets and fresh state restored.",
      variant: "success",
    })
  }, [addToast, refreshData])

  // Track online/offline status
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true)
      const res = processOfflineQueue()
      if (res.processed > 0) {
        addToast({
          title: "Connection Restored",
          description: `Synced ${res.processed} pending report(s) automatically.`,
          variant: "success",
        })
      }
      refreshData()
    }

    const handleOffline = () => {
      setIsOnline(false)
      addToast({
        title: "Offline Mode Active",
        description:
          "Reports will be saved to your device and queued for sync.",
        variant: "warning",
      })
    }

    window.addEventListener("online", handleOnline)
    window.addEventListener("offline", handleOffline)

    return () => {
      window.removeEventListener("online", handleOnline)
      window.removeEventListener("offline", handleOffline)
    }
  }, [addToast, refreshData])

  // Track cross-tab and local storage updates
  useEffect(() => {
    const handleStorageChange = () => {
      refreshData()
      // If notifications were added and user is a follower
      const curNotifications = getNotifications()
      const userTickets = getTickets().filter(
        (t) =>
          t.followers.includes(reporterId) ||
          t.reports.some((r) => r.reporterId === reporterId)
      )
      const userTicketIds = new Set(userTickets.map((t) => t.id))

      const latest = curNotifications[0]
      if (
        latest &&
        !latest.read &&
        userTicketIds.has(latest.ticketId) &&
        Date.now() - new Date(latest.timestamp).getTime() < 3000
      ) {
        addToast({
          title: `Ticket ${latest.ticketId} Updated`,
          description: `Status changed to "${latest.newStatus}". ${latest.note ? `Note: "${latest.note}"` : ""}`,
          variant: "success",
        })
      }
    }

    window.addEventListener("storage", handleStorageChange as EventListener)
    window.addEventListener(
      "ca_data_changed",
      handleStorageChange as EventListener
    )

    return () => {
      window.removeEventListener(
        "storage",
        handleStorageChange as EventListener
      )
      window.removeEventListener(
        "ca_data_changed",
        handleStorageChange as EventListener
      )
    }
  }, [addToast, refreshData, reporterId])

  const unreadNotificationsCount = notifications.filter(
    (n) =>
      !n.read &&
      tickets.some(
        (t) =>
          t.id === n.ticketId &&
          (t.followers.includes(reporterId) ||
            t.reports.some((r) => r.reporterId === reporterId))
      )
  ).length

  return (
    <AppContext.Provider
      value={{
        isOnline,
        tickets,
        reporterId,
        queuedCount,
        toasts,
        addToast,
        removeToast,
        refreshData,
        resetDemo,
        notifications,
        unreadNotificationsCount,
      }}
    >
      {children}
    </AppContext.Provider>
  )
}

export function useApp() {
  const context = useContext(AppContext)
  if (!context) {
    throw new Error("useApp must be used within an AppProvider")
  }
  return context
}
