/** Lens tabs excluding the combined summary. */
export type CoderOverviewRowDimension =
  | "drg"
  | "missed-opportunities"
  | "compliance"
  | "quality"

export type CoderOverviewDimensionKey =
  | "overall"
  | CoderOverviewRowDimension

function formatUsd(amount: number): string {
  return `$${amount.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`
}

function parseIntLocale(s: string): number {
  return Number.parseInt(s.replace(/,/g, ""), 10) || 0
}

function parseUsd(s: string): number {
  return Number.parseFloat(s.replace(/[$,]/g, "")) || 0
}

function parsePct(s: string): number {
  return Number.parseFloat(s.replace(/%/g, "").trim()) || 0
}

// ——— Overall (9 source rows → Coder 1–9; 10–15 extended) ———

export type CoderOverviewOverallRow = {
  id: number
  coderId: string
  totalReviewed: string
  changeRate: string
  totalMissedRevenue: string
  totalComplianceRiskPrevented: string
  missedQualityChangeRate: string
}

const OVERALL_NINE: Omit<
  CoderOverviewOverallRow,
  "id" | "coderId"
>[] = [
  {
    totalReviewed: "889",
    changeRate: "2.23%",
    totalMissedRevenue: "$13,587.84",
    totalComplianceRiskPrevented: "$30,382.50",
    missedQualityChangeRate: "1.8%",
  },
  {
    totalReviewed: "842",
    changeRate: "35.6%",
    totalMissedRevenue: "$2,017,816.92",
    totalComplianceRiskPrevented: "$1,430,382.50",
    missedQualityChangeRate: "38.8%",
  },
  {
    totalReviewed: "999",
    changeRate: "5.28%",
    totalMissedRevenue: "$240,387.84",
    totalComplianceRiskPrevented: "$55,382.50",
    missedQualityChangeRate: "2.8%",
  },
  {
    totalReviewed: "889",
    changeRate: "28.2%",
    totalMissedRevenue: "$254,268.00",
    totalComplianceRiskPrevented: "$1,130,382.50",
    missedQualityChangeRate: "4.5%",
  },
  {
    totalReviewed: "532",
    changeRate: "6.23%",
    totalMissedRevenue: "$217,448.28",
    totalComplianceRiskPrevented: "$130,382.50",
    missedQualityChangeRate: "3.6%",
  },
  {
    totalReviewed: "1,042",
    changeRate: "4.43%",
    totalMissedRevenue: "$65,068.92",
    totalComplianceRiskPrevented: "$55,555.00",
    missedQualityChangeRate: "1.3%",
  },
  {
    totalReviewed: "1,021",
    changeRate: "8.0%",
    totalMissedRevenue: "$1,262,268.00",
    totalComplianceRiskPrevented: "$168,255.00",
    missedQualityChangeRate: "3.1%",
  },
  {
    totalReviewed: "931",
    changeRate: "6.1%",
    totalMissedRevenue: "$245,196.00",
    totalComplianceRiskPrevented: "$155,682.50",
    missedQualityChangeRate: "23.9%",
  },
  {
    totalReviewed: "1,058",
    changeRate: "5.43%",
    totalMissedRevenue: "$265,587.84",
    totalComplianceRiskPrevented: "$508,607.50",
    missedQualityChangeRate: "2.3%",
  },
]

function buildOverall15(): CoderOverviewOverallRow[] {
  const rows: CoderOverviewOverallRow[] = OVERALL_NINE.map((r, i) => ({
    id: i + 1,
    coderId: `Coder ${i + 1}`,
    ...r,
  }))
  for (let id = 10; id <= 15; id++) {
    const s = OVERALL_NINE[(id - 10) % 9]!
    const reviewed = parseIntLocale(s.totalReviewed) + (id - 9) * 19
    const rate = Math.min(55, parsePct(s.changeRate) + (id - 10) * 0.42)
    const miss = parseUsd(s.totalMissedRevenue) * (1 + (id - 10) * 0.055)
    const comp =
      parseUsd(s.totalComplianceRiskPrevented) * (1 + (id % 5) * 0.035)
    const qual = Math.min(99, parsePct(s.missedQualityChangeRate) + (id - 10) * 0.55)
    rows.push({
      id,
      coderId: `Coder ${id}`,
      totalReviewed: reviewed.toLocaleString("en-US"),
      changeRate: `${rate.toFixed(2)}%`,
      totalMissedRevenue: formatUsd(miss),
      totalComplianceRiskPrevented: formatUsd(comp),
      missedQualityChangeRate: `${qual.toFixed(1)}%`,
    })
  }
  return rows
}

export const CODER_OVERVIEW_OVERALL_DATA = buildOverall15()

// ——— DRG ———

export type CoderOverviewDrgRow = {
  id: number
  coderId: string
  totalReviewed: string
  totalChanges: string
  changeRate: string
  increasedChanges: string
  decreasedChanges: string
}

const DRG_NINE: Omit<CoderOverviewDrgRow, "id" | "coderId">[] = [
  {
    totalReviewed: "889",
    totalChanges: "11",
    changeRate: "1.23%",
    increasedChanges: "7",
    decreasedChanges: "4",
  },
  {
    totalReviewed: "842",
    totalChanges: "241",
    changeRate: "28.6%",
    increasedChanges: "152",
    decreasedChanges: "89",
  },
  {
    totalReviewed: "999",
    totalChanges: "33",
    changeRate: "3.28%",
    increasedChanges: "21",
    decreasedChanges: "12",
  },
  {
    totalReviewed: "889",
    totalChanges: "224",
    changeRate: "25.2%",
    increasedChanges: "141",
    decreasedChanges: "83",
  },
  {
    totalReviewed: "532",
    totalChanges: "17",
    changeRate: "3.23%",
    increasedChanges: "11",
    decreasedChanges: "6",
  },
  {
    totalReviewed: "1,042",
    totalChanges: "25",
    changeRate: "2.43%",
    increasedChanges: "16",
    decreasedChanges: "9",
  },
  {
    totalReviewed: "1,021",
    totalChanges: "84",
    changeRate: "8.2%",
    increasedChanges: "53",
    decreasedChanges: "31",
  },
  {
    totalReviewed: "931",
    totalChanges: "57",
    changeRate: "6.1%",
    increasedChanges: "36",
    decreasedChanges: "21",
  },
  {
    totalReviewed: "1,058",
    totalChanges: "34",
    changeRate: "3.21%",
    increasedChanges: "21",
    decreasedChanges: "13",
  },
]

function buildDrg15(): CoderOverviewDrgRow[] {
  const rows: CoderOverviewDrgRow[] = DRG_NINE.map((r, i) => ({
    id: i + 1,
    coderId: `Coder ${i + 1}`,
    ...r,
  }))
  for (let id = 10; id <= 15; id++) {
    const s = DRG_NINE[(id - 10) % 9]!
    const reviewed = parseIntLocale(s.totalReviewed) + (id - 9) * 16
    let tc = parseIntLocale(s.totalChanges) + (id - 9)
    let inc = parseIntLocale(s.increasedChanges) + ((id - 10) % 5)
    let dec = parseIntLocale(s.decreasedChanges) + ((id - 11) % 4)
    if (inc + dec > tc) {
      tc = inc + dec
    } else {
      dec = tc - inc
    }
    const rate = Math.min(55, (tc / Math.max(1, reviewed)) * 100)
    rows.push({
      id,
      coderId: `Coder ${id}`,
      totalReviewed: reviewed.toLocaleString("en-US"),
      totalChanges: String(tc),
      changeRate: `${rate.toFixed(2)}%`,
      increasedChanges: String(inc),
      decreasedChanges: String(dec),
    })
  }
  return rows
}

export const CODER_OVERVIEW_DRG_DATA = buildDrg15()

// ——— Missed opportunities ———

export type CoderOverviewMissedRow = {
  id: number
  coderId: string
  totalReviewed: string
  upChanges: string
  changeRate: string
  avgMissedIncrease: string
  totalMissedRevenue: string
}

const MISSED_NINE: Omit<CoderOverviewMissedRow, "id" | "coderId">[] = [
  {
    totalReviewed: "889",
    upChanges: "7",
    changeRate: "0.75%",
    avgMissedIncrease: "$53.92",
    totalMissedRevenue: "$13,587.84",
  },
  {
    totalReviewed: "842",
    upChanges: "190",
    changeRate: "22.6%",
    avgMissedIncrease: "$8,007.21",
    totalMissedRevenue: "$2,017,816.92",
  },
  {
    totalReviewed: "999",
    upChanges: "17",
    changeRate: "1.75%",
    avgMissedIncrease: "$953.92",
    totalMissedRevenue: "$240,387.84",
  },
  {
    totalReviewed: "889",
    upChanges: "163",
    changeRate: "18.3%",
    avgMissedIncrease: "$1,009.00",
    totalMissedRevenue: "$254,268.00",
  },
  {
    totalReviewed: "532",
    upChanges: "13",
    changeRate: "2.50%",
    avgMissedIncrease: "$862.89",
    totalMissedRevenue: "$217,448.28",
  },
  {
    totalReviewed: "1,042",
    upChanges: "13",
    changeRate: "1.24%",
    avgMissedIncrease: "$258.21",
    totalMissedRevenue: "$65,068.92",
  },
  {
    totalReviewed: "1,021",
    upChanges: "63",
    changeRate: "6.2%",
    avgMissedIncrease: "$5,009.00",
    totalMissedRevenue: "$1,262,268.00",
  },
  {
    totalReviewed: "931",
    upChanges: "38",
    changeRate: "4.1%",
    avgMissedIncrease: "$973.00",
    totalMissedRevenue: "$245,196.00",
  },
  {
    totalReviewed: "1,058",
    upChanges: "12",
    changeRate: "1.18%",
    avgMissedIncrease: "$1,053.92",
    totalMissedRevenue: "$265,587.84",
  },
]

function buildMissed15(): CoderOverviewMissedRow[] {
  const rows: CoderOverviewMissedRow[] = MISSED_NINE.map((r, i) => ({
    id: i + 1,
    coderId: `Coder ${i + 1}`,
    ...r,
  }))
  for (let id = 10; id <= 15; id++) {
    const s = MISSED_NINE[(id - 10) % 9]!
    const reviewed = parseIntLocale(s.totalReviewed) + (id - 9) * 14
    const up = Math.min(
      reviewed,
      parseIntLocale(s.upChanges) + ((id - 10) % 6) + 1,
    )
    const avg = parseUsd(s.avgMissedIncrease) * (1 + (id - 10) * 0.04)
    const miss = parseUsd(s.totalMissedRevenue) * (1 + (id % 4) * 0.045)
    const rate = Math.min(55, (up / Math.max(1, reviewed)) * 100)
    rows.push({
      id,
      coderId: `Coder ${id}`,
      totalReviewed: reviewed.toLocaleString("en-US"),
      upChanges: String(up),
      changeRate: `${rate.toFixed(2)}%`,
      avgMissedIncrease: formatUsd(avg),
      totalMissedRevenue: formatUsd(miss),
    })
  }
  return rows
}

export const CODER_OVERVIEW_MISSED_DATA = buildMissed15()

// ——— Compliance ———

export type CoderOverviewComplianceRow = {
  id: number
  coderId: string
  totalReviewed: string
  totalChanges: string
  changeRate: string
  avgComplianceRiskSaved: string
  totalComplianceRiskPrevented: string
}

const COMPLIANCE_NINE: Omit<CoderOverviewComplianceRow, "id" | "coderId">[] = [
  {
    totalReviewed: "889",
    totalChanges: "2",
    changeRate: "0.23%",
    avgComplianceRiskSaved: "$121.53",
    totalComplianceRiskPrevented: "$30,382.50",
  },
  {
    totalReviewed: "842",
    totalChanges: "157",
    changeRate: "18.6%",
    avgComplianceRiskSaved: "$5,721.53",
    totalComplianceRiskPrevented: "$1,430,382.50",
  },
  {
    totalReviewed: "999",
    totalChanges: "23",
    changeRate: "2.28%",
    avgComplianceRiskSaved: "$221.53",
    totalComplianceRiskPrevented: "$55,382.50",
  },
  {
    totalReviewed: "889",
    totalChanges: "129",
    changeRate: "14.6%",
    avgComplianceRiskSaved: "$4,521.53",
    totalComplianceRiskPrevented: "$1,130,382.50",
  },
  {
    totalReviewed: "532",
    totalChanges: "12",
    changeRate: "2.23%",
    avgComplianceRiskSaved: "$521.53",
    totalComplianceRiskPrevented: "$130,382.50",
  },
  {
    totalReviewed: "1,042",
    totalChanges: "15",
    changeRate: "1.43%",
    avgComplianceRiskSaved: "$222.22",
    totalComplianceRiskPrevented: "$55,555.00",
  },
  {
    totalReviewed: "1,021",
    totalChanges: "20",
    changeRate: "2.0%",
    avgComplianceRiskSaved: "$673.02",
    totalComplianceRiskPrevented: "$168,255.00",
  },
  {
    totalReviewed: "931",
    totalChanges: "10",
    changeRate: "1.1%",
    avgComplianceRiskSaved: "$622.73",
    totalComplianceRiskPrevented: "$155,682.50",
  },
  {
    totalReviewed: "1,058",
    totalChanges: "35",
    changeRate: "3.30%",
    avgComplianceRiskSaved: "$2,034.43",
    totalComplianceRiskPrevented: "$508,607.50",
  },
]

function buildCompliance15(): CoderOverviewComplianceRow[] {
  const rows: CoderOverviewComplianceRow[] = COMPLIANCE_NINE.map((r, i) => ({
    id: i + 1,
    coderId: `Coder ${i + 1}`,
    ...r,
  }))
  for (let id = 10; id <= 15; id++) {
    const s = COMPLIANCE_NINE[(id - 10) % 9]!
    const reviewed = parseIntLocale(s.totalReviewed) + (id - 9) * 18
    let tc = parseIntLocale(s.totalChanges) + ((id - 10) % 4)
    tc = Math.min(reviewed, Math.max(1, tc))
    const rate = Math.min(55, (tc / Math.max(1, reviewed)) * 100)
    const avg = parseUsd(s.avgComplianceRiskSaved) * (1 + (id - 10) * 0.035)
    const tot = parseUsd(s.totalComplianceRiskPrevented) * (1 + (id % 5) * 0.028)
    rows.push({
      id,
      coderId: `Coder ${id}`,
      totalReviewed: reviewed.toLocaleString("en-US"),
      totalChanges: String(tc),
      changeRate: `${rate.toFixed(2)}%`,
      avgComplianceRiskSaved: formatUsd(avg),
      totalComplianceRiskPrevented: formatUsd(tot),
    })
  }
  return rows
}

export const CODER_OVERVIEW_COMPLIANCE_DATA = buildCompliance15()

// ——— Quality ———

export type CoderOverviewQualityRow = {
  id: number
  coderId: string
  totalReviewed: string
  totalChanges: string
  changeRate: string
  secondaryDiagnosis: string
  secondaryProcedures: string
}

const QUALITY_NINE: Omit<CoderOverviewQualityRow, "id" | "coderId">[] = [
  {
    totalReviewed: "889",
    totalChanges: "16",
    changeRate: "1.8%",
    secondaryDiagnosis: "6",
    secondaryProcedures: "7",
  },
  {
    totalReviewed: "842",
    totalChanges: "327",
    changeRate: "38.8%",
    secondaryDiagnosis: "118",
    secondaryProcedures: "140",
  },
  {
    totalReviewed: "999",
    totalChanges: "28",
    changeRate: "2.8%",
    secondaryDiagnosis: "10",
    secondaryProcedures: "12",
  },
  {
    totalReviewed: "889",
    totalChanges: "40",
    changeRate: "4.5%",
    secondaryDiagnosis: "14",
    secondaryProcedures: "17",
  },
  {
    totalReviewed: "532",
    totalChanges: "19",
    changeRate: "3.6%",
    secondaryDiagnosis: "7",
    secondaryProcedures: "8",
  },
  {
    totalReviewed: "1,042",
    totalChanges: "14",
    changeRate: "1.3%",
    secondaryDiagnosis: "5",
    secondaryProcedures: "6",
  },
  {
    totalReviewed: "1,021",
    totalChanges: "32",
    changeRate: "3.1%",
    secondaryDiagnosis: "11",
    secondaryProcedures: "14",
  },
  {
    totalReviewed: "931",
    totalChanges: "223",
    changeRate: "23.9%",
    secondaryDiagnosis: "80",
    secondaryProcedures: "96",
  },
  {
    totalReviewed: "1,058",
    totalChanges: "24",
    changeRate: "2.3%",
    secondaryDiagnosis: "9",
    secondaryProcedures: "10",
  },
]

function buildQuality15(): CoderOverviewQualityRow[] {
  const rows: CoderOverviewQualityRow[] = QUALITY_NINE.map((r, i) => ({
    id: i + 1,
    coderId: `Coder ${i + 1}`,
    ...r,
  }))
  for (let id = 10; id <= 15; id++) {
    const s = QUALITY_NINE[(id - 10) % 9]!
    const reviewed = parseIntLocale(s.totalReviewed) + (id - 9) * 15
    let tc = parseIntLocale(s.totalChanges) + ((id - 10) % 7)
    tc = Math.min(reviewed, Math.max(1, tc))
    const rate = Math.min(55, (tc / Math.max(1, reviewed)) * 100)
    const dx = Math.max(
      1,
      parseIntLocale(s.secondaryDiagnosis) + ((id - 10) % 3),
    )
    const px = Math.max(
      1,
      parseIntLocale(s.secondaryProcedures) + ((id - 11) % 4),
    )
    rows.push({
      id,
      coderId: `Coder ${id}`,
      totalReviewed: reviewed.toLocaleString("en-US"),
      totalChanges: String(tc),
      changeRate: `${rate.toFixed(1)}%`,
      secondaryDiagnosis: String(dx),
      secondaryProcedures: String(px),
    })
  }
  return rows
}

export const CODER_OVERVIEW_QUALITY_DATA = buildQuality15()
