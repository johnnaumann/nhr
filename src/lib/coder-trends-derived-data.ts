import { differenceInCalendarDays, endOfDay, startOfDay } from "date-fns"
import type { DateRange } from "react-day-picker"

import {
  INSTITUTION_COUNT,
  type InstitutionSeriesKey,
} from "@/lib/dashboard-institutions"
import type { CoderTrendUnifiedRow } from "@/lib/coder-trends-table-data"

function fnv1a(str: string): number {
  let h = 2_166_136_261
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i)
    h = Math.imul(h, 16_777_619)
  }
  return h >>> 0
}

function rowScale(seed: number, rowId: number, salt: number, lo = 0.82, hi = 1.14) {
  let x = seed ^ Math.imul(rowId, 2_654_435_761) ^ Math.imul(salt, 1_039_523_477)
  x ^= x >>> 16
  x = Math.imul(x, 2_246_822_507)
  x ^= x >>> 13
  const u = (x >>> 0) / 0xffff_ffff
  return lo + u * (hi - lo)
}

function parseIntLocale(s: string): number {
  const n = Number.parseInt(s.replace(/,/g, ""), 10)
  return Number.isFinite(n) ? n : 0
}

function parsePercent(s: string): number {
  const n = Number.parseFloat(s.replace("%", "").trim())
  return Number.isFinite(n) ? n : 0
}

function parseMoney(s: string): number {
  const n = Number.parseFloat(s.replace(/[$,]/g, ""))
  return Number.isFinite(n) ? n : 0
}

function formatUsd(n: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(n)
}

function computeDayCount(range: DateRange | undefined): number {
  if (!range?.from) return 7
  const from = startOfDay(range.from)
  const to = range.to ? endOfDay(range.to) : endOfDay(range.from)
  return Math.max(1, differenceInCalendarDays(to, from) + 1)
}

/**
 * Demo-only: scales base trend rows by reporting window and visible sites so the
 * table matches coder overview behaviour when the sticky toolbar changes.
 */
export function deriveCoderTrendsUnifiedData(
  base: CoderTrendUnifiedRow[],
  options: {
    range: DateRange | undefined
    visibleInstitutionKeys: InstitutionSeriesKey[]
  },
): CoderTrendUnifiedRow[] {
  const dayCount = computeDayCount(options.range)
  const siteCount = Math.max(1, options.visibleInstitutionKeys.length)
  const siteWeight = siteCount / INSTITUTION_COUNT
  const rangeWeight = Math.max(0.35, Math.min(2.2, dayCount / 7))
  const seed = fnv1a(
    `${dayCount}|${[...options.visibleInstitutionKeys].sort().join(",")}`,
  )

  return base.map((row) => {
    const basis =
      rangeWeight * (0.38 + 0.62 * siteWeight) * rowScale(seed, row.id, 0, 0.9, 1.08)

    const charts = Math.max(
      1,
      Math.round(
        parseIntLocale(row.totalChartsReviewed) * basis * rowScale(seed, row.id, 1),
      ),
    )
    const changeRate = Math.min(
      55,
      Math.max(
        0.05,
        parsePercent(row.changeRate) * basis * rowScale(seed, row.id, 2),
      ),
    )
    const missAvg = Math.max(
      5,
      parseMoney(row.avgMissedIncrease) * basis * rowScale(seed, row.id, 3),
    )
    const denial = Math.min(
      45,
      Math.max(
        0.1,
        parsePercent(row.denialRatePotential) * basis * rowScale(seed, row.id, 4),
      ),
    )
    const compAvg = Math.max(
      5,
      parseMoney(row.avgComplianceRiskSaved) * basis * rowScale(seed, row.id, 5),
    )
    const qualMiss = Math.min(
      55,
      Math.max(
        0.05,
        parsePercent(row.missedQualityChanges) * basis * rowScale(seed, row.id, 6),
      ),
    )

    return {
      ...row,
      totalChartsReviewed: charts.toLocaleString("en-US"),
      changeRate: `${changeRate.toFixed(2)}%`,
      avgMissedIncrease: formatUsd(missAvg),
      denialRatePotential: `${denial.toFixed(2)}%`,
      avgComplianceRiskSaved: formatUsd(compAvg),
      missedQualityChanges: `${qualMiss.toFixed(1)}%`,
    }
  })
}
