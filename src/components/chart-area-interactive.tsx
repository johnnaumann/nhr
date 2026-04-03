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
import { ChartEmptyState } from "@/components/ui/chart-empty-state"
import { ChartTooltipValue } from "@/components/ui/chart-tooltip-value"
import {
  ToggleGroup,
  ToggleGroupItem,
} from "@/components/ui/toggle-group"
import { useDashboardDateRange } from "@/contexts/dashboard-date-range-context"
import {
  buildPieInsight,
  parseIsoDate,
  type PieInsightRow,
} from "@/lib/chart-helpers"
import { chartContentClass, chartPanelClass, pieInsightClass } from "@/lib/chart-layout"
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


function daySeedFromIso(iso: string) {
  return Math.floor(parseIsoDate(iso).getTime() / 86400000)
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

const WORKSHEET_PIE_COPY = {
  tiedSuffix:
    "Compare their curves in the line chart to see timing.",
  balancedText:
    "Workload is fairly even across institutions this period\u2014no single site dominates.",
  dominantSuffix:
    "Worth confirming whether that reflects real volume or documentation habits at that site.",
} as const

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

    const breakdown: PieInsightRow[] = activeKeys.map((key) => {
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
    const pieInsight = buildPieInsight(sortedBreakdown, total, WORKSHEET_PIE_COPY)

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
      <CardContent className={chartContentClass}>
        {/*
          Same horizontal inset as SectionCards / toolbar (px-4 lg:px-6). Grid
          still mirrors four stat columns at @5xl (line 3, pie 1).
        */}
        <div className="grid grid-cols-1 items-stretch gap-4 lg:gap-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
          <div className={`${chartPanelClass} @xl/main:col-span-2 @5xl/main:col-span-3`}>
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
                        const d = parseIsoDate(
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

          <div className={`${chartPanelClass} @xl/main:col-span-2 @5xl/main:col-span-1`}>
            {pieTotal > 0 && visibleKeys.length > 0 ? (
              <p className={pieInsightClass}>
                <span className="font-medium text-foreground">Summary: </span>
                {pieInsight}
              </p>
            ) : null}
            <div className="flex h-[240px] w-full shrink-0 flex-col items-center justify-center md:h-[280px]">
              {visibleKeys.length === 0 ? (
                <ChartEmptyState variant="pie">
                  Turn on at least one institution in the legend to see the pie
                  chart.
                </ChartEmptyState>
              ) : pieTotal === 0 ? (
                <ChartEmptyState variant="pie">
                  No worksheet changes in this period
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
                          nameKey="category"
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
