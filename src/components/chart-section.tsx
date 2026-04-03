"use client"

import * as React from "react"
import { format, startOfWeek } from "date-fns"
import { Bar, BarChart, CartesianGrid, Pie, PieChart, XAxis, YAxis } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"
import { ChartEmptyState } from "@/components/ui/chart-empty-state"
import { ChartLegendList } from "@/components/ui/chart-legend-list"
import { ChartTooltipValue } from "@/components/ui/chart-tooltip-value"
import { useDashboardDateRange } from "@/contexts/dashboard-date-range-context"
import {
  buildPieInsight,
  parseIsoDate,
  toggleVisibleKey,
  type PieInsightRow,
} from "@/lib/chart-helpers"
import {
  chartContentClass,
  chartPanelClass,
  legendPanelClass,
  pieInsightClass,
} from "@/lib/chart-layout"
import { eachIsoDateInDashboardRange } from "@/lib/dashboard-demo-range"
import { cn } from "@/lib/utils"

const TYPE_KEYS = [
  "drg",
  "cqe",
  "hospitalMod",
  "needsAddDoc",
  "noChange",
  "noDecision",
] as const

type ChangeTypeKey = (typeof TYPE_KEYS)[number]

type ChangeDayRow = { date: string } & Record<ChangeTypeKey, number>

const chartConfig = {
  drg: { label: "DRG Changes", color: "var(--chart-1)" },
  cqe: { label: "CQE", color: "var(--chart-5)" },
  hospitalMod: { label: "Hospital Mod", color: "var(--chart-3)" },
  needsAddDoc: { label: "Needs Add Doc", color: "var(--chart-2)" },
  noChange: { label: "No Change", color: "var(--chart-4)" },
  noDecision: { label: "No Decision", color: "var(--muted)" },
} satisfies ChartConfig

/** Deterministic demo volumes per day (same day index as worksheets chart). */
function stackValue(dayIndex: number, keyIndex: number, key: ChangeTypeKey) {
  const n = dayIndex * 17 + keyIndex * 31 + key.charCodeAt(2)
  const wave = Math.sin(n * 0.35) * 0.35 + 0.65
  const base =
    key === "noChange"
      ? 36
      : key === "drg"
        ? 30
        : key === "cqe"
          ? 26
          : key === "needsAddDoc"
            ? 24
            : key === "noDecision"
              ? 23
              : 20
  return Math.max(2, Math.round(base * wave + (n % 7)))
}

function buildChangeRowsForIsos(isos: string[]): ChangeDayRow[] {
  return isos.map((date) => {
    const dayIndex = Math.floor(parseIsoDate(date).getTime() / 86400000)
    const row = { date } as ChangeDayRow
    TYPE_KEYS.forEach((key, keyIndex) => {
      row[key] = stackValue(dayIndex, keyIndex, key)
    })
    return row
  })
}


const DAILY_BAR_POINT_MAX = 31

type BarRow = { period: string; iso?: string } & Record<ChangeTypeKey, number>

function toBarChartRows(filteredDays: ChangeDayRow[]): BarRow[] {
  if (filteredDays.length === 0) {
    return []
  }
  if (filteredDays.length <= DAILY_BAR_POINT_MAX) {
    return filteredDays.map((r) => {
      const values = {} as Record<ChangeTypeKey, number>
      TYPE_KEYS.forEach((k) => {
        values[k] = r[k]
      })
      return {
        period: format(parseIsoDate(r.date), "MMM d"),
        iso: r.date,
        ...values,
      } satisfies BarRow
    })
  }

  const map = new Map<
    string,
    { weekStart: Date; sums: Record<ChangeTypeKey, number>; dayCount: number }
  >()
  for (const r of filteredDays) {
    const d = parseIsoDate(r.date)
    const ws = startOfWeek(d, { weekStartsOn: 1 })
    const key = format(ws, "yyyy-MM-dd")
    let agg = map.get(key)
    if (!agg) {
      const sums = {} as Record<ChangeTypeKey, number>
      TYPE_KEYS.forEach((k) => {
        sums[k] = 0
      })
      agg = { weekStart: ws, sums, dayCount: 0 }
      map.set(key, agg)
    }
    TYPE_KEYS.forEach((k) => {
      agg!.sums[k] += r[k]
    })
    agg.dayCount += 1
  }

  const sorted = [...map.entries()].sort(([a], [b]) => a.localeCompare(b))

  if (sorted.length >= 2 && sorted[0][1].dayCount < 4) {
    const [, partial] = sorted.shift()!
    const next = sorted[0][1]
    TYPE_KEYS.forEach((k) => {
      next.sums[k] += partial.sums[k]
    })
    next.dayCount += partial.dayCount
  }

  if (sorted.length >= 2 && sorted[sorted.length - 1][1].dayCount < 4) {
    const [, partial] = sorted.pop()!
    const prev = sorted[sorted.length - 1][1]
    TYPE_KEYS.forEach((k) => {
      prev.sums[k] += partial.sums[k]
    })
    prev.dayCount += partial.dayCount
  }

  return sorted.map(([, agg]) => {
    const values = {} as Record<ChangeTypeKey, number>
    TYPE_KEYS.forEach((k) => {
      values[k] = agg.sums[k]
    })
    return {
      period: `w/c ${format(agg.weekStart, "MMM d")}`,
      iso: format(agg.weekStart, "yyyy-MM-dd"),
      ...values,
    } satisfies BarRow
  })
}

function sumsByType(rows: ChangeDayRow[]): Record<ChangeTypeKey, number> {
  const sums = {} as Record<ChangeTypeKey, number>
  TYPE_KEYS.forEach((k) => {
    sums[k] = 0
  })
  for (const r of rows) {
    TYPE_KEYS.forEach((k) => {
      sums[k] += r[k]
    })
  }
  return sums
}

const TYPES_PIE_COPY = {
  tiedSuffix:
    "Compare their stacks in the bar chart to see how volumes shift by period.",
  balancedText:
    "Change types are fairly balanced this period\u2014no single category dominates the mix.",
  dominantSuffix:
    "Worth confirming whether that reflects real remediation volume or how changes are classified.",
} as const

const DEFAULT_VISIBLE_TYPES = [...TYPE_KEYS] as ChangeTypeKey[]

export function ChartSection() {
  const { range } = useDashboardDateRange()
  const [sortDesc, setSortDesc] = React.useState(true)
  const [visibleKeys, setVisibleKeys] =
    React.useState<ChangeTypeKey[]>(DEFAULT_VISIBLE_TYPES)

  const filteredDays = React.useMemo(
    () => buildChangeRowsForIsos(eachIsoDateInDashboardRange(range)),
    [range]
  )

  const barChartData = React.useMemo(
    () => toBarChartRows(filteredDays),
    [filteredDays]
  )

  const amountRows = React.useMemo(() => {
    const sums = sumsByType(filteredDays)
    return TYPE_KEYS.map((key) => ({
      key,
      label: String(chartConfig[key].label),
      count: sums[key],
      color: chartConfig[key].color!,
    }))
  }, [filteredDays])

  const sortedAmounts = React.useMemo(() => {
    const next = [...amountRows]
    next.sort((a, b) => (sortDesc ? b.count - a.count : a.count - b.count))
    return next
  }, [amountRows, sortDesc])

  const { pieData, pieTotal, pieInsight } = React.useMemo(() => {
    const active = amountRows.filter((r) => visibleKeys.includes(r.key))
    const total = active.reduce((acc, r) => acc + r.count, 0)
    const breakdown: PieInsightRow[] = active.map(
      ({ key, label, count }) => ({
        key,
        label,
        value: count,
        pct: total > 0 ? (count / total) * 100 : 0,
      })
    )
    const sortedBreakdown = [...breakdown].sort((a, b) => b.value - a.value)
    const pieInsight = buildPieInsight(sortedBreakdown, total, TYPES_PIE_COPY)
    const pieData = active.map(({ key, label, count }) => ({
      type: key,
      name: label,
      value: count,
      fill: `var(--color-${key})`,
    }))
    return { pieData, pieTotal: total, pieInsight }
  }, [amountRows, visibleKeys])

  return (
    <Card className="@container/types-chart">
      <CardHeader className="pt-2">
        <CardTitle>Types of Changes</CardTitle>
        <CardDescription>
          <span className="hidden @[540px]/types-chart:block">
            Required document changes by category—counts, trend over time, and
            share of total for the reporting period selected above
          </span>
          <span className="@[540px]/types-chart:hidden">By change type</span>
        </CardDescription>
      </CardHeader>
      <CardContent className={chartContentClass}>
        <div className="grid grid-cols-1 gap-4 lg:gap-6 @xl/types-chart:grid-cols-12 @xl/types-chart:items-stretch">
            {/* Amounts + legend */}
            <div className="flex min-h-0 min-w-0 flex-col @xl/types-chart:col-span-3">
              <ChartLegendList
                title="Amount of Types of Changes"
                items={sortedAmounts}
                visibleKeys={visibleKeys}
                onToggle={(key, on) =>
                  setVisibleKeys((prev) =>
                    toggleVisibleKey(prev, key as ChangeTypeKey, on, TYPE_KEYS)
                  )
                }
                sortDesc={sortDesc}
                onToggleSort={() => setSortDesc((d) => !d)}
                idPrefix="types-chart-filter"
                ariaLabel="Filter change types on charts"
              />
            </div>

            {/* Stacked bars */}
            <div className={cn(chartPanelClass, "@xl/types-chart:col-span-6")}>
              {visibleKeys.length === 0 ? (
                <ChartEmptyState>
                  Select at least one change type in the list to see the stacked
                  bar chart.
                </ChartEmptyState>
              ) : barChartData.length === 0 ? (
                <ChartEmptyState>
                  No bar data for this selection.
                </ChartEmptyState>
              ) : (
                <ChartContainer
                  config={chartConfig}
                  className="!aspect-auto min-h-[240px] w-full min-w-0 flex-1 md:min-h-[280px]"
                >
                  <BarChart
                    accessibilityLayer
                    data={barChartData}
                    margin={{ left: 4, right: 8, top: 8, bottom: 4 }}
                    barCategoryGap="18%"
                  >
                    <CartesianGrid vertical={false} strokeDasharray="3 3" />
                    <XAxis
                      dataKey="period"
                      tickLine={false}
                      axisLine={false}
                      tickMargin={8}
                      minTickGap={filteredDays.length <= DAILY_BAR_POINT_MAX ? 8 : 4}
                    />
                    <YAxis
                      tickLine={false}
                      axisLine={false}
                      tickMargin={8}
                      width={44}
                      domain={[0, "auto"]}
                      tickFormatter={(v) => String(Math.round(Number(v)))}
                    />
                    <ChartTooltip
                      cursor={{ fill: "var(--muted)", opacity: 0.35 }}
                      content={
                        <ChartTooltipContent
                          labelFormatter={(label, payload) => {
                            const row = payload?.[0]?.payload as
                              | BarRow
                              | undefined
                            if (row?.iso) {
                              return format(
                                parseIsoDate(row.iso.slice(0, 10)),
                                "MMM d, yyyy"
                              )
                            }
                            return String(label)
                          }}
                          indicator="dot"
                          showTotal
                        />
                      }
                    />
                    {TYPE_KEYS.map((key) =>
                      visibleKeys.includes(key) ? (
                        <Bar
                          key={key}
                          dataKey={key}
                          stackId="changes"
                          fill={`var(--color-${key})`}
                          stroke="var(--card)"
                          strokeWidth={1}
                          radius={0}
                        />
                      ) : null
                    )}
                  </BarChart>
                </ChartContainer>
              )}
            </div>

            {/* Pie chart */}
            <div className="flex h-full min-h-0 min-w-0 flex-col @xl/types-chart:col-span-3">
              <div className={legendPanelClass}>
                {pieTotal > 0 && visibleKeys.length > 0 ? (
                  <p className={pieInsightClass}>
                    <span className="font-medium text-foreground">Summary: </span>
                    {pieInsight}
                  </p>
                ) : null}
                <div className="flex h-[240px] w-full shrink-0 flex-col items-center justify-center md:h-[280px]">
                  {visibleKeys.length === 0 ? (
                    <ChartEmptyState variant="pie">
                      Select at least one change type to see the pie chart.
                    </ChartEmptyState>
                  ) : pieTotal === 0 ? (
                    <ChartEmptyState variant="pie">
                      No changes in this selection
                    </ChartEmptyState>
                  ) : (
                    <ChartContainer
                      config={chartConfig}
                      className="!aspect-auto h-full w-full max-w-full min-w-0"
                    >
                      <PieChart>
                        <ChartTooltip
                          cursor={false}
                          content={
                            <ChartTooltipContent
                              hideLabel
                              nameKey="type"
                              indicator="dot"
                              formatter={(value) => (
                                <ChartTooltipValue
                                  value={Number(value)}
                                  total={pieTotal}
                                />
                              )}
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
                  )}
                </div>
              </div>
            </div>
        </div>
      </CardContent>
    </Card>
  )
}
