import type { CoderTrendCohortKey } from "@/lib/coder-trends-data"

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
  "recently-added": "Recently added (Last 14 days)",
}

/**
 * Coder 1–15: eight top performers, four flagged, three recently added.
 * Figures match the provided “Last 3 Months” spec (plus three extra top rows).
 */
export const CODER_TRENDS_UNIFIED_DATA: CoderTrendUnifiedRow[] = [
  // Top performers — Coder 1–5 from spec (former Coder 10, 57, 63, 44, 46)
  {
    id: 1,
    cohort: "top-performers",
    coderId: "Coder 1",
    totalChartsReviewed: "889",
    changeRate: "2.23%",
    avgMissedIncrease: "$53.92",
    denialRatePotential: "1.34%",
    avgComplianceRiskSaved: "$121.53",
    missedQualityChanges: "1.8%",
  },
  {
    id: 2,
    cohort: "top-performers",
    coderId: "Coder 2",
    totalChartsReviewed: "1,042",
    changeRate: "4.43%",
    avgMissedIncrease: "$258.21",
    denialRatePotential: "1.98%",
    avgComplianceRiskSaved: "$222.22",
    missedQualityChanges: "1.3%",
  },
  {
    id: 3,
    cohort: "top-performers",
    coderId: "Coder 3",
    totalChartsReviewed: "999",
    changeRate: "5.28%",
    avgMissedIncrease: "$953.92",
    denialRatePotential: "2.11%",
    avgComplianceRiskSaved: "$221.53",
    missedQualityChanges: "2.8%",
  },
  {
    id: 4,
    cohort: "top-performers",
    coderId: "Coder 4",
    totalChartsReviewed: "532",
    changeRate: "6.23%",
    avgMissedIncrease: "$862.89",
    denialRatePotential: "4.11%",
    avgComplianceRiskSaved: "$521.53",
    missedQualityChanges: "3.6%",
  },
  {
    id: 5,
    cohort: "top-performers",
    coderId: "Coder 5",
    totalChartsReviewed: "1,058",
    changeRate: "5.43%",
    avgMissedIncrease: "$1,053.92",
    denialRatePotential: "5.34%",
    avgComplianceRiskSaved: "$2,034.43",
    missedQualityChanges: "2.3%",
  },
  // Top performers — Coder 6–8 (same cohort profile, extended)
  {
    id: 6,
    cohort: "top-performers",
    coderId: "Coder 6",
    totalChartsReviewed: "756",
    changeRate: "3.15%",
    avgMissedIncrease: "$188.40",
    denialRatePotential: "1.52%",
    avgComplianceRiskSaved: "$168.90",
    missedQualityChanges: "2.0%",
  },
  {
    id: 7,
    cohort: "top-performers",
    coderId: "Coder 7",
    totalChartsReviewed: "918",
    changeRate: "4.05%",
    avgMissedIncrease: "$412.65",
    denialRatePotential: "1.76%",
    avgComplianceRiskSaved: "$198.75",
    missedQualityChanges: "2.2%",
  },
  {
    id: 8,
    cohort: "top-performers",
    coderId: "Coder 8",
    totalChartsReviewed: "615",
    changeRate: "5.65%",
    avgMissedIncrease: "$698.50",
    denialRatePotential: "3.42%",
    avgComplianceRiskSaved: "$445.80",
    missedQualityChanges: "3.0%",
  },
  // Flagged for risk — Coder 9–12
  {
    id: 9,
    cohort: "flagged-risk",
    coderId: "Coder 9",
    totalChartsReviewed: "889",
    changeRate: "28.2%",
    avgMissedIncrease: "$1,009.00",
    denialRatePotential: "17.1%",
    avgComplianceRiskSaved: "$4,521.53",
    missedQualityChanges: "4.5%",
  },
  {
    id: 10,
    cohort: "flagged-risk",
    coderId: "Coder 10",
    totalChartsReviewed: "1,021",
    changeRate: "8.0%",
    avgMissedIncrease: "$5,009.00",
    denialRatePotential: "2.3%",
    avgComplianceRiskSaved: "$673.02",
    missedQualityChanges: "3.1%",
  },
  {
    id: 11,
    cohort: "flagged-risk",
    coderId: "Coder 11",
    totalChartsReviewed: "842",
    changeRate: "35.6%",
    avgMissedIncrease: "$8,007.21",
    denialRatePotential: "9.1%",
    avgComplianceRiskSaved: "$5,721.53",
    missedQualityChanges: "38.8%",
  },
  {
    id: 12,
    cohort: "flagged-risk",
    coderId: "Coder 12",
    totalChartsReviewed: "931",
    changeRate: "6.1%",
    avgMissedIncrease: "$973.00",
    denialRatePotential: "4.2%",
    avgComplianceRiskSaved: "$622.73",
    missedQualityChanges: "23.9%",
  },
  // Recently added — Coder 13–15 (three rows)
  {
    id: 13,
    cohort: "recently-added",
    coderId: "Coder 13",
    totalChartsReviewed: "889",
    changeRate: "28.2%",
    avgMissedIncrease: "$1,009.00",
    denialRatePotential: "17.1%",
    avgComplianceRiskSaved: "$4,521.53",
    missedQualityChanges: "4.5%",
  },
  {
    id: 14,
    cohort: "recently-added",
    coderId: "Coder 14",
    totalChartsReviewed: "931",
    changeRate: "6.1%",
    avgMissedIncrease: "$973.00",
    denialRatePotential: "4.2%",
    avgComplianceRiskSaved: "$622.73",
    missedQualityChanges: "23.9%",
  },
  {
    id: 15,
    cohort: "recently-added",
    coderId: "Coder 15",
    totalChartsReviewed: "1,021",
    changeRate: "8.0%",
    avgMissedIncrease: "$5,009.00",
    denialRatePotential: "2.3%",
    avgComplianceRiskSaved: "$673.02",
    missedQualityChanges: "3.1%",
  },
]
