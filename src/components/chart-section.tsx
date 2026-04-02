"use client"

import * as React from "react"
import { ArrowDownUpIcon, SearchIcon } from "lucide-react"
import { Bar, BarChart, CartesianGrid, Pie, PieChart, XAxis, YAxis } from "recharts"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"

const TYPE_KEYS = [
  "drg",
  "cqe",
  "hospitalMod",
  "needsAddDoc",
  "noChange",
  "noDecision",
] as const

type ChangeTypeKey = (typeof TYPE_KEYS)[number]

const AMOUNTS: { key: ChangeTypeKey; label: string; count: number }[] = [
  { key: "drg", label: "DRG Changes", count: 285 },
  { key: "cqe", label: "CQE", count: 9 },
  { key: "hospitalMod", label: "Hospital Mod", count: 4 },
  { key: "needsAddDoc", label: "Needs Add Doc", count: 5 },
  { key: "noChange", label: "No Change", count: 742 },
  { key: "noDecision", label: "No Decision", count: 10 },
]

const chartConfig = {
  drg: { label: "DRG Changes", color: "var(--chart-1)" },
  cqe: { label: "CQE", color: "var(--chart-5)" },
  hospitalMod: { label: "Hospital Mod", color: "var(--chart-3)" },
  needsAddDoc: { label: "Needs Add Doc", color: "var(--chart-2)" },
  noChange: { label: "No Change", color: "var(--chart-4)" },
  noDecision: { label: "No Decision", color: "var(--muted)" },
} satisfies ChartConfig

/** Deterministic demo volumes per period so bars stay stable between renders. */
function stackValue(periodIndex: number, keyIndex: number, key: ChangeTypeKey) {
  const n = periodIndex * 17 + keyIndex * 31 + key.charCodeAt(2)
  const wave = Math.sin(n * 0.35) * 0.35 + 0.65
  const base =
    key === "noChange"
      ? 55
      : key === "drg"
        ? 22
        : key === "cqe" || key === "hospitalMod" || key === "needsAddDoc"
          ? 6
          : 8
  return Math.max(2, Math.round(base * wave + (n % 7)))
}

const stackedOverTime = Array.from({ length: 8 }, (_, periodIndex) => {
  const row: Record<string, number | string> = {
    period: `W${periodIndex + 1}`,
  }
  TYPE_KEYS.forEach((key, keyIndex) => {
    row[key] = stackValue(periodIndex, keyIndex, key)
  })
  return row
})

export function ChartSection() {
  const [sortDesc, setSortDesc] = React.useState(true)

  const sortedAmounts = React.useMemo(() => {
    const next = [...AMOUNTS]
    next.sort((a, b) => (sortDesc ? b.count - a.count : a.count - b.count))
    return next
  }, [sortDesc])

  const pieData = React.useMemo(
    () =>
      AMOUNTS.map(({ key, label, count }) => ({
        type: key,
        name: label,
        value: count,
        fill: `var(--color-${key})`,
      })),
    []
  )

  const pieTotal = React.useMemo(
    () => AMOUNTS.reduce((acc, r) => acc + r.count, 0),
    []
  )

  return (
    <div className="px-4 lg:px-6">
      <Card className="@container/types-chart">
        <CardHeader className="pb-2">
          <CardTitle>Types of Changes</CardTitle>
        </CardHeader>
        <CardContent className="pb-4 pt-0 sm:pb-6">
          <div className="grid grid-cols-1 gap-6 @xl/types-chart:grid-cols-12 @xl/types-chart:items-stretch">
            {/* Amounts + legend */}
            <div className="flex min-h-0 min-w-0 flex-col gap-3 @xl/types-chart:col-span-3">
              <div className="flex items-start justify-between gap-2">
                <p className="text-sm text-muted-foreground">
                  Amount of Types of Changes
                </p>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-xs"
                  className="shrink-0 text-muted-foreground"
                  aria-label={
                    sortDesc
                      ? "Sort ascending by count"
                      : "Sort descending by count"
                  }
                  onClick={() => setSortDesc((d) => !d)}
                >
                  <ArrowDownUpIcon className="size-3.5" />
                </Button>
              </div>
              <ul className="flex flex-col gap-3">
                {sortedAmounts.map(({ key, label, count }) => (
                  <li
                    key={key}
                    className="flex min-w-0 items-center gap-2.5 text-sm"
                  >
                    <span
                      className="size-3.5 shrink-0 rounded-sm border border-border shadow-none"
                      style={{
                        backgroundColor: chartConfig[key].color,
                      }}
                      aria-hidden
                    />
                    <span className="min-w-0 flex-1 truncate font-medium text-foreground">
                      {label}
                    </span>
                    <Badge
                      variant="secondary"
                      className="shrink-0 gap-1 tabular-nums"
                    >
                      <span>{count.toLocaleString()}</span>
                      <SearchIcon
                        className="size-3 opacity-60"
                        aria-hidden
                      />
                    </Badge>
                  </li>
                ))}
              </ul>
            </div>

            {/* Stacked bars — over time */}
            <div className="flex min-h-0 min-w-0 flex-col gap-3 rounded-xl border border-border/60 bg-muted/40 p-3 sm:p-4 @xl/types-chart:col-span-6 dark:bg-muted/20">
              <p className="text-sm text-muted-foreground">Over Time</p>
              <ChartContainer
                config={chartConfig}
                className="!aspect-auto min-h-[220px] w-full min-w-0 flex-1 md:min-h-[260px]"
              >
                <BarChart
                  accessibilityLayer
                  data={stackedOverTime}
                  margin={{ left: 0, right: 8, top: 8, bottom: 0 }}
                  barCategoryGap="18%"
                >
                  <CartesianGrid vertical={false} strokeDasharray="3 3" />
                  <XAxis
                    dataKey="period"
                    tickLine={false}
                    axisLine={false}
                    tickMargin={8}
                  />
                  <YAxis
                    tickLine={false}
                    axisLine={false}
                    tickMargin={8}
                    width={32}
                    domain={[0, "auto"]}
                    tickFormatter={(v) => String(Math.round(Number(v)))}
                  />
                  <ChartTooltip
                    cursor={{ fill: "var(--muted)", opacity: 0.35 }}
                    content={
                      <ChartTooltipContent
                        labelFormatter={(label) => `Period ${String(label)}`}
                        indicator="dot"
                      />
                    }
                  />
                  {TYPE_KEYS.map((key) => (
                    <Bar
                      key={key}
                      dataKey={key}
                      stackId="changes"
                      fill={`var(--color-${key})`}
                      stroke="var(--card)"
                      strokeWidth={1}
                      radius={0}
                    />
                  ))}
                </BarChart>
              </ChartContainer>
            </div>

            {/* Total pie */}
            <div className="flex min-h-0 min-w-0 flex-col items-center gap-3 @xl/types-chart:col-span-3">
              <p className="w-full text-sm text-muted-foreground">Total</p>
              <div className="flex w-full max-w-[220px] flex-1 flex-col items-center justify-center">
                <ChartContainer
                  config={chartConfig}
                  className="!aspect-square h-[200px] w-full max-w-[200px] min-w-0 sm:h-[220px] sm:max-w-[220px]"
                >
                  <PieChart>
                    <ChartTooltip
                      cursor={false}
                      content={
                        <ChartTooltipContent
                          hideLabel
                          nameKey="type"
                          indicator="dot"
                          formatter={(value) => {
                            const v = Number(value)
                            const pct =
                              pieTotal > 0
                                ? ((v / pieTotal) * 100).toFixed(1)
                                : "0.0"
                            return (
                              <span className="text-xs tabular-nums">
                                {v.toLocaleString()} ({pct}%)
                              </span>
                            )
                          }}
                        />
                      }
                    />
                    <Pie
                      data={pieData}
                      dataKey="value"
                      nameKey="type"
                      stroke="var(--border)"
                      strokeWidth={1}
                    />
                  </PieChart>
                </ChartContainer>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
