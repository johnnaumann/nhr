"use client"

import * as React from "react"
import { format, startOfWeek } from "date-fns"
import { ArrowDownUpIcon, SearchIcon } from "lucide-react"
import { Bar, BarChart, CartesianGrid, Pie, PieChart, XAxis, YAxis } from "recharts"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
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
import { RadioGroupItemMulti } from "@/components/ui/radio-group"
import { useDashboardDateRange } from "@/contexts/dashboard-date-range-context"
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
    const dayIndex = Math.floor(parseDataDate(date).getTime() / 86400000)
    const row = { date } as ChangeDayRow
    TYPE_KEYS.forEach((key, keyIndex) => {
      row[key] = stackValue(dayIndex, keyIndex, key)
    })
    return row
  })
}

function parseDataDate(iso: string) {
  const [y, mo, d] = iso.split("-").map(Number)
  return new Date(y, mo - 1, d)
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
        period: format(parseDataDate(r.date), "MMM d"),
        iso: r.date,
        ...values,
      } satisfies BarRow
    })
  }

  const map = new Map<
    string,
    { weekStart: Date; sums: Record<ChangeTypeKey, number> }
  >()
  for (const r of filteredDays) {
    const d = parseDataDate(r.date)
    const ws = startOfWeek(d, { weekStartsOn: 1 })
    const key = format(ws, "yyyy-MM-dd")
    let agg = map.get(key)
    if (!agg) {
      const sums = {} as Record<ChangeTypeKey, number>
      TYPE_KEYS.forEach((k) => {
        sums[k] = 0
      })
      agg = { weekStart: ws, sums }
      map.set(key, agg)
    }
    TYPE_KEYS.forEach((k) => {
      agg!.sums[k] += r[k]
    })
  }
  return [...map.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([, agg]) => {
      const values = {} as Record<ChangeTypeKey, number>
      TYPE_KEYS.forEach((k) => {
        values[k] = agg.sums[k]
      })
      return {
        period: `Week of ${format(agg.weekStart, "MMM d")}`,
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

type TypesPieBreakdownRow = {
  key: ChangeTypeKey
  label: string
  value: number
  pct: number
}

function buildTypesPieInsight(
  sorted: TypesPieBreakdownRow[],
  total: number
): string {
  if (sorted.length === 0 || total === 0) {
    return ""
  }
  const top = sorted[0]!
  const second = sorted[1]
  const bottom = sorted[sorted.length - 1]!
  const spread = top.pct - bottom.pct

  if (second && Math.abs(top.pct - second.pct) < 4) {
    return `${top.label} and ${second.label} are almost tied (${top.pct.toFixed(1)}% vs ${second.pct.toFixed(1)}%). Compare their stacks in the bar chart to see how volumes shift by period.`
  }
  if (spread < 12) {
    return "Change types are fairly balanced this period—no single category dominates the mix."
  }
  if (top.pct >= 38) {
    return `${top.label} accounts for a large share (${top.pct.toFixed(1)}%). Worth confirming whether that reflects real remediation volume or how changes are classified.`
  }
  return `${top.label} leads with ${top.pct.toFixed(1)}% of ${total.toLocaleString()} total changes; ${bottom.label} is lowest at ${bottom.pct.toFixed(1)}%.`
}

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
    const breakdown: TypesPieBreakdownRow[] = active.map(
      ({ key, label, count }) => ({
        key,
        label,
        value: count,
        pct: total > 0 ? (count / total) * 100 : 0,
      })
    )
    const sortedBreakdown = [...breakdown].sort((a, b) => b.value - a.value)
    const pieInsight = buildTypesPieInsight(sortedBreakdown, total)
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
      <CardContent className="px-4 pt-2 pb-2 sm:pt-4 lg:px-6">
        <div className="grid grid-cols-1 gap-4 @xl/types-chart:grid-cols-12 @xl/types-chart:items-stretch">
            {/* Amounts + legend */}
            <div className="flex min-h-0 min-w-0 flex-col @xl/types-chart:col-span-3">
              <div className="flex h-full min-h-0 flex-1 flex-col gap-3 rounded-xl border border-border/60 bg-muted/40 p-3 sm:p-4 dark:bg-muted/20">
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
                <ul className="flex flex-col gap-3" aria-label="Filter change types on charts">
                  {sortedAmounts.map(({ key, label, count }) => {
                    const filterId = `types-chart-filter-${key}`
                    const isOn = visibleKeys.includes(key)
                    return (
                      <li
                        key={key}
                        className={cn(
                          "flex min-w-0 items-center gap-2.5 text-sm transition-opacity",
                          !isOn && "opacity-40"
                        )}
                      >
                        <RadioGroupItemMulti
                          id={filterId}
                          checked={isOn}
                          indicatorColor={chartConfig[key].color}
                          onCheckedChange={(on) => {
                            setVisibleKeys((prev) => {
                              if (on) {
                                if (prev.includes(key)) return prev
                                const next = new Set(prev)
                                next.add(key)
                                return TYPE_KEYS.filter((k) => next.has(k))
                              }
                              return prev.filter((k) => k !== key)
                            })
                          }}
                        />
                        <label
                          htmlFor={filterId}
                          className="min-w-0 flex-1 cursor-pointer truncate font-medium text-foreground"
                        >
                          {label}
                        </label>
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
                    )
                  })}
                </ul>
              </div>
            </div>

            {/* Stacked bars */}
            <div className="flex min-h-0 min-w-0 flex-col rounded-xl border border-border/60 bg-muted/40 p-3 sm:p-4 @xl/types-chart:col-span-6 dark:bg-muted/20">
              {visibleKeys.length === 0 ? (
                <div className="flex min-h-[240px] w-full flex-1 items-center justify-center px-2 text-center text-sm text-muted-foreground md:min-h-[280px]">
                  Select at least one change type in the list to see the stacked
                  bar chart.
                </div>
              ) : barChartData.length === 0 ? (
                <div className="flex min-h-[240px] w-full flex-1 items-center justify-center px-2 text-center text-sm text-muted-foreground md:min-h-[280px]">
                  No bar data for this selection.
                </div>
              ) : (
                <ChartContainer
                  config={chartConfig}
                  className="!aspect-auto min-h-[240px] w-full min-w-0 flex-1 md:min-h-[280px]"
                >
                  <BarChart
                    accessibilityLayer
                    data={barChartData}
                    margin={{ left: 0, right: 8, top: 8, bottom: 0 }}
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
                      width={32}
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
                                parseDataDate(row.iso.slice(0, 10)),
                                "MMM d, yyyy"
                              )
                            }
                            return String(label)
                          }}
                          indicator="dot"
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
              <div className="flex h-full min-h-0 min-w-0 flex-1 flex-col rounded-xl border border-border/60 bg-muted/40 p-3 sm:p-4 dark:bg-muted/20">
                <div className="flex h-[240px] w-full shrink-0 flex-col items-center justify-center md:h-[280px]">
                  {visibleKeys.length === 0 ? (
                    <div className="flex h-full w-full items-center justify-center px-2 text-center text-sm text-muted-foreground">
                      Select at least one change type to see the pie chart.
                    </div>
                  ) : pieTotal === 0 ? (
                    <div className="flex h-full w-full items-center justify-center text-center text-sm text-muted-foreground">
                      No changes in this selection
                    </div>
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
                              formatter={(value) => {
                                const v = Number(value)
                                const pct =
                                  pieTotal > 0
                                    ? ((v / pieTotal) * 100).toFixed(1)
                                    : "0.0"
                                return (
                                  <span className="inline-flex flex-wrap items-baseline gap-x-1 text-xs leading-none">
                                    <span className="font-mono font-medium text-foreground tabular-nums">
                                      {v.toLocaleString()}
                                    </span>
                                    <span className="text-muted-foreground">
                                      changes
                                    </span>
                                    <span className="font-mono font-medium text-foreground tabular-nums">
                                      ({pct}%)
                                    </span>
                                    <span className="text-muted-foreground">
                                      of total
                                    </span>
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
                  )}
                </div>
                {pieTotal > 0 && visibleKeys.length > 0 ? (
                  <p className="max-h-24 w-full shrink-0 overflow-y-auto pt-2 text-left text-xs leading-relaxed text-muted-foreground">
                    <span className="font-medium text-foreground">Summary: </span>
                    {pieInsight}
                  </p>
                ) : null}
              </div>
            </div>
        </div>
      </CardContent>
    </Card>
  )
}
