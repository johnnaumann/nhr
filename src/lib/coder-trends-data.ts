/** Numeric series for Recharts; labels anonymised as Coder 1, Coder 2, … */
export type CoderTrendChartRow = {
  coderId: string
  chartsReviewed: number
  changeRate: number
  avgMissedIncrease: number
  denialRate: number
  avgComplianceRiskSaved: number
  missedQualityChanges: number
}

export const CODER_TRENDS_TOP_PERFORMERS: CoderTrendChartRow[] = [
  {
    coderId: "Coder 1",
    chartsReviewed: 889,
    changeRate: 2.23,
    avgMissedIncrease: 53.92,
    denialRate: 1.34,
    avgComplianceRiskSaved: 121.53,
    missedQualityChanges: 1.8,
  },
  {
    coderId: "Coder 2",
    chartsReviewed: 1042,
    changeRate: 4.43,
    avgMissedIncrease: 258.21,
    denialRate: 1.98,
    avgComplianceRiskSaved: 222.22,
    missedQualityChanges: 1.3,
  },
  {
    coderId: "Coder 3",
    chartsReviewed: 999,
    changeRate: 5.28,
    avgMissedIncrease: 953.92,
    denialRate: 2.11,
    avgComplianceRiskSaved: 221.53,
    missedQualityChanges: 2.8,
  },
  {
    coderId: "Coder 4",
    chartsReviewed: 532,
    changeRate: 6.23,
    avgMissedIncrease: 862.89,
    denialRate: 4.11,
    avgComplianceRiskSaved: 521.53,
    missedQualityChanges: 3.6,
  },
  {
    coderId: "Coder 5",
    chartsReviewed: 1058,
    changeRate: 5.43,
    avgMissedIncrease: 1053.92,
    denialRate: 5.34,
    avgComplianceRiskSaved: 2034.43,
    missedQualityChanges: 2.3,
  },
]

export const CODER_TRENDS_FLAGGED: CoderTrendChartRow[] = [
  {
    coderId: "Coder 1",
    chartsReviewed: 889,
    changeRate: 28.2,
    avgMissedIncrease: 1009,
    denialRate: 17.1,
    avgComplianceRiskSaved: 4521.53,
    missedQualityChanges: 4.5,
  },
  {
    coderId: "Coder 2",
    chartsReviewed: 1021,
    changeRate: 8.0,
    avgMissedIncrease: 5009,
    denialRate: 2.3,
    avgComplianceRiskSaved: 673.02,
    missedQualityChanges: 3.1,
  },
  {
    coderId: "Coder 3",
    chartsReviewed: 842,
    changeRate: 35.6,
    avgMissedIncrease: 8007.21,
    denialRate: 9.1,
    avgComplianceRiskSaved: 5721.53,
    missedQualityChanges: 38.8,
  },
  {
    coderId: "Coder 4",
    chartsReviewed: 931,
    changeRate: 6.1,
    avgMissedIncrease: 973,
    denialRate: 4.2,
    avgComplianceRiskSaved: 622.73,
    missedQualityChanges: 23.9,
  },
]

export const CODER_TRENDS_RECENT: CoderTrendChartRow[] = [
  {
    coderId: "Coder 1",
    chartsReviewed: 889,
    changeRate: 28.2,
    avgMissedIncrease: 1009,
    denialRate: 17.1,
    avgComplianceRiskSaved: 4521.53,
    missedQualityChanges: 4.5,
  },
  {
    coderId: "Coder 2",
    chartsReviewed: 931,
    changeRate: 6.1,
    avgMissedIncrease: 973,
    denialRate: 4.2,
    avgComplianceRiskSaved: 622.73,
    missedQualityChanges: 23.9,
  },
]
