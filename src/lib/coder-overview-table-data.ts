/** Row badge / slice: one of the category tables (not “Overall”). */
export type CoderOverviewRowDimension =
  | "drg"
  | "missed-opportunities"
  | "compliance"
  | "quality"

/**
 * Sticky nav selection. `overall` means show every category row; other keys
 * filter to that category only.
 */
export type CoderOverviewDimensionKey =
  | "overall"
  | CoderOverviewRowDimension

/** One row per coder; every metric populated for the combined “Overall” view. */
export type CoderOverviewUnifiedRow = {
  id: number
  dimension: CoderOverviewRowDimension
  coderId: string
  totalReviewed: string
  changeRate: string
  totalChanges: string
  increasedChanges: string
  decreasedChanges: string
  upChanges: string
  avgMissedIncrease: string
  totalMissedRevenue: string
  avgComplianceRiskSaved: string
  totalComplianceRiskPrevented: string
  secondaryDiagnosis: string
  secondaryProcedures: string
}

const DIMENSION_MIX_CYCLE: CoderOverviewRowDimension[] = [
  "compliance",
  "drg",
  "quality",
  "missed-opportunities",
  "drg",
  "compliance",
  "missed-opportunities",
  "quality",
  "drg",
]

function formatUsd(n: number): string {
  return `$${n.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`
}

function buildDemoCoderRow(id: number): CoderOverviewUnifiedRow {
  const dimension = DIMENSION_MIX_CYCLE[(id - 1) % DIMENSION_MIX_CYCLE.length]
  const tc = 8 + ((id * 31) % 52)
  const inc = Math.max(1, Math.round(tc * (0.45 + (id % 7) * 0.03)))
  const dec = Math.max(1, tc - inc)
  const up = Math.max(1, Math.min(tc, Math.round(tc * 0.42 + (id % 6))))
  const reviewed = 420 + ((id * 79) % 740)
  const ratePct = 0.6 + (((id * 13) % 77) / 10)

  return {
    id,
    dimension,
    coderId: `Coder ${id}`,
    totalReviewed: reviewed.toLocaleString("en-US"),
    changeRate: `${ratePct.toFixed(2)}%`,
    totalChanges: String(tc),
    increasedChanges: String(inc),
    decreasedChanges: String(dec),
    upChanges: String(up),
    avgMissedIncrease: formatUsd(120 + id * 47 + (id % 11) * 12),
    totalMissedRevenue: formatUsd(8000 + id * 4980 + (id % 13) * 900),
    avgComplianceRiskSaved: formatUsd(180 + id * 23),
    totalComplianceRiskPrevented: formatUsd(28000 + id * 11200),
    secondaryDiagnosis: String(4 + (id * 5) % 24),
    secondaryProcedures: String(5 + (id * 7) % 28),
  }
}

/** First nine rows (curated); remaining rows follow the same mix pattern with generated metrics. */
const CODER_OVERVIEW_BASE_ROWS: CoderOverviewUnifiedRow[] = [
  {
    id: 1,
    dimension: "compliance",
    coderId: "Coder 1",
    totalReviewed: "743",
    changeRate: "2.10%",
    totalChanges: "16",
    increasedChanges: "10",
    decreasedChanges: "6",
    upChanges: "8",
    avgMissedIncrease: "$442.10",
    totalMissedRevenue: "$58,320.40",
    avgComplianceRiskSaved: "$612.40",
    totalComplianceRiskPrevented: "$98,200.00",
    secondaryDiagnosis: "9",
    secondaryProcedures: "11",
  },
  {
    id: 2,
    dimension: "drg",
    coderId: "Coder 2",
    totalReviewed: "892",
    changeRate: "4.20%",
    totalChanges: "38",
    increasedChanges: "24",
    decreasedChanges: "14",
    upChanges: "11",
    avgMissedIncrease: "$318.50",
    totalMissedRevenue: "$112,400.00",
    avgComplianceRiskSaved: "$198.30",
    totalComplianceRiskPrevented: "$76,500.00",
    secondaryDiagnosis: "5",
    secondaryProcedures: "7",
  },
  {
    id: 3,
    dimension: "quality",
    coderId: "Coder 3",
    totalReviewed: "521",
    changeRate: "1.90%",
    totalChanges: "10",
    increasedChanges: "6",
    decreasedChanges: "4",
    upChanges: "3",
    avgMissedIncrease: "$890.00",
    totalMissedRevenue: "$24,100.00",
    avgComplianceRiskSaved: "$445.00",
    totalComplianceRiskPrevented: "$32,000.00",
    secondaryDiagnosis: "12",
    secondaryProcedures: "14",
  },
  {
    id: 4,
    dimension: "missed-opportunities",
    coderId: "Coder 4",
    totalReviewed: "967",
    changeRate: "5.60%",
    totalChanges: "54",
    increasedChanges: "31",
    decreasedChanges: "23",
    upChanges: "44",
    avgMissedIncrease: "$1,102.25",
    totalMissedRevenue: "$485,900.00",
    avgComplianceRiskSaved: "$267.80",
    totalComplianceRiskPrevented: "$145,600.00",
    secondaryDiagnosis: "8",
    secondaryProcedures: "9",
  },
  {
    id: 5,
    dimension: "drg",
    coderId: "Coder 5",
    totalReviewed: "634",
    changeRate: "3.10%",
    totalChanges: "20",
    increasedChanges: "13",
    decreasedChanges: "7",
    upChanges: "9",
    avgMissedIncrease: "$205.00",
    totalMissedRevenue: "$41,200.00",
    avgComplianceRiskSaved: "$334.50",
    totalComplianceRiskPrevented: "$51,800.00",
    secondaryDiagnosis: "6",
    secondaryProcedures: "8",
  },
  {
    id: 6,
    dimension: "compliance",
    coderId: "Coder 6",
    totalReviewed: "1,102",
    changeRate: "0.80%",
    totalChanges: "9",
    increasedChanges: "5",
    decreasedChanges: "4",
    upChanges: "2",
    avgMissedIncrease: "$156.75",
    totalMissedRevenue: "$12,450.00",
    avgComplianceRiskSaved: "$721.20",
    totalComplianceRiskPrevented: "$210,300.00",
    secondaryDiagnosis: "4",
    secondaryProcedures: "5",
  },
  {
    id: 7,
    dimension: "missed-opportunities",
    coderId: "Coder 7",
    totalReviewed: "778",
    changeRate: "7.20%",
    totalChanges: "56",
    increasedChanges: "34",
    decreasedChanges: "22",
    upChanges: "51",
    avgMissedIncrease: "$2,015.80",
    totalMissedRevenue: "$1,025,000.00",
    avgComplianceRiskSaved: "$589.10",
    totalComplianceRiskPrevented: "$88,400.00",
    secondaryDiagnosis: "15",
    secondaryProcedures: "18",
  },
  {
    id: 8,
    dimension: "quality",
    coderId: "Coder 8",
    totalReviewed: "445",
    changeRate: "3.80%",
    totalChanges: "27",
    increasedChanges: "17",
    decreasedChanges: "10",
    upChanges: "14",
    avgMissedIncrease: "$412.30",
    totalMissedRevenue: "$55,780.00",
    avgComplianceRiskSaved: "$203.60",
    totalComplianceRiskPrevented: "$67,200.00",
    secondaryDiagnosis: "22",
    secondaryProcedures: "26",
  },
  {
    id: 9,
    dimension: "drg",
    coderId: "Coder 9",
    totalReviewed: "901",
    changeRate: "2.90%",
    totalChanges: "29",
    increasedChanges: "18",
    decreasedChanges: "11",
    upChanges: "12",
    avgMissedIncrease: "$501.00",
    totalMissedRevenue: "$98,650.00",
    avgComplianceRiskSaved: "$412.75",
    totalComplianceRiskPrevented: "$124,900.00",
    secondaryDiagnosis: "7",
    secondaryProcedures: "10",
  },
]

const EXTRA_CODER_COUNT = 41

/**
 * 50 coders (`Coder 1` … `Coder 50`). Types cycle through the mix pattern; all
 * metric columns are filled on every row (demo).
 */
export const CODER_OVERVIEW_UNIFIED_DATA: CoderOverviewUnifiedRow[] = [
  ...CODER_OVERVIEW_BASE_ROWS,
  ...Array.from({ length: EXTRA_CODER_COUNT }, (_, i) =>
    buildDemoCoderRow(10 + i),
  ),
]
