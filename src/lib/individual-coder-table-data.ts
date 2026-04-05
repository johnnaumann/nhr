export type IndividualCoderBlockDrgRow = {
  id: number
  chartsChanged: string
  changeRate: string
  drgChanges: string
  qualityChanges: string
  recoveredDrg: string
}

export type IndividualCoderBlockMissedRow = {
  id: number
  changeRate: string
  upChanges: string
  avgMissedIncrease: string
  totalMissedRevenue: string
}

export type IndividualCoderBlockComplianceRow = {
  id: number
  changeRate: string
  complianceChanges: string
  avgComplianceRiskPrevented: string
  totalComplianceRiskPrevented: string
}

export type IndividualCoderBlockQualityRow = {
  id: number
  changeRate: string
  pdx: string
  secondaryDiagnosis: string
  secondaryProcedures: string
}

/** DRG / volume summary — one demo row per block. */
export const INDIVIDUAL_CODER_BLOCK_DRG: IndividualCoderBlockDrgRow[] = [
  {
    id: 1,
    chartsChanged: "84",
    changeRate: "8.0%",
    drgChanges: "32",
    qualityChanges: "8",
    recoveredDrg: "—",
  },
]

export const INDIVIDUAL_CODER_BLOCK_MISSED: IndividualCoderBlockMissedRow[] = [
  {
    id: 1,
    changeRate: "6.20%",
    upChanges: "63",
    avgMissedIncrease: "$5,009.00",
    totalMissedRevenue: "$1,262,268.00",
  },
]

export const INDIVIDUAL_CODER_BLOCK_COMPLIANCE: IndividualCoderBlockComplianceRow[] =
  [
    {
      id: 1,
      changeRate: "2.00%",
      complianceChanges: "20",
      avgComplianceRiskPrevented: "$121.53",
      totalComplianceRiskPrevented: "$30,382.50",
    },
  ]

export const INDIVIDUAL_CODER_BLOCK_QUALITY: IndividualCoderBlockQualityRow[] = [
  {
    id: 1,
    changeRate: "3.1%",
    pdx: "8",
    secondaryDiagnosis: "11",
    secondaryProcedures: "14",
  },
]

export const INDIVIDUAL_CODER_OVERVIEW_BLOCK_IDS = {
  drg: "individual-coder-overview-drg",
  missed: "individual-coder-overview-missed",
  compliance: "individual-coder-overview-compliance",
  quality: "individual-coder-overview-quality",
} as const

export type IndividualCoderAccuracyRow = {
  id: number
  type: string
  ttlAssig: number
  ttlChg: number
  pctAcc: string
}

const ACCURACY_SOURCE: Omit<IndividualCoderAccuracyRow, "id">[] = [
  { type: "Coding accuracy", ttlAssig: 235, ttlChg: 9, pctAcc: "96%" },
  { type: "Dx accuracy", ttlAssig: 182, ttlChg: 9, pctAcc: "95%" },
  { type: "PCS accuracy", ttlAssig: 53, ttlChg: 0, pctAcc: "100%" },
  { type: "Disposition acc", ttlAssig: 23, ttlChg: 0, pctAcc: "100%" },
  { type: "POA accuracy", ttlAssig: 182, ttlChg: 0, pctAcc: "100%" },
  { type: "Risk of mortality", ttlAssig: 23, ttlChg: 1, pctAcc: "96%" },
  { type: "Severity of illness", ttlAssig: 23, ttlChg: 3, pctAcc: "87%" },
]

export const INDIVIDUAL_CODER_ACCURACY_ROWS: IndividualCoderAccuracyRow[] =
  ACCURACY_SOURCE.map((r, i) => ({ ...r, id: i + 1 }))
