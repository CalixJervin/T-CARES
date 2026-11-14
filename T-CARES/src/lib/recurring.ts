import {
  RECURRING_MIN_TICKETS,
  RECURRING_RADIUS_M,
  RECURRING_WINDOW_DAYS,
} from "./constants"
import { haversineDistanceMeters } from "./storage"
import type { Category, Ticket } from "./types"

export interface RecurringCluster {
  id: string
  ticketIds: string[]
  center: { lat: number; lng: number }
  count: number
  category: Category
}

/**
 * Pure helper to cluster tickets into recurring problem spots.
 * Groups by connected nearby same-category tickets within RECURRING_RADIUS_M (100m)
 * and created within RECURRING_WINDOW_DAYS (90 days).
 *
 * Tickets of any status (including resolved) are counted.
 * Only clusters with at least RECURRING_MIN_TICKETS (2) are returned.
 */
export function findRecurringClusters(
  tickets: Ticket[],
  radiusM: number = RECURRING_RADIUS_M,
  windowDays: number = RECURRING_WINDOW_DAYS,
  minTickets: number = RECURRING_MIN_TICKETS
): RecurringCluster[] {
  if (!tickets || tickets.length === 0) return []

  const windowMs = windowDays * 24 * 3600 * 1000
  const n = tickets.length
  const adj: number[][] = Array.from({ length: n }, () => [])

  // Build adjacency graph between connected pairs of same category within radius & window
  for (let i = 0; i < n; i++) {
    for (let j = i + 1; j < n; j++) {
      const a = tickets[i]
      const b = tickets[j]

      if (a.category !== b.category) continue

      const timeDiff = Math.abs(
        new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      )
      if (timeDiff > windowMs) continue

      const distance = haversineDistanceMeters(a.lat, a.lng, b.lat, b.lng)
      if (distance <= radiusM) {
        adj[i].push(j)
        adj[j].push(i)
      }
    }
  }

  // Find connected components using BFS
  const visited = new Set<number>()
  const clusters: RecurringCluster[] = []

  for (let i = 0; i < n; i++) {
    if (visited.has(i)) continue

    const componentIndices: number[] = []
    const queue = [i]
    visited.add(i)

    while (queue.length > 0) {
      const curr = queue.shift()!
      componentIndices.push(curr)

      for (const neighbor of adj[curr]) {
        if (!visited.has(neighbor)) {
          visited.add(neighbor)
          queue.push(neighbor)
        }
      }
    }

    if (componentIndices.length >= minTickets) {
      const clusterTickets = componentIndices.map((idx) => tickets[idx])
      const ticketIds = clusterTickets.map((t) => t.id)
      const sumLat = clusterTickets.reduce((sum, t) => sum + t.lat, 0)
      const sumLng = clusterTickets.reduce((sum, t) => sum + t.lng, 0)

      clusters.push({
        id: `cluster-${ticketIds.sort().join("-")}`,
        ticketIds,
        center: {
          lat: sumLat / clusterTickets.length,
          lng: sumLng / clusterTickets.length,
        },
        count: clusterTickets.length,
        category: clusterTickets[0].category,
      })
    }
  }

  return clusters
}

/**
 * Returns the recurring cluster for a specific ticket, if any, along with sibling IDs.
 */
export function getTicketRecurringCluster(
  ticketId: string,
  clusters: RecurringCluster[]
): { cluster: RecurringCluster; siblingIds: string[] } | null {
  const cluster = clusters.find((c) => c.ticketIds.includes(ticketId))
  if (!cluster) return null
  return {
    cluster,
    siblingIds: cluster.ticketIds.filter((id) => id !== ticketId),
  }
}
