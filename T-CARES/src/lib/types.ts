export type Category =
  | "roads_sidewalks"
  | "streetlights_facilities"
  | "drainage_flooding"
  | "sanitation"
  | "transportation"
  | "public_safety"
  | "other_services"

export type Status = "received" | "assigned" | "in_progress" | "resolved"

export interface Report {
  id: string
  ticketId: string
  createdAt: string // ISO string
  description?: string
  landmark?: string
  photo?: string // data URL
  contactType: "phone" | "messenger"
  contact: string
  reporterId: string // anonymous local id
  synced: boolean
}

export interface TicketHistory {
  status: Status
  note?: string
  at: string // ISO string
}

export interface Ticket {
  id: string // "T-0001" format
  category: Category
  barangay: string
  lat: number
  lng: number
  status: Status
  department?: string
  createdAt: string // ISO string
  resolvedAt?: string // ISO string
  reports: Report[]
  followers: string[] // reporterIds
  history: TicketHistory[]
}

export interface QueuedReport {
  id: string
  ticketId?: string // If attaching to an existing ticket via duplicate merge
  category: Category
  barangay: string
  lat: number
  lng: number
  landmark?: string
  description?: string
  photo?: string
  contactType: "phone" | "messenger"
  contact: string
  reporterId: string
  createdAt: string
  isDuplicateFollow?: boolean
  targetTicketId?: string
}

export interface NotificationItem {
  id: string
  ticketId: string
  oldStatus?: Status
  newStatus: Status
  note?: string
  timestamp: string
  read: boolean
}
