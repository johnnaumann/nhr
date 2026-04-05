import type { DateRange } from "react-day-picker"

import { dashboardSummaryVolumeRatio } from "@/lib/dashboard-summary-metrics"
import type { DashboardSummaryCardMetric } from "@/lib/dashboard-summary-metrics"
import type { InstitutionSeriesKey } from "@/lib/dashboard-institutions"

/** Smaller bases than org-wide dashboard — demo “single coder” lens. */
const INDIVIDUAL_CARD_DEF = [
  {
    label: "Missed revenue identified",
    caption: "Coder-specific DRG & add-on lift this period",
    kind: "moneyMillions" as const,
    base: 0.85,
  },
  {
    label: "Quality enhancement cases",
    caption: "Cases touched after QA review",
    kind: "integer" as const,
    base: 9,
  },
  {
    label: "Compliance flags",
    caption: "Open items attributed to this coder",
    kind: "integer" as const,
    base: 11,
  },
  {
    label: "Pending decisions",
    caption: "Queue items awaiting sign-off",
    kind: "integer" as const,
    base: 4,
  },
] as const

const BASE_DELTAS = [9.2, -4.1, -6.5, 3.8] as const
const DELTA_WEIGHT = [12, -8, -9, 6] as const

export function computeIndividualCoderSummaryCards(
  range: DateRange | undefined,
  visibleInstitutionKeys: InstitutionSeriesKey[],
): DashboardSummaryCardMetric[] {
  const ratio = dashboardSummaryVolumeRatio(range, visibleInstitutionKeys)

  return INDIVIDUAL_CARD_DEF.map((def, i) => {
    const rawDelta = BASE_DELTAS[i]! + (ratio - 1) * DELTA_WEIGHT[i]!
    const changePercent = Math.max(
      -99.9,
      Math.min(99.9, Math.round(rawDelta * 10) / 10),
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
