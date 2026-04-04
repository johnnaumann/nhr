import {
  CODER_TRENDS_FLAGGED,
  CODER_TRENDS_RECENT,
  CODER_TRENDS_TOP_PERFORMERS,
  type CoderTrendChartRow,
} from "@/lib/coder-trends-data"

export type CoderTrendTableRow = {
  id: number
  coderId: string
  totalChartsReviewed: string
  changeRate: string
  avgMissedIncrease: string
  denialRatePotential: string
  avgComplianceRiskSaved: string
  missedQualityChanges: string
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

function toTableRows(rows: CoderTrendChartRow[]): CoderTrendTableRow[] {
  return rows.map((r, i) => ({
    id: i + 1,
    coderId: r.coderId,
    totalChartsReviewed: r.chartsReviewed.toLocaleString(),
    changeRate: fmtPct(r.changeRate),
    avgMissedIncrease: fmtUsd(r.avgMissedIncrease),
    denialRatePotential: fmtPct(r.denialRate),
    avgComplianceRiskSaved: fmtUsd(r.avgComplianceRiskSaved),
    missedQualityChanges: fmtPct(r.missedQualityChanges, 1),
  }))
}

export const CODER_TRENDS_TOP_TABLE_DATA: CoderTrendTableRow[] = toTableRows(
  CODER_TRENDS_TOP_PERFORMERS,
)

export const CODER_TRENDS_FLAGGED_TABLE_DATA: CoderTrendTableRow[] =
  toTableRows(CODER_TRENDS_FLAGGED)

export const CODER_TRENDS_RECENT_TABLE_DATA: CoderTrendTableRow[] = toTableRows(
  CODER_TRENDS_RECENT,
)
