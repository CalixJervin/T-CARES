import {
  Building2,
  Bus,
  CircleEllipsis,
  Construction,
  Lightbulb,
  ShieldAlert,
  Trash2,
  Waves,
  type LucideIcon,
} from "lucide-react"
import type { Category, Status } from "./types"

// TODO: Confirm local emergency number with the city (e.g. Tuguegarao CDRRMO / Rescue 1111)
export const EMERGENCY_NUMBER = "911 (confirm local number)"

export const BARANGAYS = [
  "Centro 1",
  "Centro 2",
  "Carig",
  "Ugac Norte",
  "Ugac Sur",
  "Atulayan Norte",
  "Caritan Norte",
  "Annafunan East",
  "Buntun",
  "Linao East",
] as const

export type Barangay = (typeof BARANGAYS)[number]

export const BARANGAY_COORDINATES: Record<string, { lat: number; lng: number }> = {
  "Centro 1": { lat: 17.6131, lng: 121.727 },
  "Centro 2": { lat: 17.6158, lng: 121.729 },
  Carig: { lat: 17.652, lng: 121.751 },
  "Ugac Norte": { lat: 17.608, lng: 121.719 },
  "Ugac Sur": { lat: 17.6015, lng: 121.713 },
  "Atulayan Norte": { lat: 17.621, lng: 121.72 },
  "Caritan Norte": { lat: 17.632, lng: 121.726 },
  "Annafunan East": { lat: 17.641, lng: 121.737 },
  Buntun: { lat: 17.6135, lng: 121.693 },
  "Linao East": { lat: 17.634, lng: 121.706 },
}

export const DEPARTMENTS = [
  "City Engineering",
  "General Services",
  "CDRRMO",
  "City Health / Sanitation",
  "Traffic Management",
] as const

export const DEFAULT_MAP_CENTER = {
  lat: 17.6131,
  lng: 121.727,
  zoom: 15,
}

export interface CategoryMeta {
  key: Category
  name: string
  tagalog: string
  fullLabel: string
  color: string
  icon: LucideIcon
}

export const CATEGORIES: Record<Category, CategoryMeta> = {
  roads_sidewalks: {
    key: "roads_sidewalks",
    name: "Roads & Sidewalks",
    tagalog: "Kalsada at Bangketa",
    fullLabel: "Kalsada / Roads & Sidewalks",
    color: "#f97316", // orange
    icon: Construction,
  },
  streetlights: {
    key: "streetlights",
    name: "Streetlights",
    tagalog: "Ilaw sa Kalye",
    fullLabel: "Ilaw / Streetlights",
    color: "#eab308", // yellow
    icon: Lightbulb,
  },
  public_facilities: {
    key: "public_facilities",
    name: "Public Facilities",
    tagalog: "Pasilidad ng Publiko",
    fullLabel: "Pasilidad / Public Facilities",
    color: "#0284c7", // sky
    icon: Building2,
  },
  drainage_flooding: {
    key: "drainage_flooding",
    name: "Drainage & Flooding",
    tagalog: "Kanal at Baha",
    fullLabel: "Kanal / Drainage & Flooding",
    color: "#06b6d4", // cyan
    icon: Waves,
  },
  sanitation: {
    key: "sanitation",
    name: "Sanitation & Waste",
    tagalog: "Basura at Kalinisan",
    fullLabel: "Basura / Sanitation & Waste",
    color: "#10b981", // emerald
    icon: Trash2,
  },
  transportation: {
    key: "transportation",
    name: "Transportation & Traffic",
    // TODO: Confirm wording with local speaker (e.g. Tuguegarao local terms for transport & traffic)
    tagalog: "Trapiko at Sakayan",
    fullLabel: "Trapiko / Transportation & Traffic",
    color: "#6366f1", // indigo
    icon: Bus,
  },
  public_safety: {
    key: "public_safety",
    name: "Public Safety",
    tagalog: "Kaligtasan ng Publiko",
    fullLabel: "Kaligtasan / Public Safety",
    color: "#ef4444", // red
    icon: ShieldAlert,
  },
  other_services: {
    key: "other_services",
    name: "Other Services",
    tagalog: "Iba Pang Serbisyo",
    fullLabel: "Iba pa / Other Services",
    color: "#8b5cf6", // purple
    icon: CircleEllipsis,
  },
}

export interface StatusMeta {
  key: Status
  label: string
  tagalog: string
  bgClass: string
  textClass: string
  borderClass: string
  badgeClass: string
  markerColor: string
}

export const STATUS_META: Record<Status, StatusMeta> = {
  received: {
    key: "received",
    label: "Received",
    tagalog: "Natanggap",
    bgClass: "bg-slate-100 dark:bg-slate-800/80",
    textClass: "text-slate-700 dark:text-slate-300",
    borderClass: "border-slate-300 dark:border-slate-700",
    badgeClass:
      "bg-slate-100 text-slate-800 border-slate-300 dark:bg-slate-800 dark:text-slate-200 dark:border-slate-700",
    markerColor: "#64748b", // slate
  },
  assigned: {
    key: "assigned",
    label: "Assigned",
    tagalog: "Naitakda",
    bgClass: "bg-blue-100 dark:bg-blue-950/60",
    textClass: "text-blue-700 dark:text-blue-300",
    borderClass: "border-blue-300 dark:border-blue-800",
    badgeClass:
      "bg-blue-100 text-blue-800 border-blue-300 dark:bg-blue-950 dark:text-blue-200 dark:border-blue-800",
    markerColor: "#2563eb", // blue
  },
  in_progress: {
    key: "in_progress",
    label: "In Progress",
    tagalog: "Inaaksyunan",
    bgClass: "bg-amber-100 dark:bg-amber-950/60",
    textClass: "text-amber-700 dark:text-amber-300",
    borderClass: "border-amber-300 dark:border-amber-800",
    badgeClass:
      "bg-amber-100 text-amber-800 border-amber-300 dark:bg-amber-950 dark:text-amber-200 dark:border-amber-800",
    markerColor: "#f59e0b", // amber
  },
  resolved: {
    key: "resolved",
    label: "Resolved",
    tagalog: "Naresolba",
    bgClass: "bg-emerald-100 dark:bg-emerald-950/60",
    textClass: "text-emerald-700 dark:text-emerald-300",
    borderClass: "border-emerald-300 dark:border-emerald-800",
    badgeClass:
      "bg-emerald-100 text-emerald-800 border-emerald-300 dark:bg-emerald-950 dark:text-emerald-200 dark:border-emerald-800",
    markerColor: "#10b981", // green
  },
}
