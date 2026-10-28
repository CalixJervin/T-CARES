import { useMemo, useState } from "react"
import { CategoryBadge } from "@/components/common/CategoryBadge"
import { StatusBadge } from "@/components/common/StatusBadge"
import { BarangayChart } from "@/components/city/BarangayChart"
import { CategoryChart } from "@/components/city/CategoryChart"
import { HotspotMap } from "@/components/city/HotspotMap"
import { TicketDetailDrawer } from "@/components/city/TicketDetailDrawer"
import { Button } from "@/components/ui/button"
import { useApp } from "@/context/AppContext"
import { CATEGORIES } from "@/lib/constants"
import { getDaysOpen } from "@/lib/storage"
import type { Category, Ticket } from "@/lib/types"
import {
  AlertCircle,
  ArrowUpDown,
  Building2,
  Calendar,
  Clock,
  Layers,
  MapPin,
  Search,
  ShieldCheck,
  TrendingUp,
} from "lucide-react"

export function CityStaffPage() {
  const { tickets } = useApp()
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null)
  const [isStaffLoggedIn, setIsStaffLoggedIn] = useState(true)

  // Filtering & Sorting
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [categoryFilter, setCategoryFilter] = useState<string>("all")
  const [searchQuery, setSearchQuery] = useState<string>("")
  const [sortBy, setSortBy] = useState<"reports" | "days" | "id">("reports")
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc")

  // KPIs
  const kpis = useMemo(() => {
    const total = tickets.length
    const open = tickets.filter((t) => t.status !== "resolved").length
    const resolved = tickets.filter((t) => t.status === "resolved")
    const resolutionRate =
      total > 0 ? Math.round((resolved.length / total) * 100) : 0

    let avgDays = 0
    if (resolved.length > 0) {
      const sum = resolved.reduce((acc, t) => acc + getDaysOpen(t), 0)
      avgDays = Number((sum / resolved.length).toFixed(1))
    }

    const overdueCount = tickets.filter(
      (t) => t.status !== "resolved" && getDaysOpen(t) > 7
    ).length

    const totalReports = tickets.reduce((acc, t) => acc + t.reports.length, 0)

    return {
      total,
      open,
      resolvedCount: resolved.length,
      resolutionRate,
      avgDays,
      overdueCount,
      totalReports,
    }
  }, [tickets])

  // Filtered & Sorted Tickets
  const filteredTickets = useMemo(() => {
    return tickets
      .filter((t) => {
        if (statusFilter !== "all" && t.status !== statusFilter) return false
        if (categoryFilter !== "all" && t.category !== categoryFilter)
          return false
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase()
          const matchId = t.id.toLowerCase().includes(q)
          const matchBgy = t.barangay.toLowerCase().includes(q)
          const matchDept = t.department?.toLowerCase().includes(q)
          const matchDesc = t.reports.some((r) =>
            r.description?.toLowerCase().includes(q)
          )
          if (!matchId && !matchBgy && !matchDept && !matchDesc) return false
        }
        return true
      })
      .sort((a, b) => {
        if (sortBy === "reports") {
          return sortOrder === "desc"
            ? b.reports.length - a.reports.length
            : a.reports.length - b.reports.length
        }
        if (sortBy === "days") {
          const daysA = getDaysOpen(a)
          const daysB = getDaysOpen(b)
          return sortOrder === "desc" ? daysB - daysA : daysA - daysB
        }
        return sortOrder === "desc"
          ? b.id.localeCompare(a.id)
          : a.id.localeCompare(b.id)
      })
  }, [tickets, statusFilter, categoryFilter, searchQuery, sortBy, sortOrder])

  const toggleSort = (col: "reports" | "days" | "id") => {
    if (sortBy === col) {
      setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"))
    } else {
      setSortBy(col)
      setSortOrder("desc")
    }
  }

  // Synchronize selectedTicket with latest tickets state when drawer is open
  const currentSelectedTicket = selectedTicket
    ? tickets.find((t) => t.id === selectedTicket.id) || selectedTicket
    : null

  if (!isStaffLoggedIn) {
    return (
      <main className="mx-auto my-12 max-w-lg p-6 text-center">
        <div className="rounded-2xl border border-border bg-card p-8 shadow-sm">
          <div className="mx-auto mb-3 flex size-12 items-center justify-center rounded-full bg-primary/10 text-primary">
            <Building2 className="size-6" />
          </div>
          <h2 className="text-xl font-bold text-foreground">
            Tuguegarao LGU Staff Portal
          </h2>
          <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">
            Manage incoming citizen complaints, merge duplicates into master
            tickets, assign responsible departments, and dispatch status
            updates.
          </p>
          <div className="mt-6">
            <Button
              onClick={() => setIsStaffLoggedIn(true)}
              className="h-10 w-full cursor-pointer gap-2 text-sm font-semibold"
            >
              <ShieldCheck className="size-4" />
              Enter demo as City staff
            </Button>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="mx-auto max-w-7xl animate-in space-y-6 p-4 pb-24 duration-200 fade-in sm:p-6">
      {/* Top Banner / Breadcrumb */}
      <div className="flex flex-col justify-between gap-3 border-b border-border pb-4 sm:flex-row sm:items-center">
        <div>
          <div className="flex items-center gap-2">
            <span className="rounded bg-primary/10 px-2 py-0.5 text-xs font-semibold text-primary">
              Staff Command Center
            </span>
            <span className="font-mono text-xs text-muted-foreground">
              Sample data
            </span>
          </div>
          <h1 className="mt-1 text-2xl font-bold tracking-tight text-foreground">
            Complaints & Action Dashboard
          </h1>
          <p className="text-xs text-muted-foreground">
            One master ticket per problem — eliminate duplicate dispatches
            across Tuguegarao departments.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-600 dark:text-emerald-400">
            <span className="size-2 animate-pulse rounded-full bg-emerald-500" />
            Active Session: City Staff (Demo)
          </span>
        </div>
      </div>

      {/* KPI ROW */}
      <section className="grid grid-cols-2 gap-3 md:grid-cols-5">
        {/* Total Tickets */}
        <div className="rounded-xl border border-border bg-card p-3.5 shadow-xs">
          <div className="flex items-center justify-between text-[10px] font-bold tracking-wider text-muted-foreground uppercase">
            <span>Total Tickets</span>
            <Layers className="size-3.5 text-muted-foreground" />
          </div>
          <div className="mt-1 text-2xl font-black text-foreground">
            {kpis.total}
          </div>
          <div className="mt-1 text-[11px] text-muted-foreground">
            {kpis.totalReports} citizen reports merged
          </div>
        </div>

        {/* Open Tickets */}
        <div className="rounded-xl border border-border bg-card p-3.5 shadow-xs">
          <div className="flex items-center justify-between text-[10px] font-bold tracking-wider text-muted-foreground uppercase">
            <span>Open (Not Resolved)</span>
            <Clock className="size-3.5 text-amber-500" />
          </div>
          <div className="mt-1 text-2xl font-black text-amber-600 dark:text-amber-400">
            {kpis.open}
          </div>
          <div className="mt-1 text-[11px] text-muted-foreground">
            Requiring action / dispatch
          </div>
        </div>

        {/* Resolution Rate */}
        <div className="rounded-xl border border-border bg-card p-3.5 shadow-xs">
          <div className="flex items-center justify-between text-[10px] font-bold tracking-wider text-muted-foreground uppercase">
            <span>Resolution Rate</span>
            <TrendingUp className="size-3.5 text-emerald-500" />
          </div>
          <div className="mt-1 text-2xl font-black text-emerald-600 dark:text-emerald-400">
            {kpis.resolutionRate}%
          </div>
          <div className="mt-1 text-[11px] text-muted-foreground">
            {kpis.resolvedCount} completed cases
          </div>
        </div>

        {/* Avg Days to Resolve */}
        <div className="rounded-xl border border-border bg-card p-3.5 shadow-xs">
          <div className="flex items-center justify-between text-[10px] font-bold tracking-wider text-muted-foreground uppercase">
            <span>Avg Days to Resolve</span>
            <Calendar className="size-3.5 text-muted-foreground" />
          </div>
          <div className="mt-1 text-2xl font-black text-foreground">
            {kpis.avgDays}{" "}
            <span className="text-xs font-normal text-muted-foreground">
              days
            </span>
          </div>
          <div className="mt-1 text-[11px] text-muted-foreground">
            Resolved tickets only
          </div>
        </div>

        {/* Overdue (>7 days) */}
        <div className="col-span-2 rounded-xl border border-red-500/30 bg-red-500/5 p-3.5 shadow-xs md:col-span-1">
          <div className="flex items-center justify-between text-[10px] font-bold tracking-wider text-red-600 uppercase dark:text-red-400">
            <span>Open &gt; 7 Days</span>
            <AlertCircle className="size-3.5 text-red-500" />
          </div>
          <div className="mt-1 text-2xl font-black text-red-600 dark:text-red-400">
            {kpis.overdueCount}
          </div>
          <div className="mt-1 text-[11px] font-medium text-red-600/80 dark:text-red-400/80">
            Escalation / Overdue
          </div>
        </div>
      </section>

      {/* HOTSPOT MAP */}
      <section className="space-y-2">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="flex items-center gap-1.5 text-sm font-bold tracking-wider text-foreground uppercase">
              <MapPin className="size-4 text-primary" />
              Tuguegarao Complaint Hotspot Map
            </h2>
            <p className="text-xs text-muted-foreground">
              Marker diameter scales with citizen report density. Click any pin
              to inspect or dispatch.
            </p>
          </div>
        </div>
        <HotspotMap
          tickets={tickets}
          onSelectTicket={(t) => setSelectedTicket(t)}
        />
      </section>

      {/* TWO CHARTS */}
      <section className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <CategoryChart tickets={tickets} />
        <BarangayChart tickets={tickets} />
      </section>

      {/* TICKET TABLE */}
      <section className="space-y-4 rounded-xl border border-border bg-card p-4 shadow-xs">
        {/* Table Controls */}
        <div className="flex flex-col items-stretch justify-between gap-3 md:flex-row md:items-center">
          <div>
            <h2 className="flex items-center gap-1.5 text-sm font-bold tracking-wider text-foreground uppercase">
              <Layers className="size-4 text-primary" />
              Master Tickets Register ({filteredTickets.length})
            </h2>
            <p className="text-xs text-muted-foreground">
              Consolidated master tickets. Click a ticket row to open action
              drawer.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Search */}
            <div className="relative min-w-[180px] flex-1 sm:flex-initial">
              <Search className="absolute top-2.5 left-2.5 size-3.5 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search ticket, bgy..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-lg border border-border bg-background py-1.5 pr-3 pl-8 text-xs text-foreground focus:border-primary focus:outline-none"
              />
            </div>

            {/* Filter Status */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="cursor-pointer rounded-lg border border-border bg-background px-2.5 py-1.5 text-xs text-foreground focus:border-primary focus:outline-none"
            >
              <option value="all">All Statuses</option>
              <option value="received">Received</option>
              <option value="assigned">Assigned</option>
              <option value="in_progress">In Progress</option>
              <option value="resolved">Resolved</option>
            </select>

            {/* Filter Category */}
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="cursor-pointer rounded-lg border border-border bg-background px-2.5 py-1.5 text-xs text-foreground focus:border-primary focus:outline-none"
            >
              <option value="all">All Categories</option>
              {Object.keys(CATEGORIES).map((cat) => (
                <option key={cat} value={cat}>
                  {CATEGORIES[cat as Category].name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto rounded-lg border border-border">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-border bg-muted/60 font-semibold text-muted-foreground">
              <tr>
                <th
                  onClick={() => toggleSort("id")}
                  className="cursor-pointer px-3 py-2.5 hover:text-foreground"
                >
                  <div className="flex items-center gap-1">
                    ID
                    <ArrowUpDown className="size-3" />
                  </div>
                </th>
                <th className="px-3 py-2.5">Category</th>
                <th className="px-3 py-2.5">Barangay</th>
                <th
                  onClick={() => toggleSort("reports")}
                  className="cursor-pointer px-3 py-2.5 text-center hover:text-foreground"
                >
                  <div className="flex items-center justify-center gap-1 font-bold text-primary">
                    Reports
                    <ArrowUpDown className="size-3" />
                  </div>
                </th>
                <th className="px-3 py-2.5">Status</th>
                <th className="px-3 py-2.5">Department</th>
                <th
                  onClick={() => toggleSort("days")}
                  className="cursor-pointer px-3 py-2.5 text-right hover:text-foreground"
                >
                  <div className="flex items-center justify-end gap-1">
                    Days Open
                    <ArrowUpDown className="size-3" />
                  </div>
                </th>
                <th className="px-3 py-2.5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredTickets.map((t) => {
                const days = getDaysOpen(t)
                const isOverdue = days > 7 && t.status !== "resolved"

                return (
                  <tr
                    key={t.id}
                    onClick={() => setSelectedTicket(t)}
                    className="cursor-pointer transition-colors hover:bg-muted/40"
                  >
                    <td className="px-3 py-3 font-mono font-bold text-primary">
                      {t.id}
                    </td>
                    <td className="px-3 py-3">
                      <CategoryBadge category={t.category} variant="short" />
                    </td>
                    <td className="px-3 py-3 font-medium text-foreground">
                      {t.barangay}
                    </td>
                    <td className="px-3 py-3 text-center">
                      <span className="inline-flex items-center justify-center rounded-full border border-primary/20 bg-primary/10 px-2.5 py-0.5 text-xs font-bold text-primary">
                        {t.reports.length}
                      </span>
                    </td>
                    <td className="px-3 py-3">
                      <StatusBadge status={t.status} />
                    </td>
                    <td className="px-3 py-3 text-muted-foreground">
                      {t.department || (
                        <span className="text-[11px] italic opacity-75">
                          Unassigned
                        </span>
                      )}
                    </td>
                    <td className="px-3 py-3 text-right font-medium">
                      <span
                        className={
                          isOverdue
                            ? "font-bold text-red-500"
                            : "text-foreground"
                        }
                      >
                        {days}d
                      </span>
                    </td>
                    <td className="px-3 py-3 text-right">
                      <Button
                        size="xs"
                        variant="outline"
                        className="h-7 cursor-pointer text-[11px]"
                        onClick={(e) => {
                          e.stopPropagation()
                          setSelectedTicket(t)
                        }}
                      >
                        Manage
                      </Button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </section>

      {/* TICKET DETAIL DRAWER */}
      {currentSelectedTicket && (
        <TicketDetailDrawer
          ticket={currentSelectedTicket}
          onClose={() => setSelectedTicket(null)}
        />
      )}
    </main>
  )
}
