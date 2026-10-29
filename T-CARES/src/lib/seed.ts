import type { Ticket } from "./types"

export function createSvgPlaceholder(
  ticketId: string,
  categoryLabel: string,
  description: string,
  color = "#3b82f6"
): string {
  const safeDesc = (description || "Civic Report Photo").slice(0, 36)
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
      Citizen photo placeholder (offline ready)
    </text>
  </svg>`

  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`
}

// Blank state: no demo data
export const SEED_TICKETS: Ticket[] = []
