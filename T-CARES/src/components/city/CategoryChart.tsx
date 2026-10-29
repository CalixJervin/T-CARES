import { useMemo } from "react"
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"
import { CATEGORIES } from "@/lib/constants"
import type { Category, Ticket } from "@/lib/types"

interface CategoryChartProps {
  tickets: Ticket[]
}

const chartConfig: ChartConfig = {
  tickets: {
    label: "Tickets",
    color: "hsl(var(--primary))",
  },
}

export function CategoryChart({ tickets }: CategoryChartProps) {
  const data = useMemo(() => {
    const counts = (Object.keys(CATEGORIES) as Category[]).reduce(
      (acc, key) => {
        acc[key] = 0
        return acc
      },
      {} as Record<Category, number>
    )

    tickets.forEach((t) => {
      if (counts[t.category] !== undefined) {
        counts[t.category] += 1
      }
    })

    return (Object.keys(CATEGORIES) as Category[]).map((cat) => ({
      category: CATEGORIES[cat].name.split("&")[0].trim(),
      fullName: CATEGORIES[cat].name,
      tickets: counts[cat] || 0,
      fill: CATEGORIES[cat].color,
    }))
  }, [tickets])

  return (
    <div className="rounded-xl border border-border bg-card p-4 shadow-xs">
      <div className="mb-3">
        <h3 className="text-xs font-bold tracking-wider text-foreground uppercase">
          Tickets by Category
        </h3>
        <p className="text-[11px] text-muted-foreground">
          Distribution of master complaints across civic services
        </p>
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
              dataKey="tickets"
              radius={[4, 4, 0, 0]}
              fill="var(--color-primary)"
            />
          </BarChart>
        </ChartContainer>
      </div>
    </div>
  )
}
