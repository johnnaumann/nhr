import type { DateRange } from "react-day-picker"

import {
  DEMO_SCALE_REFERENCE_DAYS,
  dashboardRangeDayCount,
} from "@/lib/dashboard-demo-range"
import {
  INSTITUTION_COUNT,
  type InstitutionSeriesKey,
} from "@/lib/dashboard-institutions"

/**
 * Combined demo scale at the default sticky range (~7 days) with all sites
 * selected. Matches `max(0.12, dayCount/91) * (sites/4)` used on charts.
 */
const DEFAULT_COMBINED = Math.max(0.12, 7 / DEMO_SCALE_REFERENCE_DAYS)

/** Volume multiplier vs the default dashboard filter state (week + all sites). */
export function dashboardSummaryVolumeRatio(
  range: DateRange | undefined,
  visibleInstitutionKeys: InstitutionSeriesKey[]
): number {
  const dayCount = dashboardRangeDayCount(range)
  const scale = Math.max(0.12, dayCount / DEMO_SCALE_REFERENCE_DAYS)
  const siteFactor =
    visibleInstitutionKeys.length / Math.max(1, INSTITUTION_COUNT)
  const combined = scale * siteFactor
  return combined / DEFAULT_COMBINED
}

const BASE_DELTAS = [12.5, -8.2, -14.3, 5.1] as const
const DELTA_WEIGHT = [15, -10, -12, 8] as const

const CARD_DEF = [
  {
    label: "Missed revenue identified",
    caption: "Beats prior quarter — DRG & add-on lift",
    kind: "moneyMillions" as const,
    base: 23.6,
  },
  {
    label: "Quality enhancement cases",
    caption: "Down vs last period after coder coaching",
    kind: "integer" as const,
    base: 45,
  },
  {
    label: "Compliance flags",
    caption: "Fewer flags; legacy audit backlog cleared",
    kind: "integer" as const,
    base: 156,
  },
  {
    label: "Pending decisions",
    caption: "Queue up — network & benefits changes",
    kind: "integer" as const,
    base: 72,
  },
] as const

export type DashboardSummaryCardMetric = {
  label: string
  caption: string
  kind: "moneyMillions" | "integer"
  value: number
  changePercent: number
  trend: "up" | "down"
}

export function computeDashboardSummaryCards(
  range: DateRange | undefined,
  visibleInstitutionKeys: InstitutionSeriesKey[]
): DashboardSummaryCardMetric[] {
  const ratio = dashboardSummaryVolumeRatio(range, visibleInstitutionKeys)

  return CARD_DEF.map((def, i) => {
    const rawDelta =
      BASE_DELTAS[i]! + (ratio - 1) * DELTA_WEIGHT[i]!
    const changePercent = Math.max(
      -99.9,
      Math.min(99.9, Math.round(rawDelta * 10) / 10)
    )

    const value =
      def.kind === "moneyMillions"
        ? Math.round(def.base * ratio * 10) / 10
        : Math.max(1, Math.round(def.base * ratio))

    return {
      label: def.label,
      caption: def.caption,
      kind: def.kind,
      value,
      changePercent,
      trend: changePercent >= 0 ? "up" : "down",
    }
  })
}
