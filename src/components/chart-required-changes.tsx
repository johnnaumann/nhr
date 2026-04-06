"use client"

import * as React from "react"
import { Bar, BarChart, Cell, CartesianGrid, XAxis, YAxis } from "recharts"

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
import { useDashboardInstitutions } from "@/contexts/dashboard-institutions-context"
import { scaleInt, toggleVisibleKey } from "@/lib/chart-helpers"
import {
  chartContentClass,
  chartPanelClass,
  chartPlotHeightClass,
  dashboardGridGapClass,
  filterSelectTriggerClass,
  filterToolbarClass,
} from "@/lib/chart-layout"
import {
  DEMO_SCALE_REFERENCE_DAYS,
  dashboardRangeDayCount,
  demoHeaderBlendMultiplier,
} from "@/lib/dashboard-demo-range"
import { dashboardCardBlockGapClass } from "@/lib/dashboard-layout"
import {
  INSTITUTION_COUNT,
  SITE_SHORT_TO_INSTITUTION_KEY,
} from "@/lib/dashboard-institutions"
import { cn } from "@/lib/utils"

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
  { site: "Site 1", short: "Site 1", pdx: 14, proc: 48, sdx: 16, cc: 35, mcc: 34 },
  { site: "Site 2", short: "Site 2", pdx: 40, proc: 26, sdx: 14, cc: 20, mcc: 10 },
  { site: "Site 3", short: "Site 3", pdx: 14, proc: 48, sdx: 16, cc: 35, mcc: 34 },
  { site: "Site 4", short: "Site 4", pdx: 38, proc: 24, sdx: 14, cc: 24, mcc: 12 },
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
  acknowledgeCqe: { label: "Acknowledge CQE", color: "var(--chart-6)" },
  medRecsDisagree: { label: "Med Recs Disagree", color: "var(--chart-7)" },
} satisfies ChartConfig

const REACTION_BASE_HOSPITAL: Record<ReactionKey, number> = {
  agrees: 274,
  cdiDisagrees: 96,
  mdDisagrees: 58,
  hospitalModDrg: 72,
  acknowledgeCqe: 348,
  medRecsDisagree: 128,
}

const REACTION_BASE_PAYER: Record<ReactionKey, number> = {
  agrees: 185,
  cdiDisagrees: 142,
  mdDisagrees: 112,
  hospitalModDrg: 38,
  acknowledgeCqe: 210,
  medRecsDisagree: 94,
}

const DEFAULT_VISIBLE_IMPACTS = [...IMPACT_KEYS] as ImpactKey[]
const DEFAULT_VISIBLE_REACTIONS = [...REACTION_KEYS] as ReactionKey[]


export function ChartRequiredChanges() {
  const { range } = useDashboardDateRange()
  const { visibleInstitutionKeys } = useDashboardInstitutions()

  const siteRowsForCharts = React.useMemo(() => {
    const rows = SITE_IMPACT_BASE.filter((row) => {
      const id = SITE_SHORT_TO_INSTITUTION_KEY[row.short]
      return id != null && visibleInstitutionKeys.includes(id)
    })
    return rows.length > 0 ? rows : SITE_IMPACT_BASE
  }, [visibleInstitutionKeys])

  const siteSelectionFactor =
    visibleInstitutionKeys.length / Math.max(1, INSTITUTION_COUNT)

  const headerBlend = React.useMemo(
    () =>
      demoHeaderBlendMultiplier(
        visibleInstitutionKeys,
        range,
        "required-changes"
      ),
    [visibleInstitutionKeys, range]
  )

  const filteredDayCount = React.useMemo(
    () => dashboardRangeDayCount(range),
    [range]
  )

  const scale = React.useMemo(
    () =>
      Math.max(
        0.12,
        filteredDayCount / Math.max(1, DEMO_SCALE_REFERENCE_DAYS)
      ),
    [filteredDayCount]
  )

  const [impactSortDesc, setImpactSortDesc] = React.useState(true)
  const [reactionSortDesc, setReactionSortDesc] = React.useState(true)
  const [visibleImpacts, setVisibleImpacts] = React.useState<ImpactKey[]>(
    DEFAULT_VISIBLE_IMPACTS
  )
  const [visibleReactions, setVisibleReactions] = React.useState<ReactionKey[]>(
    DEFAULT_VISIBLE_REACTIONS
  )

  const [impactScope, setImpactScope] = React.useState("top5")
  const [worksheetScopeTop, setWorksheetScopeTop] = React.useState("drg-cqe")
  const [reactionView, setReactionView] = React.useState("hospital")
  const [worksheetScopeBottom, setWorksheetScopeBottom] =
    React.useState("drg-cqe")

  const worksheetBoostTop = worksheetScopeTop === "all-sheets" ? 1.35 : 1

  const activeImpactKeys = React.useMemo(() => {
    if (impactScope === "all") return [...IMPACT_KEYS]
    const ranked = [...IMPACT_KEYS].sort((a, b) => {
      const sumA = siteRowsForCharts.reduce((s, r) => s + r[a], 0)
      const sumB = siteRowsForCharts.reduce((s, r) => s + r[b], 0)
      return sumB - sumA
    })
    return ranked.slice(0, 3)
  }, [impactScope, siteRowsForCharts])

  const impactTotals = React.useMemo(() => {
    const sums = {} as Record<ImpactKey, number>
    IMPACT_KEYS.forEach((k) => {
      sums[k] = 0
    })
    for (const row of siteRowsForCharts) {
      IMPACT_KEYS.forEach((k) => {
        sums[k] += row[k]
      })
    }
    return sums
  }, [siteRowsForCharts])

  const impactLegendRows = React.useMemo(() => {
    const rows = activeImpactKeys.map((key) => ({
      key,
      label: String(impactChartConfig[key].label),
      count: scaleInt(
        impactTotals[key],
        scale * worksheetBoostTop * headerBlend
      ),
      color: impactChartConfig[key].color!,
    }))
    rows.sort((a, b) => (impactSortDesc ? b.count - a.count : a.count - b.count))
    return rows
  }, [
    impactSortDesc,
    impactTotals,
    scale,
    activeImpactKeys,
    worksheetBoostTop,
    headerBlend,
  ])

  const siteBarData = React.useMemo(
    () =>
      siteRowsForCharts.map((row) => {
        const next: Record<string, string | number> = {
          site: row.short,
        }
        activeImpactKeys.forEach((k) => {
          next[k] = scaleInt(
            row[k],
            scale * worksheetBoostTop * headerBlend
          )
        })
        return next
      }),
    [scale, activeImpactKeys, worksheetBoostTop, siteRowsForCharts, headerBlend]
  )

  const worksheetBoostBottom = worksheetScopeBottom === "all-sheets" ? 1.35 : 1
  const reactionBase =
    reactionView === "payer" ? REACTION_BASE_PAYER : REACTION_BASE_HOSPITAL

  const reactionCounts = React.useMemo(() => {
    const next = {} as Record<ReactionKey, number>
    REACTION_KEYS.forEach((k) => {
      next[k] = scaleInt(
        reactionBase[k],
        scale *
          worksheetBoostBottom *
          siteSelectionFactor *
          headerBlend
      )
    })
    return next
  }, [
    scale,
    reactionBase,
    worksheetBoostBottom,
    siteSelectionFactor,
    headerBlend,
  ])

  const reactionLegendRows = React.useMemo(() => {
    const rows = REACTION_KEYS.map((key) => ({
      key,
      label: String(reactionChartConfig[key].label),
      count: reactionCounts[key],
      color: reactionChartConfig[key].color!,
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

  return (
    <Card
      className={cn("@container/required-changes", dashboardCardBlockGapClass)}
    >
      <CardHeader>
        <CardTitle className="text-lg font-semibold tracking-tight sm:text-xl">
          What most impacted the change
        </CardTitle>
        <CardDescription>
          Required-change impact stacked by hospital and reaction-type volumes
          by hospital for the reporting period.
        </CardDescription>
      </CardHeader>
      <CardContent className={chartContentClass}>
        {/* Panel 1: Top required changes × sites */}
        <section className={cn("flex flex-col", dashboardGridGapClass)}>
          <div className={filterToolbarClass}>
            <span>Displaying</span>
            <Select value={impactScope} onValueChange={setImpactScope}>
              <SelectTrigger
                size="sm"
                className={cn(filterSelectTriggerClass, "min-w-[10rem]")}
              >
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="top5">Top 3 required changes</SelectItem>
                  <SelectItem value="all">All required changes</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
            <span>to</span>
            <Select value={worksheetScopeTop} onValueChange={setWorksheetScopeTop}>
              <SelectTrigger
                size="sm"
                className={cn(filterSelectTriggerClass, "min-w-[11rem]")}
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
              "grid grid-cols-1 @xl/required-changes:grid-cols-12 @xl/required-changes:items-stretch",
              dashboardGridGapClass,
            )}
          >
            <div className="flex h-full min-h-0 w-full min-w-0 flex-col @xl/required-changes:col-span-3">
              <ChartLegendList
                title="Amount by impact category"
                items={impactLegendRows}
                visibleKeys={visibleImpacts}
                onToggle={(key, on) =>
                  setVisibleImpacts((prev) =>
                    toggleVisibleKey(prev, key as ImpactKey, on, IMPACT_KEYS)
                  )
                }
                sortDesc={impactSortDesc}
                onToggleSort={() => setImpactSortDesc((d) => !d)}
                idPrefix="impact-chart-filter"
                ariaLabel="Filter impact categories on chart"
              />
            </div>

            <div
              className={cn(
                "flex h-full min-h-0 min-w-0 flex-col @xl/required-changes:col-span-9",
                chartPanelClass,
              )}
            >
              {visibleImpacts.length === 0 ? (
                <ChartEmptyState>
                  Select at least one impact category to see the stacked bar
                  chart.
                </ChartEmptyState>
              ) : (
                <ChartContainer
                  config={impactChartConfig}
                  className={chartPlotHeightClass}
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
                        <ChartTooltipContent indicator="dot" labelKey="site" showTotal />
                      }
                    />
                    {activeImpactKeys.filter((key) =>
                      visibleImpacts.includes(key)
                    ).map((key) => (
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
        <section className={cn("flex flex-col", dashboardGridGapClass)}>
          <div className={filterToolbarClass}>
            <span>Displaying</span>
            <Select value={reactionView} onValueChange={setReactionView}>
              <SelectTrigger
                size="sm"
                className={cn(filterSelectTriggerClass, "min-w-[10rem]")}
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
                className={cn(filterSelectTriggerClass, "min-w-[11rem]")}
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
              "grid grid-cols-1 @xl/required-changes:grid-cols-12 @xl/required-changes:items-stretch",
              dashboardGridGapClass,
            )}
          >
            <div className="flex h-full min-h-0 w-full min-w-0 flex-col @xl/required-changes:col-span-3">
              <ChartLegendList
                title="Amount by reaction type"
                items={reactionLegendRows}
                visibleKeys={visibleReactions}
                onToggle={(key, on) =>
                  setVisibleReactions((prev) =>
                    toggleVisibleKey(prev, key as ReactionKey, on, REACTION_KEYS)
                  )
                }
                sortDesc={reactionSortDesc}
                onToggleSort={() => setReactionSortDesc((d) => !d)}
                idPrefix="reaction-filter"
                ariaLabel="Filter reaction types on chart"
              />
            </div>

            <div
              className={cn(
                "flex h-full min-h-0 min-w-0 flex-col @xl/required-changes:col-span-9",
                chartPanelClass,
              )}
            >
              {visibleReactions.length === 0 ? (
                <ChartEmptyState>
                  Select at least one reaction type to see the chart.
                </ChartEmptyState>
              ) : (
                <ChartContainer
                  config={reactionChartConfig}
                  className={chartPlotHeightClass}
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
                      width={160}
                      tickMargin={4}
                      className="text-xs"
                    />
                    <ChartTooltip
                      cursor={{ fill: "var(--muted)", opacity: 0.3 }}
                      content={
                        <ChartTooltipContent
                          indicator="line"
                          nameKey="key"
                          formatter={(value) => {
                            const total = reactionBarData.reduce(
                              (s, r) => s + r.value,
                              0
                            )
                            return (
                              <ChartTooltipValue
                                value={Number(value)}
                                total={total}
                                unit="reactions"
                              />
                            )
                          }}
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
