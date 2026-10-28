import { useMemo, useState } from "react"
import { CategoryChart } from "@/components/city/CategoryChart"
import { AvgDaysByCategoryChart } from "@/components/transparency/AvgDaysByCategoryChart"
import { OpenTicketsByBarangayRanked } from "@/components/transparency/OpenTicketsByBarangayRanked"
import { useApp } from "@/context/AppContext"
import { getDaysOpen } from "@/lib/storage"
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
    const resolvedPct =
      totalTickets > 0
        ? Math.round((resolvedTickets.length / totalTickets) * 100)
        : 0

    let avgDays = 0
    if (resolvedTickets.length > 0) {
      const sum = resolvedTickets.reduce((acc, t) => acc + getDaysOpen(t), 0)
      avgDays = Number((sum / resolvedTickets.length).toFixed(1))
    }

    const openOver7Days = tickets.filter(
      (t) => t.status !== "resolved" && getDaysOpen(t) > 7
    ).length

    return {
      totalReportsReceived,
      totalTickets,
      resolvedPct,
      avgDays,
      openOver7Days,
    }
  }, [tickets])

  const [lastUpdated] = useState(() => {
    return new Date().toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  })

  return (
    <main className="mx-auto max-w-7xl animate-in space-y-6 p-4 pb-24 duration-200 fade-in sm:p-6">
      {/* Header */}
      <div className="flex flex-col justify-between gap-3 border-b border-border pb-4 sm:flex-row sm:items-center">
        <div>
          <div className="flex items-center gap-2">
            <span className="rounded bg-primary/10 px-2 py-0.5 text-xs font-semibold text-primary">
              Public Portal
            </span>
            <span className="rounded border border-border bg-muted px-2 py-0.5 font-mono text-xs text-muted-foreground">
              Sample data
            </span>
          </div>
          <h1 className="mt-1 text-2xl font-bold tracking-tight text-foreground">
            Tuguegarao Civic Transparency & Accountability
          </h1>
          <p className="text-xs text-muted-foreground">
            Aggregate accountability metrics and city planning data. 100%
            anonymous public ledger.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Clock className="size-3.5" />
          <span>Last updated: {lastUpdated}</span>
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
            Consolidated across {metrics.totalTickets} master tickets
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
            City resolution benchmark
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
              days
            </span>
          </div>
          <div className="mt-1 text-[11px] text-muted-foreground">
            Turnaround speed
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
            Overdue issues flagged
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
          Civic Transparency Guarantee
        </div>
        <p className="mx-auto max-w-xl text-[11px] leading-relaxed">
          The app does not fix streetlights. It makes every complaint visible
          and measurable so Tuguegarao City can respond faster and plan budgets
          with real data.
        </p>
      </div>
    </main>
  )
}
