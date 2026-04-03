"use client"

import * as React from "react"
import { format } from "date-fns"
import { ArrowDownUpIcon, SearchIcon } from "lucide-react"
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
  DEMO_SCALE_REFERENCE_DAYS,
  eachIsoDateInDashboardRange,
} from "@/lib/dashboard-demo-range"
import { cn } from "@/lib/utils"

function parseIsoDate(iso: string) {
  const [y, mo, d] = iso.split("-").map(Number)
  return new Date(y, mo - 1, d)
}

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
  row: 0 | 1
} & Record<WorkKey, number>

/** Ten coders; `row` drives staggered axis labels (Figma layout). */
const CODER_META: { name: string; row: 0 | 1 }[] = [
  { name: "Sarah Chen", row: 0 },
  { name: "David Ruiz", row: 0 },
  { name: "Priya Patel", row: 0 },
  { name: "James Wilson", row: 0 },
  { name: "Emily Foster", row: 0 },
  { name: "Michael Tran", row: 1 },
  { name: "Rachel Kim", row: 1 },
  { name: "Carlos Diaz", row: 1 },
  { name: "Aisha Brown", row: 1 },
  { name: "Tom Nguyen", row: 1 },
]

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

function scaleInt(n: number, factor: number) {
  return Math.max(1, Math.round(n * factor))
}

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

type PieBreakdownRow = {
  key: DetailKey
  label: string
  value: number
  pct: number
}

function buildDetailPieInsight(sorted: PieBreakdownRow[], total: number): string {
  if (sorted.length === 0 || total === 0) return ""
  const top = sorted[0]!
  const bottom = sorted[sorted.length - 1]!
  if (top.pct >= 42) {
    return `${top.label} represents ${top.pct.toFixed(1)}% of coder-attributed changes in this slice—compare the line trend to see whether that holds across the period.`
  }
  return `${top.label} leads at ${top.pct.toFixed(1)}% of ${total.toLocaleString()} total; ${bottom.label} is smallest at ${bottom.pct.toFixed(1)}%.`
}

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

  const coderBarData = React.useMemo((): CoderBarRow[] => {
    const rows = CODER_META.map((m, i) => {
      const base = CODER_BAR_BASE[i]!
      return {
        coder: m.name,
        row: m.row,
        changed: scaleInt(base.changed, scale),
        noChanges: scaleInt(base.noChanges, scale),
      }
    })
    const ranked = [...rows].sort(
      (a, b) => b.changed + b.noChanges - (a.changed + a.noChanges)
    )
    if (volumeScope === "top5") {
      const top = new Set(ranked.slice(0, 5).map((r) => r.coder))
      return rows.filter((r) => top.has(r.coder))
    }
    if (volumeScope === "all") {
      return rows
    }
    return rows
  }, [scale, volumeScope])

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
    }))
  }, [workTotals])

  const detailLineData = React.useMemo(() => {
    const scopeFactor =
      detailScope === "single" ? 0.88 : detailScope === "top5" ? 0.94 : 1
    return buildDetailLineSeries(rangeIsoDays, scale * scopeFactor)
  }, [detailScope, rangeIsoDays, scale])

  const detailCounts = React.useMemo(() => {
    const next = {} as Record<DetailKey, number>
    DETAIL_KEYS.forEach((k) => {
      next[k] = scaleInt(DETAIL_BASE[k], scale)
    })
    return next
  }, [scale])

  const detailLegendRows = React.useMemo(() => {
    const rows = DETAIL_KEYS.map((key) => ({
      key,
      label: String(detailChartConfig[key].label),
      count: detailCounts[key],
    }))
    rows.sort((a, b) =>
      detailSortDesc ? b.count - a.count : a.count - b.count
    )
    return rows
  }, [detailCounts, detailSortDesc])

  const { pieData, pieTotal, pieInsight } = React.useMemo(() => {
    const active = DETAIL_KEYS.filter((k) => visibleDetail.includes(k))
    const total = active.reduce((acc, k) => acc + detailCounts[k], 0)
    const breakdown: PieBreakdownRow[] = active.map((key) => {
      const value = detailCounts[key]
      const pct = total > 0 ? (value / total) * 100 : 0
      return {
        key,
        label: String(detailChartConfig[key].label),
        value,
        pct,
      }
    })
    const pieData = breakdown.map(({ key, label, value, pct }) => ({
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
      pieInsight: buildDetailPieInsight(sorted, total),
    }
  }, [detailCounts, visibleDetail])

  const filterToolbarClass =
    "flex flex-wrap items-baseline gap-x-1 gap-y-2 text-sm text-muted-foreground"

  const legendPanelClass =
    "flex h-full min-h-0 flex-1 flex-col gap-3 rounded-xl border border-border/60 bg-muted/40 p-3 sm:p-4 dark:bg-muted/20"

  const chartPanelClass =
    "flex min-h-0 min-w-0 flex-col rounded-xl border border-border/60 bg-muted/40 p-3 sm:p-4 dark:bg-muted/20"

  const mergedDetailConfig = React.useMemo(
    () => ({ ...workStackConfig, ...detailChartConfig }),
    []
  )

  return (
    <Card className="@container/coder-performance">
      <CardHeader className="pt-2">
        <CardTitle>Coder Performance</CardTitle>
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
      <CardContent className="flex flex-col gap-8 px-4 pt-2 pb-2 sm:pt-4 lg:px-6">
        {/* Top: stacked bars by coder */}
        <section className="flex flex-col gap-4">
          <div className={cn(filterToolbarClass, "items-center")}>
            <span>Displaying</span>
            <Select value={volumeScope} onValueChange={setVolumeScope}>
              <SelectTrigger
                size="sm"
                className="h-8 w-fit min-w-[12rem] border-0 border-b border-dashed border-muted-foreground/50 bg-transparent px-1 py-0 font-medium text-foreground shadow-none hover:bg-muted/40 focus:ring-0 focus-visible:ring-0 dark:hover:bg-muted/20"
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
                className="h-8 w-fit min-w-[9rem] border-0 border-b border-dashed border-muted-foreground/50 bg-transparent px-1 py-0 font-medium text-foreground shadow-none hover:bg-muted/40 focus:ring-0 focus-visible:ring-0 dark:hover:bg-muted/20"
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

          <div className="grid min-h-[min(26rem,52vh)] grid-cols-1 gap-4 @xl/coder-performance:grid-cols-12 @xl/coder-performance:items-stretch">
            <div className="flex min-h-0 min-w-0 flex-col @xl/coder-performance:col-span-3">
              <div className={legendPanelClass}>
                <div className="flex items-start justify-between gap-2">
                  <p className="text-sm text-muted-foreground">
                    Worksheet outcomes
                  </p>
                </div>
                <ul
                  className="flex flex-col gap-3"
                  aria-label="Filter stacks on coder chart"
                >
                  {workLegendRows.map(({ key, label, count }) => {
                    const filterId = `coder-work-${key}`
                    const isOn = visibleWork.includes(key)
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
                          indicatorColor={workStackConfig[key].color}
                          onCheckedChange={(on) => {
                            setVisibleWork((prev) => {
                              if (on) {
                                if (prev.includes(key)) return prev
                                const next = new Set(prev)
                                next.add(key)
                                return WORK_KEYS.filter((k) => next.has(k))
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
                          <SearchIcon className="size-3 opacity-60" aria-hidden />
                        </Badge>
                      </li>
                    )
                  })}
                </ul>
              </div>
            </div>

            <div
              className={cn(
                "flex min-h-0 min-w-0 flex-1 flex-col @xl/coder-performance:col-span-9",
                chartPanelClass
              )}
            >
              {visibleWork.length === 0 ? (
                <div className="flex min-h-[240px] flex-1 items-center justify-center px-2 text-center text-sm text-muted-foreground md:min-h-[320px]">
                  Select at least one outcome to see the stacked bars.
                </div>
              ) : coderBarData.length === 0 ? (
                <div className="flex min-h-[240px] flex-1 items-center justify-center px-2 text-center text-sm text-muted-foreground md:min-h-[320px]">
                  No coders match this filter.
                </div>
              ) : (
                <ChartContainer
                  config={workStackConfig}
                  className="!aspect-auto flex h-full min-h-[280px] w-full min-w-0 flex-1 md:min-h-[360px] [&_.recharts-responsive-container]:h-full [&_.recharts-responsive-container]:min-h-[inherit] [&_.recharts-wrapper]:overflow-visible [&_.recharts-surface]:overflow-visible"
                >
                  <BarChart
                    accessibilityLayer
                    data={coderBarData}
                    margin={{ left: 4, right: 8, top: 12, bottom: 8 }}
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
                        <ChartTooltipContent indicator="dot" labelKey="coder" />
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
                        isAnimationActive={false}
                      />
                    ))}
                  </BarChart>
                </ChartContainer>
              )}
            </div>
          </div>
        </section>

        {/* Bottom: line + pie / legend */}
        <section className="flex flex-col gap-4">
          <div className={filterToolbarClass}>
            <span>View coder details of</span>
            <Select value={detailScope} onValueChange={setDetailScope}>
              <SelectTrigger
                size="sm"
                className="h-8 w-fit min-w-[10rem] border-0 border-b border-dashed border-muted-foreground/50 bg-transparent px-1 py-0 font-medium text-foreground shadow-none hover:bg-muted/40 focus:ring-0 focus-visible:ring-0 dark:hover:bg-muted/20"
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

          <div className="grid grid-cols-1 gap-4 @xl/coder-performance:grid-cols-4 @xl/coder-performance:items-stretch">
            <div
              className={cn(
                "flex min-h-0 min-w-0 flex-col @xl/coder-performance:col-span-2",
                chartPanelClass
              )}
            >
              {visibleDetail.length === 0 ? (
                <div className="flex min-h-[240px] flex-1 items-center justify-center px-2 text-center text-sm text-muted-foreground md:min-h-[280px]">
                  Select at least one category in the legend to see trends.
                </div>
              ) : detailLineData.length === 0 ? (
                <div className="flex min-h-[240px] flex-1 items-center justify-center px-2 text-center text-sm text-muted-foreground md:min-h-[280px]">
                  Not enough days in range for a trend.
                </div>
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
                "flex min-h-[200px] min-w-0 flex-col items-center justify-center",
                chartPanelClass
              )}
            >
              {visibleDetail.length === 0 ? (
                <div className="flex flex-1 items-center px-2 text-center text-sm text-muted-foreground">
                  No slice to show
                </div>
              ) : pieTotal === 0 ? (
                <div className="text-sm text-muted-foreground">No data</div>
              ) : (
                <ChartContainer
                  config={mergedDetailConfig}
                  className="mx-auto aspect-square h-full max-h-[200px] w-full max-w-[200px]"
                >
                  <PieChart>
                    <ChartTooltip
                      cursor={false}
                      content={<ChartTooltipContent hideLabel />}
                    />
                    <Pie
                      data={pieData}
                      dataKey="value"
                      nameKey="name"
                      innerRadius={44}
                      outerRadius={72}
                      stroke="var(--background)"
                      strokeWidth={2}
                    />
                  </PieChart>
                </ChartContainer>
              )}
              {pieTotal > 0 && visibleDetail.length > 0 && pieInsight ? (
                <p className="max-h-24 w-full shrink-0 overflow-y-auto pt-2 text-left text-xs leading-relaxed text-muted-foreground">
                  <span className="font-medium text-foreground">Summary: </span>
                  {pieInsight}
                </p>
              ) : null}
            </div>

            <div className="flex min-h-0 min-w-0 flex-col">
              <div className={legendPanelClass}>
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-sm text-muted-foreground">
                      Change-type totals
                    </p>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon-xs"
                      className="shrink-0 text-muted-foreground"
                      aria-label={
                        detailSortDesc
                          ? "Sort ascending by count"
                          : "Sort descending by count"
                      }
                      onClick={() => setDetailSortDesc((d) => !d)}
                    >
                      <ArrowDownUpIcon className="size-3.5" />
                    </Button>
                  </div>
                  <ul
                    className="flex flex-col gap-3"
                    aria-label="Filter categories on line and pie charts"
                  >
                    {detailLegendRows.map(({ key, label, count }) => {
                      const filterId = `coder-detail-${key}`
                      const isOn = visibleDetail.includes(key)
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
                            indicatorColor={detailChartConfig[key].color}
                            onCheckedChange={(on) => {
                              setVisibleDetail((prev) => {
                                if (on) {
                                  if (prev.includes(key)) return prev
                                  const next = new Set(prev)
                                  next.add(key)
                                  return DETAIL_KEYS.filter((k) => next.has(k))
                                }
                                return prev.filter((k) => k !== key)
                              })
                            }}
                          />
                          <label
                            htmlFor={filterId}
                            className="min-w-0 flex-1 cursor-pointer text-left font-medium text-foreground @[480px]/coder-performance:truncate"
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
          </div>
        </section>
      </CardContent>
    </Card>
  )
}
