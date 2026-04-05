import {
  CODER_TRENDS_GENERATED_ROWS,
  type CoderTrendChartRow,
  type CoderTrendCohortKey,
  type CoderTrendGeneratedRow,
} from "@/lib/coder-trends-data"

export type { CoderTrendCohortKey }

export type CoderTrendUnifiedRow = {
  id: number
  cohort: CoderTrendCohortKey
  coderId: string
  totalChartsReviewed: string
  changeRate: string
  avgMissedIncrease: string
  denialRatePotential: string
  avgComplianceRiskSaved: string
  missedQualityChanges: string
}

export const CODER_TRENDS_COHORT_LABELS: Record<CoderTrendCohortKey, string> = {
  "top-performers": "Top performers",
  "flagged-risk": "Flagged for risk",
  "recently-added": "Recently added",
}

function fmtPct(n: number, decimals = 2) {
  return `${n.toFixed(decimals)}%`
}

function fmtUsd(n: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(n)
}

function chartRowToFormatted(
  r: CoderTrendChartRow,
): Omit<CoderTrendUnifiedRow, "id" | "cohort"> {
  return {
    coderId: r.coderId,
    totalChartsReviewed: r.chartsReviewed.toLocaleString(),
    changeRate: fmtPct(r.changeRate),
    avgMissedIncrease: fmtUsd(r.avgMissedIncrease),
    denialRatePotential: fmtPct(r.denialRate),
    avgComplianceRiskSaved: fmtUsd(r.avgComplianceRiskSaved),
    missedQualityChanges: fmtPct(r.missedQualityChanges, 1),
  }
}

function toUnifiedRow(
  r: CoderTrendGeneratedRow,
  id: number,
): CoderTrendUnifiedRow {
  const { cohort, ...chart } = r
  return {
    id,
    cohort,
    ...chartRowToFormatted(chart),
  }
}

/** Single dataset for the unified trends table (50 coders, shuffled cohort types). */
export const CODER_TRENDS_UNIFIED_DATA: CoderTrendUnifiedRow[] =
  CODER_TRENDS_GENERATED_ROWS.map((row, i) => toUnifiedRow(row, i + 1))
