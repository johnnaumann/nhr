"use client"

import * as React from "react"
import { format } from "date-fns"
import {
  Bar,
  BarChart,
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
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"
import { ChartEmptyState } from "@/components/ui/chart-empty-state"
import { ChartLegendList } from "@/components/ui/chart-legend-list"
import { ChartTooltipValue } from "@/components/ui/chart-tooltip-value"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useDashboardDateRange } from "@/contexts/dashboard-date-range-context"
import {
  buildPieInsight,
  parseIsoDate,
  scaleInt,
  toggleVisibleKey,
  type PieInsightRow,
} from "@/lib/chart-helpers"
import {
  chartContentClass,
  chartPanelClass,
  filterSelectTriggerClass,
  filterToolbarClass,
  pieInsightClass,
} from "@/lib/chart-layout"
import {
  DEMO_SCALE_REFERENCE_DAYS,
  eachIsoDateInDashboardRange,
} from "@/lib/dashboard-demo-range"
import { cn } from "@/lib/utils"

const WORK_KEYS = ["changed", "noChanges"] as const
type WorkKey = (typeof WORK_KEYS)[number]

const workStackConfig = {
  changed: { label: "Changed worksheets", color: "var(--chart-1)" },
  noChanges: { label: "No changes", color: "var(--chart-5)" },
} satisfies ChartConfig

const DETAIL_KEYS = [
  "principleDxProc",
  "procedures",
  "ccMcc",
  "dispositions",
  "demographics",
] as const
type DetailKey = (typeof DETAIL_KEYS)[number]

const detailChartConfig = {
  principleDxProc: {
    label: "Principle diagnosis procedures",
    color: "var(--chart-1)",
  },
  procedures: { label: "Procedures", color: "var(--chart-2)" },
  ccMcc: { label: "CC's or MCC's", color: "var(--chart-3)" },
  dispositions: { label: "Dispositions", color: "var(--chart-4)" },
  demographics: { label: "Demographics", color: "var(--chart-5)" },
} satisfies ChartConfig

const DETAIL_BASE: Record<DetailKey, number> = {
  principleDxProc: 18,
  procedures: 45,
  ccMcc: 32,
  dispositions: 8,
  demographics: 56,
}

type CoderBarRow = {
  coder: string
} & Record<WorkKey, number>

const CODER_NAMES = Array.from(
  { length: 10 },
  (_, i) => `Coder ${i + 1}`,
)

/** Dramatically varied stacks — top coders stand out, clear performance tiers. */
const CODER_BAR_BASE: Record<WorkKey, number>[] = [
  { changed: 68, noChanges: 24 },
  { changed: 54, noChanges: 32 },
  { changed: 47, noChanges: 38 },
  { changed: 42, noChanges: 28 },
  { changed: 36, noChanges: 44 },
  { changed: 31, noChanges: 18 },
  { changed: 28, noChanges: 35 },
  { changed: 22, noChanges: 14 },
  { changed: 18, noChanges: 26 },
  { changed: 12, noChanges: 10 },
]

const DEFAULT_VISIBLE_WORK = [...WORK_KEYS] as WorkKey[]
const DEFAULT_VISIBLE_DETAIL = [...DETAIL_KEYS] as DetailKey[]


type DetailLineRow = { period: string; iso: string } & Record<DetailKey, number>

function buildDetailLineSeries(
  filteredIsoDays: string[],
  scale: number
): DetailLineRow[] {
  const cap = 7
  const tail =
    filteredIsoDays.length <= cap
      ? filteredIsoDays
      : filteredIsoDays.slice(-cap)
  if (tail.length === 0) return []

  return tail.map((iso, i) => {
    const row = { period: format(parseIsoDate(iso), "MMM d"), iso } as DetailLineRow
    const t = i / Math.max(1, tail.length - 1)
    DETAIL_KEYS.forEach((key, ki) => {
      const trendSlopes = [0.35, 0.2, -0.25, 0.15, -0.1]
      const bases = [32, 26, 22, 16, 12]
      const trend = trendSlopes[ki]! * t * 20
      const wave =
        Math.sin(i * 1.3 + ki * 1.8) * 4 +
        Math.sin(i * 0.7 + ki * 2.5) * 2.5
      const scaleBoost = Math.max(1, 1.2 / Math.max(0.15, scale))
      row[key] = Math.max(
        3,
        Math.min(45, Math.round((bases[ki]! + trend + wave) * Math.min(scaleBoost, 1.8)))
      )
    })
    return row
  })
}

const DETAIL_PIE_COPY = {
  dominantThreshold: 42,
  dominantSuffix:
    "Compare the line trend to see whether that holds across the period.",
} as const

export function ChartCoderPerformance() {
  const { range } = useDashboardDateRange()

  const rangeIsoDays = React.useMemo(
    () => eachIsoDateInDashboardRange(range),
    [range]
  )

  const scale = React.useMemo(
    () =>
      Math.max(
        0.12,
        rangeIsoDays.length / Math.max(1, DEMO_SCALE_REFERENCE_DAYS)
      ),
    [rangeIsoDays.length]
  )

  const [volumeScope, setVolumeScope] = React.useState("top10")
  const [addFilter, setAddFilter] = React.useState("none")
  const [detailScope, setDetailScope] = React.useState("all")
  const [visibleWork, setVisibleWork] = React.useState<WorkKey[]>(
    DEFAULT_VISIBLE_WORK
  )
  const [visibleDetail, setVisibleDetail] = React.useState<DetailKey[]>(
    DEFAULT_VISIBLE_DETAIL
  )
  const [detailSortDesc, setDetailSortDesc] = React.useState(true)

  const filterMultiplier = addFilter === "drg-cqe" ? 0.72 : addFilter === "all-sheets" ? 1.18 : 1

  const coderBarData = React.useMemo((): CoderBarRow[] => {
    const rows = CODER_NAMES.map((name, i) => {
      const base = CODER_BAR_BASE[i]!
      return {
        coder: name,
        changed: scaleInt(base.changed, scale * filterMultiplier),
        noChanges: scaleInt(base.noChanges, scale * filterMultiplier),
      }
    })
    const ranked = [...rows].sort(
      (a, b) => b.changed + b.noChanges - (a.changed + a.noChanges)
    )
    if (volumeScope === "top5") {
      const top = new Set(ranked.slice(0, 5).map((r) => r.coder))
      return rows.filter((r) => top.has(r.coder))
    }
    if (volumeScope === "top10") {
      const top = new Set(ranked.slice(0, 10).map((r) => r.coder))
      return rows.filter((r) => top.has(r.coder))
    }
    return rows
  }, [scale, volumeScope, filterMultiplier])

  const workTotals = React.useMemo(() => {
    const sums = { changed: 0, noChanges: 0 } as Record<WorkKey, number>
    for (const row of coderBarData) {
      sums.changed += row.changed
      sums.noChanges += row.noChanges
    }
    return sums
  }, [coderBarData])

  const workLegendRows = React.useMemo(() => {
    return WORK_KEYS.map((key) => ({
      key,
      label: String(workStackConfig[key].label),
      count: workTotals[key],
      color: workStackConfig[key].color!,
    }))
  }, [workTotals])

  const detailLineData = React.useMemo(() => {
    const scopeFactor =
      detailScope === "single" ? 0.88 : detailScope === "top5" ? 0.94 : 1
    return buildDetailLineSeries(rangeIsoDays, scale * scopeFactor * filterMultiplier)
  }, [detailScope, rangeIsoDays, scale, filterMultiplier])

  const detailCounts = React.useMemo(() => {
    const next = {} as Record<DetailKey, number>
    DETAIL_KEYS.forEach((k) => {
      next[k] = scaleInt(DETAIL_BASE[k], scale * filterMultiplier)
    })
    return next
  }, [scale, filterMultiplier])

  const detailLegendRows = React.useMemo(() => {
    const rows = DETAIL_KEYS.map((key) => ({
      key,
      label: String(detailChartConfig[key].label),
      count: detailCounts[key],
      color: detailChartConfig[key].color!,
    }))
    rows.sort((a, b) =>
      detailSortDesc ? b.count - a.count : a.count - b.count
    )
    return rows
  }, [detailCounts, detailSortDesc])

  const { pieData, pieTotal, pieInsight } = React.useMemo(() => {
    const active = DETAIL_KEYS.filter((k) => visibleDetail.includes(k))
    const total = active.reduce((acc, k) => acc + detailCounts[k], 0)
    const rows = active.map((key) => {
      const value = detailCounts[key]
      const pct = total > 0 ? (value / total) * 100 : 0
      return {
        key,
        label: String(detailChartConfig[key].label),
        value,
        pct,
      }
    })
    const breakdown: PieInsightRow[] = rows.map(({ label, value, pct }) => ({
      label,
      value,
      pct,
    }))
    const pieData = rows.map(({ key, label, value, pct }) => ({
      category: key,
      name: label,
      value,
      pct,
      fill: `var(--color-${key})`,
    }))
    const sorted = [...breakdown].sort((a, b) => b.value - a.value)
    return {
      pieData,
      pieTotal: total,
      pieInsight: buildPieInsight(sorted, total, DETAIL_PIE_COPY),
    }
  }, [detailCounts, visibleDetail])

  const mergedDetailConfig = React.useMemo(
    () => ({ ...workStackConfig, ...detailChartConfig }),
    []
  )

  return (
    <Card className="@container/coder-performance">
      <CardHeader className="pt-2">
        <CardTitle className="text-lg font-semibold tracking-tight sm:text-xl">
          Coder Performance
        </CardTitle>
        <CardDescription>
          <span className="hidden @[540px]/coder-performance:block">
            Coder volume by worksheet outcome, detail trends, and change-type
            mix for the reporting period selected above
          </span>
          <span className="@[540px]/coder-performance:hidden">
            Coders and change mix
          </span>
        </CardDescription>
      </CardHeader>
      <CardContent className={chartContentClass}>
        {/* Top: stacked bars by coder */}
        <section className="flex flex-col gap-4 lg:gap-6">
          <div className={cn(filterToolbarClass, "items-center")}>
            <span>Displaying</span>
            <Select value={volumeScope} onValueChange={setVolumeScope}>
              <SelectTrigger
                size="sm"
                className={cn(filterSelectTriggerClass, "min-w-[12rem]")}
              >
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="top10">Top 10 coders by volume</SelectItem>
                  <SelectItem value="top5">Top 5 coders by volume</SelectItem>
                  <SelectItem value="all">All coders</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
            <span className="hidden sm:inline">·</span>
            <Select value={addFilter} onValueChange={setAddFilter}>
              <SelectTrigger
                size="sm"
                className={cn(filterSelectTriggerClass, "min-w-[9rem]")}
              >
                <SelectValue placeholder="Add filter" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="none">No extra filter</SelectItem>
                  <SelectItem value="drg-cqe">DRG + CQE worksheets</SelectItem>
                  <SelectItem value="all-sheets">All worksheets</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          <div className="grid min-h-[min(26rem,52vh)] grid-cols-1 gap-4 lg:gap-6 @xl/coder-performance:grid-cols-12 @xl/coder-performance:items-stretch">
            <div className="flex min-h-0 min-w-0 flex-col @xl/coder-performance:col-span-3">
              <ChartLegendList
                title="Worksheet outcomes"
                items={workLegendRows}
                visibleKeys={visibleWork}
                onToggle={(key, on) =>
                  setVisibleWork((prev) =>
                    toggleVisibleKey(prev, key as WorkKey, on, WORK_KEYS)
                  )
                }
                idPrefix="coder-work"
                ariaLabel="Filter stacks on coder chart"
              />
            </div>

            <div
              className={cn(
                "flex min-h-0 min-w-0 flex-1 flex-col @xl/coder-performance:col-span-9",
                chartPanelClass
              )}
            >
              {visibleWork.length === 0 ? (
                <ChartEmptyState variant="chart-tall">
                  Select at least one outcome to see the stacked bars.
                </ChartEmptyState>
              ) : coderBarData.length === 0 ? (
                <ChartEmptyState variant="chart-tall">
                  No coders match this filter.
                </ChartEmptyState>
              ) : (
                <ChartContainer
                  config={workStackConfig}
                  className="!aspect-auto flex h-full min-h-[280px] w-full min-w-0 flex-1 md:min-h-[360px] [&_.recharts-responsive-container]:h-full [&_.recharts-responsive-container]:min-h-[inherit] [&_.recharts-wrapper]:overflow-visible [&_.recharts-surface]:overflow-visible"
                >
                  <BarChart
                    accessibilityLayer
                    data={coderBarData}
                    margin={{ left: 4, right: 8, top: 8, bottom: 4 }}
                    barCategoryGap="14%"
                  >
                    <CartesianGrid vertical={false} strokeDasharray="3 3" />
                    <XAxis
                      dataKey="coder"
                      tickLine={false}
                      axisLine={false}
                      tickMargin={4}
                      interval={0}
                      fontSize={11}
                    />
                    <YAxis
                      tickLine={false}
                      axisLine={false}
                      tickMargin={8}
                      width={36}
                      domain={[0, "auto"]}
                    />
                    <ChartTooltip
                      cursor={{ fill: "var(--muted)", opacity: 0.35 }}
                      content={
                        <ChartTooltipContent indicator="dot" labelKey="coder" showTotal />
                      }
                    />
                    {WORK_KEYS.filter((k) => visibleWork.includes(k)).map((key) => (
                      <Bar
                        key={key}
                        dataKey={key}
                        stackId="coder"
                        fill={`var(--color-${key})`}
                        stroke="var(--card)"
                        strokeWidth={1}
                        radius={0}
                      />
                    ))}
                  </BarChart>
                </ChartContainer>
              )}
            </div>
          </div>
        </section>

        {/* Bottom: line + pie / legend */}
        <section className="flex flex-col gap-4 lg:gap-6">
          <div className={filterToolbarClass}>
            <span>View coder details of</span>
            <Select value={detailScope} onValueChange={setDetailScope}>
              <SelectTrigger
                size="sm"
                className={cn(filterSelectTriggerClass, "min-w-[10rem]")}
              >
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="all">All coders</SelectItem>
                  <SelectItem value="top5">Top 5 by volume</SelectItem>
                  <SelectItem value="single">Single coder (demo)</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-1 gap-4 lg:gap-6 @xl/coder-performance:grid-cols-4 @xl/coder-performance:items-stretch">
            <div
              className={cn(
                "flex min-h-0 min-w-0 flex-col @xl/coder-performance:col-span-2",
                chartPanelClass
              )}
            >
              {visibleDetail.length === 0 ? (
                <ChartEmptyState>
                  Select at least one category in the legend to see trends.
                </ChartEmptyState>
              ) : detailLineData.length === 0 ? (
                <ChartEmptyState>
                  Not enough days in range for a trend.
                </ChartEmptyState>
              ) : (
                <ChartContainer
                  config={detailChartConfig}
                  className="!aspect-auto min-h-[240px] w-full min-w-0 flex-1 md:min-h-[280px]"
                >
                  <LineChart
                    accessibilityLayer
                    data={detailLineData}
                    margin={{ left: 0, right: 8, top: 8, bottom: 0 }}
                  >
                    <CartesianGrid vertical={false} strokeDasharray="3 3" />
                    <XAxis
                      dataKey="period"
                      tickLine={false}
                      axisLine={false}
                      tickMargin={8}
                      minTickGap={24}
                    />
                    <YAxis
                      tickLine={false}
                      axisLine={false}
                      tickMargin={8}
                      width={32}
                      domain={[0, 50]}
                      tickFormatter={(v) => String(Math.round(Number(v)))}
                    />
                    <ChartTooltip
                      cursor={{ stroke: "var(--border)", strokeWidth: 1 }}
                      content={
                        <ChartTooltipContent
                          labelFormatter={(_, payload) => {
                            const iso = payload?.[0]?.payload?.iso as
                              | string
                              | undefined
                            if (iso) {
                              return format(parseIsoDate(iso), "MMM d, yyyy")
                            }
                            return ""
                          }}
                          indicator="line"
                          showTotal
                        />
                      }
                    />
                    {DETAIL_KEYS.filter((k) => visibleDetail.includes(k)).map(
                      (key) => (
                        <Line
                          key={key}
                          type="monotone"
                          dataKey={key}
                          stroke={`var(--color-${key})`}
                          strokeWidth={2}
                          strokeLinecap="round"
                          dot={false}
                          activeDot={{ r: 4 }}
                        />
                      )
                    )}
                  </LineChart>
                </ChartContainer>
              )}
            </div>

            <div
              className={cn(
                "flex min-h-[200px] min-w-0 flex-col",
                chartPanelClass
              )}
            >
              {pieTotal > 0 && visibleDetail.length > 0 && pieInsight ? (
                <p className={pieInsightClass}>
                  <span className="font-medium text-foreground">Summary: </span>
                  {pieInsight}
                </p>
              ) : null}
              <div className="flex h-[240px] w-full shrink-0 flex-col items-center justify-center md:h-[280px]">
                {visibleDetail.length === 0 ? (
                  <ChartEmptyState variant="pie">
                    No slice to show
                  </ChartEmptyState>
                ) : pieTotal === 0 ? (
                  <ChartEmptyState variant="pie">No data</ChartEmptyState>
                ) : (
                  <ChartContainer
                    config={mergedDetailConfig}
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
                        nameKey="name"
                        stroke="var(--border)"
                        strokeWidth={1}
                      />
                    </PieChart>
                  </ChartContainer>
                )}
              </div>
            </div>

            <div className="flex min-h-0 min-w-0 flex-col">
              <ChartLegendList
                title="Change-type totals"
                items={detailLegendRows}
                visibleKeys={visibleDetail}
                onToggle={(key, on) =>
                  setVisibleDetail((prev) =>
                    toggleVisibleKey(prev, key as DetailKey, on, DETAIL_KEYS)
                  )
                }
                sortDesc={detailSortDesc}
                onToggleSort={() => setDetailSortDesc((d) => !d)}
                idPrefix="coder-detail"
                ariaLabel="Filter categories on line and pie charts"
                labelClassName="text-left @[480px]/coder-performance:truncate"
              />
            </div>
          </div>
        </section>
      </CardContent>
    </Card>
  )
}
