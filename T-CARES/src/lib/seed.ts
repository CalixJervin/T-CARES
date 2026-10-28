import type { Ticket } from "./types"

export function createSvgPlaceholder(
  ticketId: string,
  categoryLabel: string,
  description: string,
  color = "#3b82f6"
): string {
  const safeDesc = (description || "Civic Complaint Photo").slice(0, 36)
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="600" viewBox="0 0 800 600">
    <defs>
      <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#0f172a" />
        <stop offset="50%" stop-color="#1e293b" />
        <stop offset="100%" stop-color="#090d16" />
      </linearGradient>
      <radialGradient id="glow" cx="50%" cy="30%" r="50%">
        <stop offset="0%" stop-color="${color}" stop-opacity="0.35" />
        <stop offset="100%" stop-color="#0f172a" stop-opacity="0" />
      </radialGradient>
    </defs>
    <rect width="800" height="600" fill="url(#bgGrad)" />
    <circle cx="400" cy="220" r="180" fill="url(#glow)" />
    <rect x="60" y="60" width="680" height="480" rx="20" fill="none" stroke="#334155" stroke-width="2" stroke-dasharray="8 8" />
    <circle cx="400" cy="210" r="64" fill="#1e293b" stroke="${color}" stroke-width="3" />
    <path d="M375 225 L400 190 L425 225 Z" fill="${color}" opacity="0.9" />
    <circle cx="400" cy="235" r="4" fill="#ffffff" />
    <text x="400" y="320" font-family="system-ui, -apple-system, sans-serif" font-size="28" font-weight="700" fill="#f8fafc" text-anchor="middle">
      ${ticketId} • ${categoryLabel}
    </text>
    <text x="400" y="365" font-family="system-ui, -apple-system, sans-serif" font-size="20" fill="#94a3b8" text-anchor="middle">
      "${safeDesc}"
    </text>
    <rect x="250" y="410" width="300" height="36" rx="18" fill="#334155" />
    <text x="400" y="434" font-family="system-ui, -apple-system, sans-serif" font-size="14" font-weight="600" fill="#cbd5e1" text-anchor="middle">
      TUGUEGARAO CITY ACTION PHOTO
    </text>
    <text x="400" y="505" font-family="system-ui, -apple-system, sans-serif" font-size="12" fill="#64748b" text-anchor="middle">
      Sample citizen photo placeholder (offline ready)
    </text>
  </svg>`

  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`
}

const now = Date.now()
const daysAgo = (days: number, extraHours = 0) =>
  new Date(now - (days * 24 + extraHours) * 3600 * 1000).toISOString()

export const SEED_TICKETS: Ticket[] = [
  {
    id: "T-0001",
    category: "streetlights_facilities",
    barangay: "Centro 1",
    lat: 17.6131,
    lng: 121.727,
    status: "received",
    createdAt: daysAgo(12),
    followers: ["seed_reporter_1"],
    reports: [
      {
        id: "rep-0001-1",
        ticketId: "T-0001",
        createdAt: daysAgo(12),
        description: "Streetlight out near the school",
        landmark: "Front of Tuguegarao West Central School gate",
        contactType: "phone",
        contact: "09171234567",
        reporterId: "seed_reporter_1",
        synced: true,
        photo: createSvgPlaceholder(
          "T-0001",
          "Streetlights",
          "Streetlight out near the school",
          "#eab308"
        ),
      },
      {
        id: "rep-0001-2",
        ticketId: "T-0001",
        createdAt: daysAgo(10),
        description: "Lamp post flickering and dark at night",
        landmark: "West school corner",
        contactType: "messenger",
        contact: "m.me/juan.delacruz",
        reporterId: "seed_reporter_2",
        synced: true,
      },
      {
        id: "rep-0001-3",
        ticketId: "T-0001",
        createdAt: daysAgo(8),
        description: "Very dark road near school gate, unsafe for students",
        landmark: "Near pedestrian lane",
        contactType: "phone",
        contact: "09289876543",
        reporterId: "seed_reporter_3",
        synced: true,
      },
      {
        id: "rep-0001-4",
        ticketId: "T-0001",
        createdAt: daysAgo(5),
        description: "Street light bulb is dead",
        landmark: "Post #14",
        contactType: "phone",
        contact: "09055551234",
        reporterId: "seed_reporter_4",
        synced: true,
      },
      {
        id: "rep-0001-5",
        ticketId: "T-0001",
        createdAt: daysAgo(2),
        description: "Follow up on broken street light",
        landmark: "School perimeter road",
        contactType: "messenger",
        contact: "m.me/maria.clara",
        reporterId: "seed_reporter_5",
        synced: true,
      },
    ],
    history: [
      {
        status: "received",
        note: "Initial report received from citizen. Marked for intake review.",
        at: daysAgo(12),
      },
    ],
  },
  {
    id: "T-0002",
    category: "drainage_flooding",
    barangay: "Carig",
    lat: 17.6235,
    lng: 121.733,
    status: "in_progress",
    department: "City Engineering",
    createdAt: daysAgo(6),
    followers: ["seed_reporter_6"],
    reports: [
      {
        id: "rep-0002-1",
        ticketId: "T-0002",
        createdAt: daysAgo(6),
        description: "Severe canal overflow during heavy rains",
        landmark: "Near Carig Regional Government Center junction",
        contactType: "phone",
        contact: "09183334444",
        reporterId: "seed_reporter_6",
        synced: true,
        photo: createSvgPlaceholder(
          "T-0002",
          "Drainage",
          "Severe canal overflow",
          "#06b6d4"
        ),
      },
      {
        id: "rep-0002-2",
        ticketId: "T-0002",
        createdAt: daysAgo(5),
        description: "Water backing up onto roadway",
        contactType: "phone",
        contact: "09192223333",
        reporterId: "seed_reporter_7",
        synced: true,
      },
      {
        id: "rep-0002-3",
        ticketId: "T-0002",
        createdAt: daysAgo(3),
        description: "Still flooding when it rains, need drainage dredging",
        contactType: "messenger",
        contact: "m.me/carlo.carig",
        reporterId: "seed_reporter_8",
        synced: true,
      },
    ],
    history: [
      {
        status: "received",
        note: "Report filed regarding overflowing canal drainage.",
        at: daysAgo(6),
      },
      {
        status: "assigned",
        note: "Assigned to City Engineering for hydraulic assessment.",
        at: daysAgo(5),
      },
      {
        status: "in_progress",
        note: "Engineering maintenance crew deployed with backhoe for de-silting.",
        at: daysAgo(3),
      },
    ],
  },
  {
    id: "T-0003",
    category: "roads_sidewalks",
    barangay: "Centro 2",
    lat: 17.6112,
    lng: 121.7252,
    status: "received",
    createdAt: daysAgo(3),
    followers: ["seed_reporter_9"],
    reports: [
      {
        id: "rep-0003-1",
        ticketId: "T-0003",
        createdAt: daysAgo(3),
        description: "Vendor stalls blocking sidewalk",
        landmark: "Along Bonifacio Street near market",
        contactType: "phone",
        contact: "09217778888",
        reporterId: "seed_reporter_9",
        synced: true,
        photo: createSvgPlaceholder(
          "T-0003",
          "Sidewalk",
          "Vendor stalls blocking sidewalk",
          "#f97316"
        ),
      },
      {
        id: "rep-0003-2",
        ticketId: "T-0003",
        createdAt: daysAgo(2),
        description: "Pedestrians forced into busy traffic lane",
        landmark: "Market entrance corner",
        contactType: "messenger",
        contact: "m.me/pedro.penduko",
        reporterId: "seed_reporter_10",
        synced: true,
      },
    ],
    history: [
      {
        status: "received",
        note: "Initial report logged for sidewalk obstruction.",
        at: daysAgo(3),
      },
    ],
  },
  {
    id: "T-0004",
    category: "sanitation",
    barangay: "Ugac Norte",
    lat: 17.6045,
    lng: 121.7215,
    status: "assigned",
    department: "General Services",
    createdAt: daysAgo(4),
    followers: ["seed_reporter_11"],
    reports: [
      {
        id: "rep-0004-1",
        ticketId: "T-0004",
        createdAt: daysAgo(4),
        description: "Uncollected garbage",
        landmark: "Corner near barangay hall",
        contactType: "phone",
        contact: "09170001122",
        reporterId: "seed_reporter_11",
        synced: true,
        photo: createSvgPlaceholder(
          "T-0004",
          "Sanitation",
          "Uncollected garbage",
          "#10b981"
        ),
      },
    ],
    history: [
      {
        status: "received",
        note: "Report submitted with photo of garbage pile.",
        at: daysAgo(4),
      },
      {
        status: "assigned",
        note: "Forwarded to General Services for scheduled trash compactor haul.",
        at: daysAgo(3),
      },
    ],
  },
  {
    id: "T-0005",
    category: "streetlights_facilities",
    barangay: "Atulayan Norte",
    lat: 17.6175,
    lng: 121.7198,
    status: "resolved",
    department: "General Services",
    createdAt: daysAgo(9),
    resolvedAt: daysAgo(4),
    followers: ["seed_reporter_12"],
    reports: [
      {
        id: "rep-0005-1",
        ticketId: "T-0005",
        createdAt: daysAgo(9),
        description: "Burned out street lamp on corner post",
        landmark: "Purok 3 intersection",
        contactType: "phone",
        contact: "09991234567",
        reporterId: "seed_reporter_12",
        synced: true,
        photo: createSvgPlaceholder(
          "T-0005",
          "Streetlights",
          "Burned out street lamp",
          "#eab308"
        ),
      },
    ],
    history: [
      {
        status: "received",
        note: "Ticket received from resident.",
        at: daysAgo(9),
      },
      {
        status: "assigned",
        note: "Assigned to General Services Electrical Division.",
        at: daysAgo(8),
      },
      {
        status: "in_progress",
        note: "Boom truck and new LED fixtures dispatched.",
        at: daysAgo(6),
      },
      {
        status: "resolved",
        note: "New LED bulb fixture installed and tested operational.",
        at: daysAgo(4),
      },
    ],
  },
  {
    id: "T-0006",
    category: "roads_sidewalks",
    barangay: "Caritan Norte",
    lat: 17.6205,
    lng: 121.7245,
    status: "resolved",
    department: "City Engineering",
    createdAt: daysAgo(15),
    resolvedAt: daysAgo(10),
    followers: ["seed_reporter_13"],
    reports: [
      {
        id: "rep-0006-1",
        ticketId: "T-0006",
        createdAt: daysAgo(15),
        description: "Pothole",
        landmark: "National highway northbound lane",
        contactType: "phone",
        contact: "09204445555",
        reporterId: "seed_reporter_13",
        synced: true,
        photo: createSvgPlaceholder(
          "T-0006",
          "Roads",
          "Pothole on highway",
          "#f97316"
        ),
      },
      {
        id: "rep-0006-2",
        ticketId: "T-0006",
        createdAt: daysAgo(14),
        description: "Deep pothole causing motorcycle tire punctures",
        landmark: "Near gasoline station",
        contactType: "messenger",
        contact: "m.me/rider.cagayan",
        reporterId: "seed_reporter_14",
        synced: true,
      },
    ],
    history: [
      {
        status: "received",
        note: "Pothole report logged.",
        at: daysAgo(15),
      },
      {
        status: "assigned",
        note: "Assigned to City Engineering Road Maintenance Division.",
        at: daysAgo(14),
      },
      {
        status: "in_progress",
        note: "Cold mix asphalt patching scheduled and deployed.",
        at: daysAgo(12),
      },
      {
        status: "resolved",
        note: "Pothole filled, compacted, and leveled.",
        at: daysAgo(10),
      },
    ],
  },
  {
    id: "T-0007",
    category: "drainage_flooding",
    barangay: "Centro 1",
    lat: 17.6148,
    lng: 121.7273, // ~190m from T-0001 (lat: 17.6131, lng: 121.7270), within 500m but different category
    status: "received",
    createdAt: daysAgo(1),
    followers: ["seed_reporter_15"],
    reports: [
      {
        id: "rep-0007-1",
        ticketId: "T-0007",
        createdAt: daysAgo(1),
        description: "Clogged canal",
        landmark: "Rizal Street corner near pharmacy",
        contactType: "phone",
        contact: "09176543210",
        reporterId: "seed_reporter_15",
        synced: true,
        photo: createSvgPlaceholder(
          "T-0007",
          "Drainage",
          "Clogged canal",
          "#06b6d4"
        ),
      },
    ],
    history: [
      {
        status: "received",
        note: "Report filed for canal blockage.",
        at: daysAgo(1),
      },
    ],
  },
  {
    id: "T-0008",
    category: "public_safety",
    barangay: "Ugac Sur",
    lat: 17.601,
    lng: 121.7185,
    status: "in_progress",
    department: "Traffic Management",
    createdAt: daysAgo(8),
    followers: ["seed_reporter_16"],
    reports: [
      {
        id: "rep-0008-1",
        ticketId: "T-0008",
        createdAt: daysAgo(8),
        description: "Damaged traffic sign",
        landmark: "Crossroad approaching diversion road",
        contactType: "messenger",
        contact: "m.me/safe.roads",
        reporterId: "seed_reporter_16",
        synced: true,
        photo: createSvgPlaceholder(
          "T-0008",
          "Public Safety",
          "Damaged traffic sign",
          "#ef4444"
        ),
      },
    ],
    history: [
      {
        status: "received",
        note: "Damaged regulatory sign reported.",
        at: daysAgo(8),
      },
      {
        status: "assigned",
        note: "Dispatched to Traffic Management Group for replacement.",
        at: daysAgo(7),
      },
      {
        status: "in_progress",
        note: "Signpost replacement fabrication underway in city workshop.",
        at: daysAgo(5),
      },
    ],
  },
]
