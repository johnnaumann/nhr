"use client"

import * as React from "react"
import {
  CartesianGrid,
  Line,
  LineChart,
  Pie,
  PieChart,
  XAxis,
  YAxis,
} from "recharts"

import {
  Card,
  CardAction,
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
import {
  ToggleGroup,
  ToggleGroupItem,
} from "@/components/ui/toggle-group"
import { useDashboardDateRange } from "@/contexts/dashboard-date-range-context"
import { eachIsoDateInDashboardRange } from "@/lib/dashboard-demo-range"

export const description =
  "Worksheets changed over time by institution with totals"

const SERIES_KEYS = [
  "institution1",
  "institution2",
  "institution3",
  "institution4",
] as const

type InstitutionKey = (typeof SERIES_KEYS)[number]

type WorksheetRow = { date: string } & Record<InstitutionKey, number>

/** Smooth demo series: layered slow waves so lines read as flowing, not stepped. */
function smoothSeries(
  dayIndex: number,
  base: number,
  amp: number,
  phase: number,
  freq: number
) {
  const t = dayIndex * freq
  const v =
    base +
    amp * 0.55 * Math.sin(t + phase) +
    amp * 0.3 * Math.sin(t * 1.7 + phase * 1.3) +
    amp * 0.15 * Math.sin(t * 0.35 + phase * 0.5)
  return Math.round(Math.max(3, Math.min(34, v)))
}

const chartConfig = {
  institution1: {
    label: "LICH",
    color: "var(--chart-1)",
  },
  institution2: {
    label: "LTH",
    color: "var(--chart-2)",
  },
  institution3: {
    label: "NYU",
    color: "var(--chart-3)",
  },
  institution4: {
    label: "WTH",
    color: "var(--chart-4)",
  },
} satisfies ChartConfig

function parseDataDate(iso: string) {
  const [y, m, d] = iso.split("-").map(Number)
  return new Date(y, m - 1, d)
}

function daySeedFromIso(iso: string) {
  return Math.floor(parseDataDate(iso).getTime() / 86400000)
}

function buildWorksheetRowsForRange(isos: string[]): WorksheetRow[] {
  return isos.map((date) => {
    const dayIndex = daySeedFromIso(date)
    return {
      date,
      institution1: smoothSeries(dayIndex, 17, 11, 0.2, 0.11),
      institution2: smoothSeries(dayIndex, 19, 9, 1.1, 0.095),
      institution3: smoothSeries(dayIndex, 14, 12, 2.4, 0.13),
      institution4: smoothSeries(dayIndex, 21, 8, 3.6, 0.088),
    }
  })
}

type PieBreakdownRow = {
  key: InstitutionKey
  label: string
  value: number
  pct: number
}

function buildPieInsight(sorted: PieBreakdownRow[], total: number): string {
  if (sorted.length === 0 || total === 0) {
    return ""
  }
  const top = sorted[0]!
  const second = sorted[1]
  const bottom = sorted[sorted.length - 1]!
  const spread = top.pct - bottom.pct

  if (second && Math.abs(top.pct - second.pct) < 4) {
    return `${top.label} and ${second.label} are almost tied (${top.pct.toFixed(1)}% vs ${second.pct.toFixed(1)}%). Compare their curves in the line chart to see timing.`
  }
  if (spread < 12) {
    return "Workload is fairly even across institutions this period—no single site dominates."
  }
  if (top.pct >= 38) {
    return `${top.label} accounts for a large share (${top.pct.toFixed(1)}%). Worth confirming whether that reflects real volume or documentation habits at that site.`
  }
  return `${top.label} leads with ${top.pct.toFixed(1)}% of ${total.toLocaleString()} total changes; ${bottom.label} is lowest at ${bottom.pct.toFixed(1)}%.`
}

const DEFAULT_VISIBLE = [...SERIES_KEYS] as string[]

export function ChartAreaInteractive() {
  const { range } = useDashboardDateRange()

  const [visibleKeys, setVisibleKeys] =
    React.useState<string[]>(DEFAULT_VISIBLE)

  const filteredData = React.useMemo(
    () => buildWorksheetRowsForRange(eachIsoDateInDashboardRange(range)),
    [range]
  )

  const { pieData, pieTotal, pieInsight } = React.useMemo(() => {
    const sums: Record<InstitutionKey, number> = {
      institution1: 0,
      institution2: 0,
      institution3: 0,
      institution4: 0,
    }
    for (const row of filteredData) {
      sums.institution1 += row.institution1
      sums.institution2 += row.institution2
      sums.institution3 += row.institution3
      sums.institution4 += row.institution4
    }

    const activeKeys = SERIES_KEYS.filter((key) => visibleKeys.includes(key))
    const total = activeKeys.reduce((acc, key) => acc + sums[key], 0)

    const breakdown: PieBreakdownRow[] = activeKeys.map((key) => {
      const value = sums[key]
      const pct = total > 0 ? (value / total) * 100 : 0
      const label = String(chartConfig[key].label)
      return { key, label, value, pct }
    })

    const pieData = breakdown.map(({ key, label, value, pct }) => ({
      category: key,
      name: label,
      value,
      pct,
      fill: `var(--color-${key})`,
    }))

    const sortedBreakdown = [...breakdown].sort((a, b) => b.value - a.value)
    const pieInsight = buildPieInsight(sortedBreakdown, total)

    return { pieData, pieTotal: total, pieInsight }
  }, [filteredData, visibleKeys])

  return (
    <Card className="@container/card">
      <CardHeader className="pt-2">
        <CardTitle>Worksheets changed</CardTitle>
        <CardDescription>
          <span className="hidden @[540px]/card:block">
            Worksheet changes by institution for the reporting period selected
            above
          </span>
          <span className="@[540px]/card:hidden">By institution</span>
        </CardDescription>
        <CardAction className="max-w-full shrink-0 justify-self-end overflow-x-auto pb-0.5 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <ToggleGroup
            type="multiple"
            value={visibleKeys}
            onValueChange={setVisibleKeys}
            variant="outline"
            size="sm"
            spacing={0}
            className="w-max flex-nowrap gap-0"
            aria-label="Show or hide institutions on charts"
          >
            {SERIES_KEYS.map((key) => (
              <ToggleGroupItem
                key={key}
                value={key}
                className="shrink-0 gap-1.5 whitespace-nowrap px-2 data-[state=off]:opacity-40"
              >
                <span
                  className="size-2 shrink-0 rounded-sm"
                  style={{
                    backgroundColor: chartConfig[key].color,
                  }}
                  aria-hidden
                />
                <span className="truncate @[400px]/card-header:max-w-none">
                  {chartConfig[key].label}
                </span>
              </ToggleGroupItem>
            ))}
          </ToggleGroup>
        </CardAction>
      </CardHeader>
      <CardContent className="px-4 pt-2 pb-2 sm:pt-4 lg:px-6">
        {/*
          Same horizontal inset as SectionCards / toolbar (px-4 lg:px-6). Grid
          still mirrors four stat columns at @5xl (line 3, pie 1).
        */}
        <div className="grid grid-cols-1 items-stretch gap-4 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
          <div className="flex h-full min-h-0 min-w-0 flex-col rounded-xl border border-border/60 bg-muted/40 p-3 sm:p-4 @xl/main:col-span-2 @5xl/main:col-span-3 dark:bg-muted/20">
            <ChartContainer
              config={chartConfig}
              className="!aspect-auto min-h-[240px] w-full min-w-0 flex-1 md:min-h-[280px]"
            >
              <LineChart
                accessibilityLayer
                data={filteredData}
                margin={{ left: 0, right: 8, top: 8, bottom: 0 }}
              >
                <CartesianGrid vertical={false} strokeDasharray="3 3" />
                <XAxis
                  dataKey="date"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  minTickGap={28}
                  tickFormatter={(value) => {
                    const date = new Date(value)
                    return date.toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    })
                  }}
                />
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  width={36}
                  domain={[0, "auto"]}
                  tickFormatter={(v) => String(Math.round(v))}
                />
                <ChartTooltip
                  cursor={{ stroke: "var(--border)", strokeWidth: 1 }}
                  content={
                    <ChartTooltipContent
                      labelFormatter={(value) => {
                        const d = parseDataDate(
                          String(value).slice(0, 10)
                        )
                        return d.toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })
                      }}
                      indicator="line"
                      showTotal
                    />
                  }
                />
                {SERIES_KEYS.map((key) =>
                  visibleKeys.includes(key) ? (
                    <Line
                      key={key}
                      dataKey={key}
                      type="natural"
                      stroke={`var(--color-${key})`}
                      strokeWidth={2}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      dot={false}
                      activeDot={{ r: 4 }}
                    />
                  ) : null
                )}
              </LineChart>
            </ChartContainer>
          </div>

          <div className="flex h-full min-h-0 min-w-0 flex-col rounded-xl border border-border/60 bg-muted/40 p-3 sm:p-4 @xl/main:col-span-2 @5xl/main:col-span-1 dark:bg-muted/20">
            {pieTotal > 0 && visibleKeys.length > 0 ? (
              <p className="max-h-24 w-full shrink-0 overflow-y-auto pb-2 text-left text-xs leading-relaxed text-muted-foreground">
                <span className="font-medium text-foreground">Summary: </span>
                {pieInsight}
              </p>
            ) : null}
            <div className="flex h-[240px] w-full shrink-0 flex-col items-center justify-center md:h-[280px]">
              {visibleKeys.length === 0 ? (
                <div className="flex h-full w-full items-center justify-center px-2 text-center text-sm text-muted-foreground">
                  Turn on at least one institution in the legend to see the pie
                  chart.
                </div>
              ) : pieTotal === 0 ? (
                <div className="flex h-full w-full items-center justify-center text-center text-sm text-muted-foreground">
                  No worksheet changes in this period
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
                          nameKey="category"
                          indicator="dot"
                          formatter={(value) => {
                            const v = Number(value)
                            const pct =
                              pieTotal > 0
                                ? ((v / pieTotal) * 100).toFixed(1)
                                : "0.0"
                            return (
                              <span className="inline-flex items-baseline gap-x-1.5 text-xs leading-none">
                                <span className="font-mono font-medium text-foreground tabular-nums">
                                  {v.toLocaleString()}
                                </span>
                                <span className="text-muted-foreground">
                                  changes
                                </span>
                                <span className="font-mono text-muted-foreground tabular-nums">
                                  ({pct}%)
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
                      nameKey="category"
                      stroke="var(--border)"
                      strokeWidth={1}
                    />
                  </PieChart>
                </ChartContainer>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
