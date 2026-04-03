"use client"

import * as React from "react"
import { endOfDay, isWithinInterval, startOfDay } from "date-fns"
import { ArrowDownUpIcon, SearchIcon } from "lucide-react"
import { Bar, BarChart, Cell, CartesianGrid, XAxis, YAxis } from "recharts"

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
import { cn } from "@/lib/utils"

const DEMO_DATES_ISO = (() => {
  const out: string[] = []
  const c = new Date(2024, 3, 1)
  const e = new Date(2024, 5, 30)
  while (c <= e) {
    const y = c.getFullYear()
    const m = String(c.getMonth() + 1).padStart(2, "0")
    const d = String(c.getDate()).padStart(2, "0")
    out.push(`${y}-${m}-${d}`)
    c.setDate(c.getDate() + 1)
  }
  return out
})()

function parseIsoDate(iso: string) {
  const [y, mo, d] = iso.split("-").map(Number)
  return new Date(y, mo - 1, d)
}

const IMPACT_KEYS = ["pdx", "proc", "sdx", "cc", "mcc"] as const
type ImpactKey = (typeof IMPACT_KEYS)[number]

const impactChartConfig = {
  pdx: { label: "PDX", color: "var(--chart-1)" },
  proc: { label: "Proc", color: "var(--chart-5)" },
  sdx: { label: "SDX", color: "var(--chart-2)" },
  cc: { label: "CC", color: "var(--chart-4)" },
  mcc: { label: "MCC", color: "var(--chart-3)" },
} satisfies ChartConfig

type SiteImpactRow = { site: string; short: string } & Record<
  ImpactKey,
  number
>

/** Base stacked values per site (scaled by reporting-period length). */
const SITE_IMPACT_BASE: SiteImpactRow[] = [
  { site: "LICH", short: "LICH", pdx: 14, proc: 48, sdx: 16, cc: 35, mcc: 34 },
  { site: "LTH", short: "LTH", pdx: 40, proc: 26, sdx: 14, cc: 20, mcc: 10 },
  { site: "NYU", short: "NYU", pdx: 14, proc: 48, sdx: 16, cc: 35, mcc: 34 },
  { site: "WTH", short: "WTH", pdx: 38, proc: 24, sdx: 14, cc: 24, mcc: 12 },
]

const REACTION_KEYS = [
  "agrees",
  "cdiDisagrees",
  "mdDisagrees",
  "hospitalModDrg",
  "acknowledgeCqe",
  "medRecsDisagree",
] as const
type ReactionKey = (typeof REACTION_KEYS)[number]

const reactionChartConfig = {
  agrees: { label: "Agrees with change", color: "var(--chart-1)" },
  cdiDisagrees: { label: "CDI disagrees", color: "var(--chart-5)" },
  mdDisagrees: { label: "MD disagrees", color: "var(--chart-3)" },
  hospitalModDrg: { label: "Hospital Mod DRG", color: "var(--chart-2)" },
  acknowledgeCqe: { label: "Acknowledge CQE", color: "var(--muted)" },
  medRecsDisagree: { label: "Med Recs Disagree", color: "var(--border)" },
} satisfies ChartConfig

const REACTION_BASE: Record<ReactionKey, number> = {
  agrees: 285,
  cdiDisagrees: 9,
  mdDisagrees: 4,
  hospitalModDrg: 5,
  acknowledgeCqe: 742,
  medRecsDisagree: 10,
}

const DEFAULT_VISIBLE_REACTIONS = [...REACTION_KEYS] as ReactionKey[]

function scaleInt(n: number, factor: number) {
  return Math.max(1, Math.round(n * factor))
}

export function ChartRequiredChanges() {
  const { range } = useDashboardDateRange()

  const filteredDayCount = React.useMemo(() => {
    if (!range?.from) {
      return DEMO_DATES_ISO.length
    }
    const from = startOfDay(range.from)
    const to = endOfDay(range.to ?? range.from)
    const interval = { start: from, end: to }
    return DEMO_DATES_ISO.filter((iso) =>
      isWithinInterval(parseIsoDate(iso), interval)
    ).length
  }, [range])

  const scale = React.useMemo(
    () =>
      Math.max(
        0.12,
        filteredDayCount / Math.max(1, DEMO_DATES_ISO.length)
      ),
    [filteredDayCount]
  )

  const [impactSortDesc, setImpactSortDesc] = React.useState(true)
  const [reactionSortDesc, setReactionSortDesc] = React.useState(true)
  const [visibleReactions, setVisibleReactions] = React.useState<ReactionKey[]>(
    DEFAULT_VISIBLE_REACTIONS
  )

  const [impactScope, setImpactScope] = React.useState("top5")
  const [worksheetScopeTop, setWorksheetScopeTop] = React.useState("drg-cqe")
  const [reactionView, setReactionView] = React.useState("hospital")
  const [worksheetScopeBottom, setWorksheetScopeBottom] =
    React.useState("drg-cqe")

  const impactTotals = React.useMemo(() => {
    const sums = {} as Record<ImpactKey, number>
    IMPACT_KEYS.forEach((k) => {
      sums[k] = 0
    })
    for (const row of SITE_IMPACT_BASE) {
      IMPACT_KEYS.forEach((k) => {
        sums[k] += row[k]
      })
    }
    return sums
  }, [])

  const impactLegendRows = React.useMemo(() => {
    const rows = IMPACT_KEYS.map((key) => ({
      key,
      label: String(impactChartConfig[key].label),
      count: scaleInt(impactTotals[key], scale),
    }))
    rows.sort((a, b) => (impactSortDesc ? b.count - a.count : a.count - b.count))
    return rows
  }, [impactSortDesc, impactTotals, scale])

  const siteBarData = React.useMemo(
    () =>
      SITE_IMPACT_BASE.map((row) => {
        const next: Record<string, string | number> = {
          site: row.short,
        }
        IMPACT_KEYS.forEach((k) => {
          next[k] = scaleInt(row[k], scale)
        })
        return next
      }),
    [scale]
  )

  const reactionCounts = React.useMemo(() => {
    const next = {} as Record<ReactionKey, number>
    REACTION_KEYS.forEach((k) => {
      next[k] = scaleInt(REACTION_BASE[k], scale)
    })
    return next
  }, [scale])

  const reactionLegendRows = React.useMemo(() => {
    const rows = REACTION_KEYS.map((key) => ({
      key,
      label: String(reactionChartConfig[key].label),
      count: reactionCounts[key],
    }))
    rows.sort((a, b) =>
      reactionSortDesc ? b.count - a.count : a.count - b.count
    )
    return rows
  }, [reactionCounts, reactionSortDesc])

  const reactionBarData = React.useMemo(() => {
    return visibleReactions
      .map((key) => ({
        name: String(reactionChartConfig[key].label),
        key,
        value: reactionCounts[key],
        fill: `var(--color-${key})`,
      }))
      .sort((a, b) => b.value - a.value)
  }, [reactionCounts, visibleReactions])

  const filterToolbarClass =
    "flex flex-wrap items-baseline gap-x-1 gap-y-2 text-sm text-muted-foreground"

  const panelShell =
    "rounded-xl border border-border/60 bg-muted/40 p-3 sm:p-4 dark:bg-muted/20"

  return (
    <Card className="@container/required-changes">
      <CardHeader className="pt-2">
        <CardTitle>What most impacted the change</CardTitle>
        <CardDescription>
          <span className="hidden @[540px]/required-changes:block">
            Required-change drivers by site, then how hospitals reacted—scoped
            to the reporting period selected above
          </span>
          <span className="@[540px]/required-changes:hidden">
            Impact and reactions
          </span>
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-8 px-4 pt-2 pb-2 sm:pt-4 lg:px-6">
        {/* Panel 1: Top required changes × sites */}
        <section className="flex flex-col gap-4">
          <div className={filterToolbarClass}>
            <span>Displaying</span>
            <Select value={impactScope} onValueChange={setImpactScope}>
              <SelectTrigger
                size="sm"
                className="h-8 w-fit min-w-[10rem] border-0 border-b border-dashed border-muted-foreground/50 bg-transparent px-1 py-0 font-medium text-foreground shadow-none hover:bg-muted/40 focus:ring-0 focus-visible:ring-0 dark:hover:bg-muted/20"
              >
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="top5">Top 5 required changes</SelectItem>
                  <SelectItem value="all">All required changes</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
            <span>to</span>
            <Select value={worksheetScopeTop} onValueChange={setWorksheetScopeTop}>
              <SelectTrigger
                size="sm"
                className="h-8 w-fit min-w-[11rem] border-0 border-b border-dashed border-muted-foreground/50 bg-transparent px-1 py-0 font-medium text-foreground shadow-none hover:bg-muted/40 focus:ring-0 focus-visible:ring-0 dark:hover:bg-muted/20"
              >
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="drg-cqe">DRG + CQE worksheets</SelectItem>
                  <SelectItem value="all-sheets">All worksheets</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          <div
            className={cn(
              "grid grid-cols-1 gap-4 @xl/required-changes:grid-cols-12 @xl/required-changes:items-stretch"
            )}
          >
            <div className="flex min-h-0 flex-col @xl/required-changes:col-span-4">
              <div
                className={cn(
                  "flex h-full min-h-0 flex-1 flex-col gap-3",
                  panelShell
                )}
              >
                <div className="flex items-start justify-end gap-2">
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon-xs"
                    className="shrink-0 text-muted-foreground"
                    aria-label={
                      impactSortDesc
                        ? "Sort impact categories ascending"
                        : "Sort impact categories descending"
                    }
                    onClick={() => setImpactSortDesc((d) => !d)}
                  >
                    <ArrowDownUpIcon className="size-3.5" />
                  </Button>
                </div>
                <ul className="flex flex-col gap-3">
                  {impactLegendRows.map(({ key, label, count }) => (
                    <li
                      key={key}
                      className="flex min-w-0 items-center gap-2.5 text-sm"
                    >
                      <span
                        className="size-3.5 shrink-0 rounded-sm border border-border"
                        style={{
                          backgroundColor: impactChartConfig[key].color,
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
                        <SearchIcon className="size-3 opacity-60" aria-hidden />
                      </Badge>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div
              className={cn(
                "flex min-h-0 min-w-0 flex-col @xl/required-changes:col-span-8",
                panelShell
              )}
            >
              {filteredDayCount === 0 ? (
                <div className="flex min-h-[220px] flex-1 items-center justify-center px-2 text-center text-sm text-muted-foreground">
                  No demo days in this reporting period. Adjust the range above.
                </div>
              ) : (
                <ChartContainer
                  config={impactChartConfig}
                  className="!aspect-auto min-h-[220px] w-full min-w-0 flex-1 md:min-h-[260px]"
                >
                  <BarChart
                    accessibilityLayer
                    data={siteBarData}
                    margin={{ left: 4, right: 8, top: 8, bottom: 4 }}
                    barCategoryGap="20%"
                  >
                    <CartesianGrid vertical={false} strokeDasharray="3 3" />
                    <XAxis
                      dataKey="site"
                      tickLine={false}
                      axisLine={false}
                      tickMargin={8}
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
                        <ChartTooltipContent indicator="dot" labelKey="site" />
                      }
                    />
                    {IMPACT_KEYS.map((key) => (
                      <Bar
                        key={key}
                        dataKey={key}
                        stackId="impact"
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

        {/* Panel 2: Hospital reactions (horizontal bars) */}
        <section className="flex flex-col gap-4">
          <div className={filterToolbarClass}>
            <span>Displaying</span>
            <Select value={reactionView} onValueChange={setReactionView}>
              <SelectTrigger
                size="sm"
                className="h-8 w-fit min-w-[10rem] border-0 border-b border-dashed border-muted-foreground/50 bg-transparent px-1 py-0 font-medium text-foreground shadow-none hover:bg-muted/40 focus:ring-0 focus-visible:ring-0 dark:hover:bg-muted/20"
              >
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="hospital">Hospital reactions</SelectItem>
                  <SelectItem value="payer">Payer reactions</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
            <span>to</span>
            <Select
              value={worksheetScopeBottom}
              onValueChange={setWorksheetScopeBottom}
            >
              <SelectTrigger
                size="sm"
                className="h-8 w-fit min-w-[11rem] border-0 border-b border-dashed border-muted-foreground/50 bg-transparent px-1 py-0 font-medium text-foreground shadow-none hover:bg-muted/40 focus:ring-0 focus-visible:ring-0 dark:hover:bg-muted/20"
              >
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="drg-cqe">DRG + CQE worksheets</SelectItem>
                  <SelectItem value="all-sheets">All worksheets</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          <div
            className={cn(
              "grid grid-cols-1 gap-4 @xl/required-changes:grid-cols-12 @xl/required-changes:items-stretch"
            )}
          >
            <div className="flex min-h-0 flex-col @xl/required-changes:col-span-4">
              <div
                className={cn(
                  "flex h-full min-h-0 flex-1 flex-col gap-3",
                  panelShell
                )}
              >
                <div className="flex items-start justify-end gap-2">
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon-xs"
                    className="shrink-0 text-muted-foreground"
                    aria-label={
                      reactionSortDesc
                        ? "Sort reactions ascending"
                        : "Sort reactions descending"
                    }
                    onClick={() => setReactionSortDesc((d) => !d)}
                  >
                    <ArrowDownUpIcon className="size-3.5" />
                  </Button>
                </div>
                <ul
                  className="flex flex-col gap-3"
                  aria-label="Filter reactions on chart"
                >
                  {reactionLegendRows.map(({ key, label, count }) => {
                    const filterId = `reaction-filter-${key}`
                    const isOn = visibleReactions.includes(key)
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
                          indicatorColor={reactionChartConfig[key].color}
                          onCheckedChange={(on) => {
                            setVisibleReactions((prev) => {
                              if (on) {
                                if (prev.includes(key)) return prev
                                const next = new Set(prev)
                                next.add(key)
                                return REACTION_KEYS.filter((k) => next.has(k))
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
                "flex min-h-0 min-w-0 flex-col @xl/required-changes:col-span-8",
                panelShell
              )}
            >
              {filteredDayCount === 0 ? (
                <div className="flex min-h-[220px] flex-1 items-center justify-center px-2 text-center text-sm text-muted-foreground">
                  No demo days in this reporting period.
                </div>
              ) : visibleReactions.length === 0 ? (
                <div className="flex min-h-[220px] flex-1 items-center justify-center px-2 text-center text-sm text-muted-foreground">
                  Select at least one reaction to see the chart.
                </div>
              ) : (
                <ChartContainer
                  config={reactionChartConfig}
                  className="!aspect-auto min-h-[240px] w-full min-w-0 flex-1 md:min-h-[280px]"
                >
                  <BarChart
                    accessibilityLayer
                    data={reactionBarData}
                    layout="vertical"
                    margin={{ left: 8, right: 24, top: 8, bottom: 8 }}
                  >
                    <CartesianGrid horizontal={false} strokeDasharray="3 3" />
                    <XAxis type="number" hide />
                    <YAxis
                      type="category"
                      dataKey="name"
                      tickLine={false}
                      axisLine={false}
                      width={132}
                      tickMargin={4}
                      className="text-xs"
                    />
                    <ChartTooltip
                      cursor={{ fill: "var(--muted)", opacity: 0.3 }}
                      content={
                        <ChartTooltipContent
                          indicator="line"
                          formatter={(value) => (
                            <span className="font-mono tabular-nums">
                              {Number(value).toLocaleString()}
                            </span>
                          )}
                        />
                      }
                    />
                    <Bar dataKey="value" radius={[0, 4, 4, 0]} maxBarSize={28}>
                      {reactionBarData.map((entry) => (
                        <Cell key={entry.key} fill={entry.fill} />
                      ))}
                    </Bar>
                  </BarChart>
                </ChartContainer>
              )}
            </div>
          </div>
        </section>
      </CardContent>
    </Card>
  )
}
