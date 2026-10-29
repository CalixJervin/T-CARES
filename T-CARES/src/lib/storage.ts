import { SEED_TICKETS } from "./seed"
import type {
  Category,
  NotificationItem,
  QueuedReport,
  Report,
  Status,
  Ticket,
} from "./types"

const STORAGE_KEYS = {
  TICKETS: "ca_tickets_v1",
  REPORTER_ID: "ca_reporter_id",
  QUEUE: "ca_offline_queue_v1",
  NOTIFICATIONS: "ca_notifications_v1",
  SEEN_STATUSES: "ca_seen_statuses_v1",
  SCHEMA_VERSION: "ca_schema_version",
}

const CURRENT_SCHEMA_VERSION = 3

export function haversineDistanceMeters(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371e3 // Earth's radius in meters
  const toRad = (deg: number) => (deg * Math.PI) / 180
  const dLat = toRad(lat2 - lat1)
  const dLon = toRad(lon2 - lon1)

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2)

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return R * c
}

export function getDaysOpen(ticket: Ticket): number {
  const start = new Date(ticket.createdAt).getTime()
  const end = ticket.resolvedAt
    ? new Date(ticket.resolvedAt).getTime()
    : Date.now()
  const diffMs = Math.max(0, end - start)
  return Math.max(1, Math.round(diffMs / (24 * 3600 * 1000)))
}

export function getReporterId(): string {
  try {
    let id = localStorage.getItem(STORAGE_KEYS.REPORTER_ID)
    if (!id) {
      id = "rep_" + Math.random().toString(36).substring(2, 9)
      localStorage.setItem(STORAGE_KEYS.REPORTER_ID, id)
    }
    return id
  } catch {
    return "rep_fallback"
  }
}

function notifyDataChange() {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent("ca_data_changed"))
  }
}

export function getTickets(): Ticket[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.TICKETS)
    const storedVersion = parseInt(
      localStorage.getItem(STORAGE_KEYS.SCHEMA_VERSION) || "1",
      10
    )

    // Reset to blank state on schema version bump
    if (!raw || storedVersion < CURRENT_SCHEMA_VERSION) {
      localStorage.setItem(STORAGE_KEYS.TICKETS, JSON.stringify(SEED_TICKETS))
      localStorage.removeItem(STORAGE_KEYS.QUEUE)
      localStorage.removeItem(STORAGE_KEYS.NOTIFICATIONS)
      localStorage.removeItem(STORAGE_KEYS.SEEN_STATUSES)
      localStorage.setItem(
        STORAGE_KEYS.SCHEMA_VERSION,
        CURRENT_SCHEMA_VERSION.toString()
      )
      return SEED_TICKETS
    }

    return JSON.parse(raw) as Ticket[]
  } catch (err) {
    console.error("Failed to load tickets from localStorage:", err)
    return SEED_TICKETS
  }
}

export function saveTickets(tickets: Ticket[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.TICKETS, JSON.stringify(tickets))
    notifyDataChange()
  } catch (err) {
    console.error("Failed to save tickets to localStorage:", err)
  }
}

export function getTicketById(id: string): Ticket | undefined {
  const tickets = getTickets()
  return tickets.find((t) => t.id.toLowerCase() === id.toLowerCase())
}

export function resetDemoData(): void {
  try {
    localStorage.setItem(STORAGE_KEYS.TICKETS, JSON.stringify(SEED_TICKETS))
    localStorage.setItem(
      STORAGE_KEYS.SCHEMA_VERSION,
      CURRENT_SCHEMA_VERSION.toString()
    )
    localStorage.removeItem(STORAGE_KEYS.QUEUE)
    localStorage.removeItem(STORAGE_KEYS.NOTIFICATIONS)
    localStorage.removeItem(STORAGE_KEYS.SEEN_STATUSES)
    notifyDataChange()
  } catch (err) {
    console.error("Failed to reset demo data:", err)
  }
}

export function findDuplicateTicket(
  category: Category,
  lat: number,
  lng: number,
  maxDistanceMeters = 50
): { ticket: Ticket; distance: number } | null {
  const tickets = getTickets()
  for (const ticket of tickets) {
    if (ticket.status === "resolved") continue
    if (ticket.category !== category) continue

    const distance = haversineDistanceMeters(lat, lng, ticket.lat, ticket.lng)
    if (distance <= maxDistanceMeters) {
      return { ticket, distance: Math.round(distance) }
    }
  }
  return null
}

export function addReportToTicket(
  ticketId: string,
  reportData: {
    description?: string
    landmark?: string
    photo?: string
    contactType: "phone" | "messenger"
    contact: string
  },
  reporterId: string
): { ticket: Ticket; report: Report } {
  const tickets = getTickets()
  const ticketIndex = tickets.findIndex((t) => t.id === ticketId)
  if (ticketIndex === -1) {
    throw new Error(`Ticket ${ticketId} not found`)
  }

  const ticket = tickets[ticketIndex]
  const report: Report = {
    id: `rep-${ticket.id}-${ticket.reports.length + 1}`,
    ticketId: ticket.id,
    createdAt: new Date().toISOString(),
    description: reportData.description,
    landmark: reportData.landmark,
    photo: reportData.photo,
    contactType: reportData.contactType,
    contact: reportData.contact,
    reporterId,
    synced: true,
  }

  ticket.reports.push(report)
  if (!ticket.followers.includes(reporterId)) {
    ticket.followers.push(reporterId)
  }

  tickets[ticketIndex] = ticket
  saveTickets(tickets)
  return { ticket, report }
}

export function createNewTicket(
  data: {
    category: Category
    barangay: string
    lat: number
    lng: number
    landmark?: string
    description?: string
    photo?: string
    contactType: "phone" | "messenger"
    contact: string
  },
  reporterId: string
): { ticket: Ticket; report: Report } {
  const tickets = getTickets()

  // Generate next ID like T-0009
  let maxNum = 0
  for (const t of tickets) {
    const match = t.id.match(/^T-(\d+)$/)
    if (match) {
      const num = parseInt(match[1], 10)
      if (num > maxNum) maxNum = num
    }
  }
  const nextId = `T-${String(maxNum + 1).padStart(4, "0")}`

  const report: Report = {
    id: `rep-${nextId}-1`,
    ticketId: nextId,
    createdAt: new Date().toISOString(),
    description: data.description,
    landmark: data.landmark,
    photo: data.photo,
    contactType: data.contactType,
    contact: data.contact,
    reporterId,
    synced: true,
  }

  const newTicket: Ticket = {
    id: nextId,
    category: data.category,
    barangay: data.barangay,
    lat: data.lat,
    lng: data.lng,
    status: "received",
    createdAt: new Date().toISOString(),
    reports: [report],
    followers: [reporterId],
    history: [
      {
        status: "received",
        note: "Initial complaint reported by citizen.",
        at: new Date().toISOString(),
      },
    ],
  }

  tickets.unshift(newTicket)
  saveTickets(tickets)
  return { ticket: newTicket, report }
}

export function updateTicketStaff(
  ticketId: string,
  updates: {
    status?: Status
    department?: string
    note?: string
  }
): Ticket {
  const tickets = getTickets()
  const ticketIndex = tickets.findIndex((t) => t.id === ticketId)
  if (ticketIndex === -1) {
    throw new Error(`Ticket ${ticketId} not found`)
  }

  const ticket = { ...tickets[ticketIndex] }
  const now = new Date().toISOString()
  const statusChanged = updates.status && updates.status !== ticket.status
  const oldStatus = ticket.status

  if (updates.department !== undefined) {
    ticket.department = updates.department
  }

  if (updates.status) {
    ticket.status = updates.status
    if (updates.status === "resolved") {
      ticket.resolvedAt = now
    } else {
      ticket.resolvedAt = undefined
    }
  }

  // Append history if status changed or note provided
  if (statusChanged || updates.note) {
    ticket.history.push({
      status: ticket.status,
      note:
        updates.note ||
        (statusChanged ? `Status updated to ${ticket.status}` : undefined),
      at: now,
    })
  }

  // Record notification for followers
  if (statusChanged) {
    recordNotification({
      id: "notif_" + Math.random().toString(36).substring(2, 9),
      ticketId: ticket.id,
      oldStatus,
      newStatus: ticket.status,
      note: updates.note,
      timestamp: now,
      read: false,
    })
  }

  tickets[ticketIndex] = ticket
  saveTickets(tickets)
  return ticket
}

// Notifications
export function getNotifications(): NotificationItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

export function recordNotification(item: NotificationItem): void {
  try {
    const list = getNotifications()
    list.unshift(item)
    localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(list))
    notifyDataChange()
  } catch (err) {
    console.error("Failed to record notification:", err)
  }
}

export function markNotificationRead(id: string): void {
  try {
    const list = getNotifications()
    const updated = list.map((n) => (n.id === id ? { ...n, read: true } : n))
    localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(updated))
    notifyDataChange()
  } catch (err) {
    console.error("Failed to mark notification read:", err)
  }
}

// Offline Queue
export function getQueuedReports(): QueuedReport[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.QUEUE)
    if (!raw) return []
    const parsed = JSON.parse(raw) as (QueuedReport & { category: string })[]
    let migrated = false
    const items: QueuedReport[] = parsed.map((q) => {
      if (q.category === ("streetlights_facilities" as string)) {
        migrated = true
        return { ...q, category: "streetlights" as Category }
      }
      return q as QueuedReport
    })
    if (migrated) {
      localStorage.setItem(STORAGE_KEYS.QUEUE, JSON.stringify(items))
    }
    return items
  } catch {
    return []
  }
}

export function enqueueReport(
  item: Omit<QueuedReport, "id" | "createdAt">
): QueuedReport {
  try {
    const queue = getQueuedReports()
    const queued: QueuedReport = {
      ...item,
      id: "q_" + Math.random().toString(36).substring(2, 9),
      createdAt: new Date().toISOString(),
    }
    queue.push(queued)
    localStorage.setItem(STORAGE_KEYS.QUEUE, JSON.stringify(queue))
    notifyDataChange()
    return queued
  } catch (err) {
    console.error("Failed to enqueue report:", err)
    throw err
  }
}

export function processOfflineQueue(): {
  processed: number
  results: { ticketId: string; wasDuplicate: boolean }[]
} {
  const queue = getQueuedReports()
  if (queue.length === 0) return { processed: 0, results: [] }

  const results: { ticketId: string; wasDuplicate: boolean }[] = []

  for (const item of queue) {
    if (item.isDuplicateFollow && item.targetTicketId) {
      addReportToTicket(
        item.targetTicketId,
        {
          description: item.description,
          landmark: item.landmark,
          photo: item.photo,
          contactType: item.contactType,
          contact: item.contact,
        },
        item.reporterId
      )
      results.push({ ticketId: item.targetTicketId, wasDuplicate: true })
    } else {
      // Run duplicate check on sync
      const dup = findDuplicateTicket(item.category, item.lat, item.lng, 50)
      if (dup) {
        addReportToTicket(
          dup.ticket.id,
          {
            description: item.description,
            landmark: item.landmark,
            photo: item.photo,
            contactType: item.contactType,
            contact: item.contact,
          },
          item.reporterId
        )
        results.push({ ticketId: dup.ticket.id, wasDuplicate: true })
      } else {
        const { ticket } = createNewTicket(
          {
            category: item.category,
            barangay: item.barangay,
            lat: item.lat,
            lng: item.lng,
            landmark: item.landmark,
            description: item.description,
            photo: item.photo,
            contactType: item.contactType,
            contact: item.contact,
          },
          item.reporterId
        )
        results.push({ ticketId: ticket.id, wasDuplicate: false })
      }
    }
  }

  // Clear queue
  try {
    localStorage.removeItem(STORAGE_KEYS.QUEUE)
    notifyDataChange()
  } catch (err) {
    console.error("Failed to clear offline queue:", err)
  }

  return { processed: queue.length, results }
}
