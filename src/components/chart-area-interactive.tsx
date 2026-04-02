"use client"

import * as React from "react"
import { endOfDay, isWithinInterval, startOfDay } from "date-fns"
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
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"
import { useDashboardDateRange } from "@/contexts/dashboard-date-range-context"

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

function buildWorksheetChartData(): WorksheetRow[] {
  const rows: WorksheetRow[] = []
  const cursor = new Date(2024, 3, 1)
  const end = new Date(2024, 5, 30)
  let dayIndex = 0
  while (cursor <= end) {
    const y = cursor.getFullYear()
    const m = String(cursor.getMonth() + 1).padStart(2, "0")
    const d = String(cursor.getDate()).padStart(2, "0")
    rows.push({
      date: `${y}-${m}-${d}`,
      institution1: smoothSeries(dayIndex, 17, 11, 0.2, 0.11),
      institution2: smoothSeries(dayIndex, 19, 9, 1.1, 0.095),
      institution3: smoothSeries(dayIndex, 14, 12, 2.4, 0.13),
      institution4: smoothSeries(dayIndex, 21, 8, 3.6, 0.088),
    })
    dayIndex += 1
    cursor.setDate(cursor.getDate() + 1)
  }
  return rows
}

const chartData = buildWorksheetChartData()

const chartConfig = {
  institution1: {
    label: "Institution 1",
    color: "var(--chart-1)",
  },
  institution2: {
    label: "Institution 2",
    color: "var(--chart-2)",
  },
  institution3: {
    label: "Institution 3",
    color: "var(--chart-3)",
  },
  institution4: {
    label: "Institution 4",
    color: "var(--chart-4)",
  },
} satisfies ChartConfig

function parseDataDate(iso: string) {
  const [y, m, d] = iso.split("-").map(Number)
  return new Date(y, m - 1, d)
}

export function ChartAreaInteractive() {
  const { range } = useDashboardDateRange()

  const filteredData = React.useMemo(() => {
    if (!range?.from) {
      return chartData
    }
    const from = startOfDay(range.from)
    const to = endOfDay(range.to ?? range.from)
    const interval = { start: from, end: to }
    return chartData.filter((item) =>
      isWithinInterval(parseDataDate(item.date), interval)
    )
  }, [range])

  const pieData = React.useMemo(() => {
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
    return SERIES_KEYS.map((key) => ({
      category: key,
      value: sums[key],
      fill: `var(--color-${key})`,
    }))
  }, [filteredData])

  const pieTotal = React.useMemo(
    () => pieData.reduce((acc, row) => acc + row.value, 0),
    [pieData]
  )

  return (
    <Card className="@container/card">
      <CardHeader>
        <CardTitle>Worksheets changed</CardTitle>
        <CardDescription>
          <span className="hidden @[540px]/card:block">
            Worksheet changes by institution for the reporting period selected
            above
          </span>
          <span className="@[540px]/card:hidden">By institution</span>
        </CardDescription>
      </CardHeader>
      <CardContent className="px-0 pt-2 pb-4 sm:pt-4">
        {/*
          Matches SectionCards: same grid columns + gap so vertical rhythm aligns
          with the four stat cards (line = 3 cols, pie = 1 col at @5xl/main).
        */}
        <div className="grid grid-cols-1 items-stretch gap-4 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
          <div className="flex h-full min-h-[240px] min-w-0 flex-col gap-2 rounded-xl border border-border/60 bg-muted/40 p-3 sm:p-4 @xl/main:col-span-2 @5xl/main:col-span-3 @5xl/main:min-h-[300px] dark:bg-muted/20">
            <p className="shrink-0 text-sm font-medium text-muted-foreground">
              Over time
            </p>
            <ChartContainer
              config={chartConfig}
              className="!aspect-auto min-h-[12rem] w-full min-w-0 flex-1 md:min-h-[16rem] @5xl/main:min-h-0"
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
                      labelFormatter={(value) =>
                        new Date(value as string).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })
                      }
                      indicator="line"
                    />
                  }
                />
                <ChartLegend content={<ChartLegendContent />} />
                <Line
                  dataKey="institution1"
                  type="natural"
                  stroke="var(--color-institution1)"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  dot={false}
                  activeDot={{ r: 4 }}
                />
                <Line
                  dataKey="institution2"
                  type="natural"
                  stroke="var(--color-institution2)"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  dot={false}
                  activeDot={{ r: 4 }}
                />
                <Line
                  dataKey="institution3"
                  type="natural"
                  stroke="var(--color-institution3)"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  dot={false}
                  activeDot={{ r: 4 }}
                />
                <Line
                  dataKey="institution4"
                  type="natural"
                  stroke="var(--color-institution4)"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  dot={false}
                  activeDot={{ r: 4 }}
                />
              </LineChart>
            </ChartContainer>
          </div>

          <div className="flex h-full min-h-[240px] w-full flex-col gap-2 rounded-xl border border-border/60 bg-muted/40 p-3 sm:p-4 @xl/main:col-span-2 @5xl/main:col-span-1 @5xl/main:min-h-[300px] dark:bg-muted/20">
            <p className="shrink-0 text-sm font-medium text-muted-foreground @5xl/main:text-center">
              Total
            </p>
            <div className="flex min-h-0 flex-1 flex-col items-center justify-center gap-2">
              {pieTotal === 0 ? (
                <div className="flex w-full flex-1 items-center justify-center px-2 text-center text-sm text-muted-foreground">
                  No worksheet changes in this period
                </div>
              ) : (
                <ChartContainer
                  config={chartConfig}
                  className="aspect-square h-full max-h-full min-h-[12rem] w-full max-w-[min(100%,280px)] @5xl/main:max-w-full"
                >
                  <PieChart>
                    <ChartTooltip
                      cursor={false}
                      content={
                        <ChartTooltipContent
                          hideLabel
                          nameKey="category"
                          indicator="dot"
                        />
                      }
                    />
                    <Pie
                      data={pieData}
                      dataKey="value"
                      nameKey="category"
                      stroke="var(--background)"
                      strokeWidth={2}
                    />
                  </PieChart>
                </ChartContainer>
              )}
            </div>
            {pieTotal > 0 ? (
              <p className="shrink-0 text-center text-xs text-muted-foreground tabular-nums">
                {pieTotal.toLocaleString()} changes in view
              </p>
            ) : null}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
