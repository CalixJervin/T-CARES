import { useMemo } from "react"
import { CategoryChart } from "@/components/city/CategoryChart"
import { AvgDaysByCategoryChart } from "@/components/transparency/AvgDaysByCategoryChart"
import { OpenTicketsByBarangayRanked } from "@/components/transparency/OpenTicketsByBarangayRanked"
import { useApp } from "@/context/AppContext"
import { getDaysOpen } from "@/lib/storage"
import { pluralize } from "@/lib/utils"
import {
  AlertCircle,
  Calendar,
  CheckCircle2,
  Clock,
  Layers,
  ShieldCheck,
} from "lucide-react"

export function TransparencyPage() {
  const { tickets } = useApp()

  const metrics = useMemo(() => {
    const totalReportsReceived = tickets.reduce(
      (sum, t) => sum + t.reports.length,
      0
    )
    const totalTickets = tickets.length
    const resolvedTickets = tickets.filter((t) => t.status === "resolved")
    const resolvedTicketsCount = resolvedTickets.length
    const resolvedPct =
      totalTickets > 0
        ? Math.round((resolvedTicketsCount / totalTickets) * 100)
        : 0

    let avgDays = 0
    if (resolvedTicketsCount > 0) {
      const sum = resolvedTickets.reduce((acc, t) => acc + getDaysOpen(t), 0)
      avgDays = Number((sum / resolvedTicketsCount).toFixed(1))
    }

    const openOver7Days = tickets.filter(
      (t) => t.status !== "resolved" && getDaysOpen(t) > 7
    ).length

    return {
      totalReportsReceived,
      totalTickets,
      resolvedTicketsCount,
      resolvedPct,
      avgDays,
      openOver7Days,
    }
  }, [tickets])

  // Most recent history timestamp among tickets
  const lastUpdated = useMemo(() => {
    let latestTime = 0
    tickets.forEach((t) => {
      t.history.forEach((h) => {
        const time = new Date(h.at).getTime()
        if (!isNaN(time) && time > latestTime) {
          latestTime = time
        }
      })
    })

    if (!latestTime) {
      tickets.forEach((t) => {
        const time = new Date(t.createdAt).getTime()
        if (!isNaN(time) && time > latestTime) {
          latestTime = time
        }
      })
    }

    if (!latestTime) return "N/A"

    return new Date(latestTime).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }, [tickets])

  return (
    <main className="mx-auto max-w-7xl animate-in space-y-6 p-4 pb-24 duration-200 fade-in sm:p-6">
      {/* Header */}
      <div className="flex flex-col justify-between gap-3 border-b border-border pb-4 sm:flex-row sm:items-center">
        <div className="w-full">
          <div className="flex items-center gap-2">
            <span className="py-.5 text-xs text-primary opacity-60">
              Public Portal
            </span>
          </div>
          <div className="mt-1 flex w-full flex-wrap items-center gap-x-2.5 gap-y-1.5">
            <h1 className="text-2xl font-bold tracking-tight text-foreground">
              Tuguegarao Civic Transparency & Accountability
            </h1>
            <span className="rounded-md border border-amber-500/40 bg-amber-500/10 px-2.5 py-0.5 font-mono text-xs font-bold text-amber-700 dark:text-amber-400">
              Sample data
            </span>
            <p className="flex items-center gap-1.5 text-xs text-muted-foreground sm:ml-auto">
              <Clock className="size-3.5 text-muted-foreground" />
              <span>Last updated: {lastUpdated}</span>
            </p>
          </div>
        </div>
      </div>

      {/* HEADLINE NUMBERS */}
      <section className="grid grid-cols-2 gap-3 md:grid-cols-4">
        {/* Total reports received */}
        <div className="rounded-xl border border-border bg-card p-4 shadow-xs">
          <div className="flex items-center justify-between text-[10px] font-bold tracking-wider text-muted-foreground uppercase">
            <span>Total Reports Received</span>
            <Layers className="size-3.5 text-primary" />
          </div>
          <div className="mt-1 text-3xl font-black text-foreground">
            {metrics.totalReportsReceived}
          </div>
          <div className="mt-1 text-[11px] text-muted-foreground">
            Consolidated across{" "}
            {pluralize(metrics.totalTickets, "master ticket")}
          </div>
        </div>

        {/* Tickets resolved % */}
        <div className="rounded-xl border border-border bg-card p-4 shadow-xs">
          <div className="flex items-center justify-between text-[10px] font-bold tracking-wider text-muted-foreground uppercase">
            <span>Tickets Resolved %</span>
            <CheckCircle2 className="size-3.5 text-emerald-500" />
          </div>
          <div className="mt-1 text-3xl font-black text-emerald-600 dark:text-emerald-400">
            {metrics.resolvedPct}%
          </div>
          <div className="mt-1 text-[11px] text-muted-foreground">
            {metrics.resolvedTicketsCount} of{" "}
            {pluralize(metrics.totalTickets, "ticket")} resolved
          </div>
        </div>

        {/* Average days to resolve */}
        <div className="rounded-xl border border-border bg-card p-4 shadow-xs">
          <div className="flex items-center justify-between text-[10px] font-bold tracking-wider text-muted-foreground uppercase">
            <span>Avg Days to Resolve</span>
            <Calendar className="size-3.5 text-muted-foreground" />
          </div>
          <div className="mt-1 text-3xl font-black text-foreground">
            {metrics.avgDays}{" "}
            <span className="text-xs font-normal text-muted-foreground">
              {metrics.avgDays === 1 ? "day" : "days"}
            </span>
          </div>
          <div className="mt-1 text-[11px] text-muted-foreground">
            Based on{" "}
            {pluralize(metrics.resolvedTicketsCount, "resolved ticket")}
          </div>
        </div>

        {/* Tickets open over 7 days */}
        <div className="rounded-xl border border-red-500/30 bg-red-500/5 p-4 shadow-xs">
          <div className="flex items-center justify-between text-[10px] font-bold tracking-wider text-red-600 uppercase dark:text-red-400">
            <span>Tickets Open &gt; 7 Days</span>
            <AlertCircle className="size-3.5 text-red-500" />
          </div>
          <div className="mt-1 text-3xl font-black text-red-600 dark:text-red-400">
            {metrics.openOver7Days}
          </div>
          <div className="mt-1 text-[11px] text-red-600/80 dark:text-red-400/80">
            {pluralize(metrics.openOver7Days, "overdue issue")} flagged
          </div>
        </div>
      </section>

      {/* CHARTS GRID */}
      <section className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {/* Chart 1: Average days to resolve by category */}
        <AvgDaysByCategoryChart tickets={tickets} />

        {/* Reusing CategoryChart from city */}
        <CategoryChart tickets={tickets} />
      </section>

      {/* PLANNING / HOTSPOT VIEW */}
      <section>
        <OpenTicketsByBarangayRanked tickets={tickets} />
      </section>

      {/* FOOTER NOTICE */}
      <div className="space-y-1 rounded-xl border border-border/80 bg-muted/40 p-4 text-center text-xs text-muted-foreground">
        <div className="flex items-center justify-center gap-1.5 font-semibold text-foreground">
          <ShieldCheck className="size-4 text-primary" />
          Transparency note
        </div>
        <p className="mx-auto max-w-xl text-[11px] leading-relaxed">
          The app does not fix streetlights. It makes every report visible and
          measurable so Tuguegarao City can respond faster and plan budgets with
          real data.
        </p>
      </div>
    </main>
  )
}
