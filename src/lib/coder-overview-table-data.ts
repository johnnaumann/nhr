export type CoderOverviewOverallRow = {
  id: number
  coderId: string
  totalReviewed: string
  changeRate: string
  totalMissedRevenue: string
  totalComplianceRiskPrevented: string
  missedQualityChangeRate: string
}

export type CoderOverviewDrgRow = {
  id: number
  coderId: string
  totalReviewed: string
  totalChanges: string
  changeRate: string
  increasedChanges: string
  decreasedChanges: string
}

export type CoderOverviewMissedRow = {
  id: number
  coderId: string
  totalReviewed: string
  upChanges: string
  changeRate: string
  avgMissedIncrease: string
  totalMissedRevenue: string
}

export type CoderOverviewComplianceRow = {
  id: number
  coderId: string
  totalReviewed: string
  totalChanges: string
  changeRate: string
  avgComplianceRiskSaved: string
  totalComplianceRiskPrevented: string
}

export type CoderOverviewQualityRow = {
  id: number
  coderId: string
  totalReviewed: string
  totalChanges: string
  changeRate: string
  secondaryDiagnosis: string
  secondaryProcedures: string
}

export const CODER_OVERALL_DATA: CoderOverviewOverallRow[] = [
  {
    id: 1,
    coderId: "Coder 1",
    totalReviewed: "889",
    changeRate: "2.23%",
    totalMissedRevenue: "$13,587.84",
    totalComplianceRiskPrevented: "$30,382.50",
    missedQualityChangeRate: "1.8%",
  },
  {
    id: 2,
    coderId: "Coder 2",
    totalReviewed: "842",
    changeRate: "35.6%",
    totalMissedRevenue: "$2,017,816.92",
    totalComplianceRiskPrevented: "$1,430,382.50",
    missedQualityChangeRate: "38.8%",
  },
  {
    id: 3,
    coderId: "Coder 3",
    totalReviewed: "999",
    changeRate: "5.28%",
    totalMissedRevenue: "$240,387.84",
    totalComplianceRiskPrevented: "$55,382.50",
    missedQualityChangeRate: "2.8%",
  },
  {
    id: 4,
    coderId: "Coder 4",
    totalReviewed: "889",
    changeRate: "28.2%",
    totalMissedRevenue: "$254,268.00",
    totalComplianceRiskPrevented: "$1,130,382.50",
    missedQualityChangeRate: "4.5%",
  },
  {
    id: 5,
    coderId: "Coder 5",
    totalReviewed: "532",
    changeRate: "6.23%",
    totalMissedRevenue: "$217,448.28",
    totalComplianceRiskPrevented: "$130,382.50",
    missedQualityChangeRate: "3.6%",
  },
  {
    id: 6,
    coderId: "Coder 6",
    totalReviewed: "1042",
    changeRate: "4.43%",
    totalMissedRevenue: "$65,068.92",
    totalComplianceRiskPrevented: "$55,555.00",
    missedQualityChangeRate: "1.3%",
  },
  {
    id: 7,
    coderId: "Coder 7",
    totalReviewed: "1021",
    changeRate: "8.0%",
    totalMissedRevenue: "$1,262,268.00",
    totalComplianceRiskPrevented: "$168,255.00",
    missedQualityChangeRate: "3.1%",
  },
  {
    id: 8,
    coderId: "Coder 8",
    totalReviewed: "931",
    changeRate: "6.1%",
    totalMissedRevenue: "$245,196.00",
    totalComplianceRiskPrevented: "$155,682.50",
    missedQualityChangeRate: "23.9%",
  },
  {
    id: 9,
    coderId: "Coder 9",
    totalReviewed: "1058",
    changeRate: "5.43%",
    totalMissedRevenue: "$265,587.84",
    totalComplianceRiskPrevented: "$508,607.50",
    missedQualityChangeRate: "2.3%",
  },
]

export const CODER_DRG_DATA: CoderOverviewDrgRow[] = [
  {
    id: 1,
    coderId: "Coder 1",
    totalReviewed: "889",
    totalChanges: "11",
    changeRate: "1.23%",
    increasedChanges: "7",
    decreasedChanges: "4",
  },
  {
    id: 2,
    coderId: "Coder 2",
    totalReviewed: "842",
    totalChanges: "241",
    changeRate: "28.6%",
    increasedChanges: "152",
    decreasedChanges: "89",
  },
  {
    id: 3,
    coderId: "Coder 3",
    totalReviewed: "999",
    totalChanges: "33",
    changeRate: "3.28%",
    increasedChanges: "21",
    decreasedChanges: "12",
  },
  {
    id: 4,
    coderId: "Coder 4",
    totalReviewed: "889",
    totalChanges: "224",
    changeRate: "25.2%",
    increasedChanges: "141",
    decreasedChanges: "83",
  },
  {
    id: 5,
    coderId: "Coder 5",
    totalReviewed: "532",
    totalChanges: "17",
    changeRate: "3.23%",
    increasedChanges: "11",
    decreasedChanges: "6",
  },
  {
    id: 6,
    coderId: "Coder 6",
    totalReviewed: "1042",
    totalChanges: "25",
    changeRate: "2.43%",
    increasedChanges: "16",
    decreasedChanges: "9",
  },
  {
    id: 7,
    coderId: "Coder 7",
    totalReviewed: "1021",
    totalChanges: "84",
    changeRate: "8.2%",
    increasedChanges: "53",
    decreasedChanges: "31",
  },
  {
    id: 8,
    coderId: "Coder 8",
    totalReviewed: "931",
    totalChanges: "57",
    changeRate: "6.1%",
    increasedChanges: "36",
    decreasedChanges: "21",
  },
  {
    id: 9,
    coderId: "Coder 9",
    totalReviewed: "1058",
    totalChanges: "34",
    changeRate: "3.21%",
    increasedChanges: "21",
    decreasedChanges: "13",
  },
]

export const CODER_MISSED_DATA: CoderOverviewMissedRow[] = [
  {
    id: 1,
    coderId: "Coder 1",
    totalReviewed: "889",
    upChanges: "7",
    changeRate: "0.75%",
    avgMissedIncrease: "$53.92",
    totalMissedRevenue: "$13,587.84",
  },
  {
    id: 2,
    coderId: "Coder 2",
    totalReviewed: "842",
    upChanges: "190",
    changeRate: "22.6%",
    avgMissedIncrease: "$8,007.21",
    totalMissedRevenue: "$2,017,816.92",
  },
  {
    id: 3,
    coderId: "Coder 3",
    totalReviewed: "999",
    upChanges: "17",
    changeRate: "1.75%",
    avgMissedIncrease: "$953.92",
    totalMissedRevenue: "$240,387.84",
  },
  {
    id: 4,
    coderId: "Coder 4",
    totalReviewed: "889",
    upChanges: "163",
    changeRate: "18.3%",
    avgMissedIncrease: "$1,009.00",
    totalMissedRevenue: "$254,268.00",
  },
  {
    id: 5,
    coderId: "Coder 5",
    totalReviewed: "532",
    upChanges: "13",
    changeRate: "2.50%",
    avgMissedIncrease: "$862.89",
    totalMissedRevenue: "$217,448.28",
  },
  {
    id: 6,
    coderId: "Coder 6",
    totalReviewed: "1042",
    upChanges: "13",
    changeRate: "1.24%",
    avgMissedIncrease: "$258.21",
    totalMissedRevenue: "$65,068.92",
  },
  {
    id: 7,
    coderId: "Coder 7",
    totalReviewed: "1021",
    upChanges: "63",
    changeRate: "6.2%",
    avgMissedIncrease: "$5,009.00",
    totalMissedRevenue: "$1,262,268.00",
  },
  {
    id: 8,
    coderId: "Coder 8",
    totalReviewed: "931",
    upChanges: "38",
    changeRate: "4.1%",
    avgMissedIncrease: "$973.00",
    totalMissedRevenue: "$245,196.00",
  },
  {
    id: 9,
    coderId: "Coder 9",
    totalReviewed: "1058",
    upChanges: "12",
    changeRate: "1.18%",
    avgMissedIncrease: "$1,053.92",
    totalMissedRevenue: "$265,587.84",
  },
]

export const CODER_COMPLIANCE_DATA: CoderOverviewComplianceRow[] = [
  {
    id: 1,
    coderId: "Coder 1",
    totalReviewed: "889",
    totalChanges: "2",
    changeRate: "0.23%",
    avgComplianceRiskSaved: "$121.53",
    totalComplianceRiskPrevented: "$30,382.50",
  },
  {
    id: 2,
    coderId: "Coder 2",
    totalReviewed: "842",
    totalChanges: "157",
    changeRate: "18.6%",
    avgComplianceRiskSaved: "$5,721.53",
    totalComplianceRiskPrevented: "$1,430,382.50",
  },
  {
    id: 3,
    coderId: "Coder 3",
    totalReviewed: "999",
    totalChanges: "23",
    changeRate: "2.28%",
    avgComplianceRiskSaved: "$221.53",
    totalComplianceRiskPrevented: "$55,382.50",
  },
  {
    id: 4,
    coderId: "Coder 4",
    totalReviewed: "889",
    totalChanges: "129",
    changeRate: "14.6%",
    avgComplianceRiskSaved: "$4,521.53",
    totalComplianceRiskPrevented: "$1,130,382.50",
  },
  {
    id: 5,
    coderId: "Coder 5",
    totalReviewed: "532",
    totalChanges: "12",
    changeRate: "2.23%",
    avgComplianceRiskSaved: "$521.53",
    totalComplianceRiskPrevented: "$130,382.50",
  },
  {
    id: 6,
    coderId: "Coder 6",
    totalReviewed: "1042",
    totalChanges: "15",
    changeRate: "1.43%",
    avgComplianceRiskSaved: "$222.22",
    totalComplianceRiskPrevented: "$55,555.00",
  },
  {
    id: 7,
    coderId: "Coder 7",
    totalReviewed: "1021",
    totalChanges: "20",
    changeRate: "2.0%",
    avgComplianceRiskSaved: "$673.02",
    totalComplianceRiskPrevented: "$168,255.00",
  },
  {
    id: 8,
    coderId: "Coder 8",
    totalReviewed: "931",
    totalChanges: "10",
    changeRate: "1.1%",
    avgComplianceRiskSaved: "$622.73",
    totalComplianceRiskPrevented: "$155,682.50",
  },
  {
    id: 9,
    coderId: "Coder 9",
    totalReviewed: "1058",
    totalChanges: "35",
    changeRate: "3.30%",
    avgComplianceRiskSaved: "$2,034.43",
    totalComplianceRiskPrevented: "$508,607.50",
  },
]

export const CODER_QUALITY_DATA: CoderOverviewQualityRow[] = [
  {
    id: 1,
    coderId: "Coder 1",
    totalReviewed: "889",
    totalChanges: "16",
    changeRate: "1.8%",
    secondaryDiagnosis: "6",
    secondaryProcedures: "7",
  },
  {
    id: 2,
    coderId: "Coder 2",
    totalReviewed: "842",
    totalChanges: "327",
    changeRate: "38.8%",
    secondaryDiagnosis: "118",
    secondaryProcedures: "140",
  },
  {
    id: 3,
    coderId: "Coder 3",
    totalReviewed: "999",
    totalChanges: "28",
    changeRate: "2.8%",
    secondaryDiagnosis: "10",
    secondaryProcedures: "12",
  },
  {
    id: 4,
    coderId: "Coder 4",
    totalReviewed: "889",
    totalChanges: "40",
    changeRate: "4.5%",
    secondaryDiagnosis: "14",
    secondaryProcedures: "17",
  },
  {
    id: 5,
    coderId: "Coder 5",
    totalReviewed: "532",
    totalChanges: "19",
    changeRate: "3.6%",
    secondaryDiagnosis: "7",
    secondaryProcedures: "8",
  },
  {
    id: 6,
    coderId: "Coder 6",
    totalReviewed: "1042",
    totalChanges: "14",
    changeRate: "1.3%",
    secondaryDiagnosis: "5",
    secondaryProcedures: "6",
  },
  {
    id: 7,
    coderId: "Coder 7",
    totalReviewed: "1021",
    totalChanges: "32",
    changeRate: "3.1%",
    secondaryDiagnosis: "11",
    secondaryProcedures: "14",
  },
  {
    id: 8,
    coderId: "Coder 8",
    totalReviewed: "931",
    totalChanges: "223",
    changeRate: "23.9%",
    secondaryDiagnosis: "80",
    secondaryProcedures: "96",
  },
  {
    id: 9,
    coderId: "Coder 9",
    totalReviewed: "1058",
    totalChanges: "24",
    changeRate: "2.3%",
    secondaryDiagnosis: "9",
    secondaryProcedures: "10",
  },
]
