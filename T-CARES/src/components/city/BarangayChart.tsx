import { useMemo } from "react"
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"
import { BARANGAYS } from "@/lib/constants"
import type { Ticket } from "@/lib/types"

interface BarangayChartProps {
  tickets: Ticket[]
}

const chartConfig: ChartConfig = {
  open: {
    label: "Open Tickets",
    color: "#f59e0b", // amber
  },
  resolved: {
    label: "Resolved Tickets",
    color: "#10b981", // emerald
  },
}

export function BarangayChart({ tickets }: BarangayChartProps) {
  const data = useMemo(() => {
    return BARANGAYS.map((bgy) => {
      const bgyTickets = tickets.filter((t) => t.barangay === bgy)
      const open = bgyTickets.filter((t) => t.status !== "resolved").length
      const resolved = bgyTickets.filter((t) => t.status === "resolved").length
      return {
        barangay: bgy,
        open,
        resolved,
        total: open + resolved,
      }
    }).filter(
      (d) =>
        d.total > 0 || (BARANGAYS as readonly string[]).indexOf(d.barangay) < 6
    )
  }, [tickets])

  return (
    <div className="rounded-xl border border-border bg-card p-4 shadow-xs">
      <div className="mb-3 flex items-center justify-between">
        <div>
          <h3 className="text-xs font-bold tracking-wider text-foreground uppercase">
            Open vs. Resolved by Barangay
          </h3>
          <p className="text-[11px] text-muted-foreground">
            Operational workload vs completion rate across Tuguegarao
          </p>
        </div>
      </div>

      <div className="h-[230px] w-full">
        <ChartContainer config={chartConfig} className="h-full w-full">
          <BarChart
            data={data}
            margin={{ top: 10, right: 10, left: -20, bottom: 25 }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              opacity={0.3}
            />
            <XAxis
              dataKey="barangay"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              interval={0}
              angle={-25}
              textAnchor="end"
              fontSize={10}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tickMargin={6}
              allowDecimals={false}
              fontSize={10}
            />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Bar
              dataKey="open"
              name="Open"
              fill="#f59e0b"
              radius={[3, 3, 0, 0]}
            />
            <Bar
              dataKey="resolved"
              name="Resolved"
              fill="#10b981"
              radius={[3, 3, 0, 0]}
            />
          </BarChart>
        </ChartContainer>
      </div>
    </div>
  )
}
