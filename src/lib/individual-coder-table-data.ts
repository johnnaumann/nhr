/** Shared 6-column grid: label + five metric slots (pad unused with "—"). */
export type IndividualCoderGridRow = {
  id: number
  label: string
  s1: string
  s2: string
  s3: string
  s4: string
  s5: string
}

const EM = "—"

export const INDIVIDUAL_CODER_GRID_BLOCK_DRG: IndividualCoderGridRow[] = [
  {
    id: 1,
    label: "",
    s1: "84",
    s2: "8.0%",
    s3: "32",
    s4: "8",
    s5: EM,
  },
]

export const INDIVIDUAL_CODER_GRID_BLOCK_MISSED: IndividualCoderGridRow[] = [
  {
    id: 1,
    label: "",
    s1: "6.20%",
    s2: "63",
    s3: "$5,009.00",
    s4: "$1,262,268.00",
    s5: EM,
  },
]

export const INDIVIDUAL_CODER_GRID_BLOCK_COMPLIANCE: IndividualCoderGridRow[] =
  [
    {
      id: 1,
      label: "",
      s1: "2.00%",
      s2: "20",
      s3: "$121.53",
      s4: "$30,382.50",
      s5: EM,
    },
  ]

export const INDIVIDUAL_CODER_GRID_BLOCK_QUALITY: IndividualCoderGridRow[] = [
  {
    id: 1,
    label: "",
    s1: "3.1%",
    s2: "8",
    s3: "11",
    s4: "14",
    s5: EM,
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

export function accuracyRowsToGrid(
  rows: IndividualCoderAccuracyRow[],
): IndividualCoderGridRow[] {
  return rows.map((r) => ({
    id: r.id,
    label: r.type,
    s1: String(r.ttlAssig),
    s2: String(r.ttlChg),
    s3: r.pctAcc,
    s4: EM,
    s5: EM,
  }))
}
