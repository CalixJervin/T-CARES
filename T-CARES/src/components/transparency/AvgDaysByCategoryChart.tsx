import { useMemo } from "react"
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"
import { CATEGORIES } from "@/lib/constants"
import { getDaysOpen } from "@/lib/storage"
import type { Category, Ticket } from "@/lib/types"

interface AvgDaysByCategoryChartProps {
  tickets: Ticket[]
}

const chartConfig: ChartConfig = {
  days: {
    label: "Avg Days to Resolve",
    color: "#2563eb",
  },
}

export function AvgDaysByCategoryChart({
  tickets,
}: AvgDaysByCategoryChartProps) {
  const data = useMemo(() => {
    return (Object.keys(CATEGORIES) as Category[]).map((cat) => {
      const resolved = tickets.filter(
        (t) => t.category === cat && t.status === "resolved"
      )

      let avg = 0
      if (resolved.length > 0) {
        const sum = resolved.reduce((acc, t) => acc + getDaysOpen(t), 0)
        avg = Number((sum / resolved.length).toFixed(1))
      }

      return {
        category: CATEGORIES[cat].name.split("&")[0].trim(),
        fullName: CATEGORIES[cat].name,
        days: avg,
        fill: CATEGORIES[cat].color,
        count: resolved.length,
      }
    })
  }, [tickets])

  return (
    <div className="rounded-xl border border-border bg-card p-4 shadow-xs">
      <div className="mb-3">
        <h3 className="text-xs font-bold tracking-wider text-foreground uppercase">
          Average Days to Resolve by Category
        </h3>
        <p className="text-[11px] text-muted-foreground">
          Historical city turnaround speed for completed interventions
        </p>
      </div>

      <div className="h-[240px] w-full">
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
              dataKey="category"
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
              dataKey="days"
              name="Avg Days"
              fill="var(--color-primary)"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ChartContainer>
      </div>
    </div>
  )
}
