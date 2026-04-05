import { differenceInCalendarDays, endOfDay, startOfDay } from "date-fns"
import type { DateRange } from "react-day-picker"

import {
  INSTITUTION_COUNT,
  type InstitutionSeriesKey,
} from "@/lib/dashboard-institutions"
import type { CoderOverviewUnifiedRow } from "@/lib/coder-overview-table-data"

function fnv1a(str: string): number {
  let h = 2_166_136_261
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i)
    h = Math.imul(h, 16_777_619)
  }
  return h >>> 0
}

/** Deterministic scalar in [lo, hi] from seed + row + salt. */
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
  return `$${n.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`
}

function computeDayCount(range: DateRange | undefined): number {
  if (!range?.from) return 7
  const from = startOfDay(range.from)
  const to = range.to ? endOfDay(range.to) : endOfDay(range.from)
  return Math.max(1, differenceInCalendarDays(to, from) + 1)
}

/**
 * Demo-only: perturbs base rows from date span and visible sites so the table
 * reacts when the sticky toolbar filters change.
 */
export function deriveCoderOverviewUnifiedData(
  base: CoderOverviewUnifiedRow[],
  options: {
    range: DateRange | undefined
    visibleInstitutionKeys: InstitutionSeriesKey[]
  },
): CoderOverviewUnifiedRow[] {
  const dayCount = computeDayCount(options.range)
  const siteCount = Math.max(1, options.visibleInstitutionKeys.length)
  const siteWeight = siteCount / INSTITUTION_COUNT
  /** Longer windows → higher volumes; cap so numbers stay plausible. */
  const rangeWeight = Math.max(0.35, Math.min(2.2, dayCount / 7))
  const seed = fnv1a(
    `${dayCount}|${[...options.visibleInstitutionKeys].sort().join(",")}`,
  )

  return base.map((row) => {
    const basis =
      rangeWeight * (0.38 + 0.62 * siteWeight) * rowScale(seed, row.id, 0, 0.9, 1.08)

    const reviewed = Math.max(
      1,
      Math.round(parseIntLocale(row.totalReviewed) * basis * rowScale(seed, row.id, 1)),
    )
    const rate = Math.min(
      55,
      Math.max(0.08, parsePercent(row.changeRate) * basis * rowScale(seed, row.id, 2)),
    )

    const tc0 = Math.max(1, parseIntLocale(row.totalChanges))
    const tc = Math.max(
      1,
      Math.round(tc0 * basis * rowScale(seed, row.id, 3)),
    )
    const inc0 = Math.max(1, parseIntLocale(row.increasedChanges))
    const dec0 = Math.max(1, parseIntLocale(row.decreasedChanges))
    const up0 = Math.max(1, parseIntLocale(row.upChanges))
    let inc = Math.max(1, Math.round((inc0 / tc0) * tc))
    let dec = Math.max(1, Math.round((dec0 / tc0) * tc))
    if (inc + dec > tc) {
      const s = tc / (inc + dec)
      inc = Math.max(1, Math.floor(inc * s))
      dec = Math.max(1, tc - inc)
    } else if (inc + dec < tc) {
      dec = tc - inc
    }
    const up = Math.max(1, Math.min(tc, Math.round((up0 / tc0) * tc)))

    const missAvg = Math.max(
      50,
      parseMoney(row.avgMissedIncrease) * basis * rowScale(seed, row.id, 4),
    )
    const missTot = Math.max(
      1_000,
      parseMoney(row.totalMissedRevenue) * basis * rowScale(seed, row.id, 5),
    )
    const compAvg = Math.max(
      50,
      parseMoney(row.avgComplianceRiskSaved) * basis * rowScale(seed, row.id, 6),
    )
    const compTot = Math.max(
      5_000,
      parseMoney(row.totalComplianceRiskPrevented) * basis * rowScale(seed, row.id, 7),
    )

    const secDx = Math.max(
      1,
      Math.round(parseIntLocale(row.secondaryDiagnosis) * basis * rowScale(seed, row.id, 8)),
    )
    const secPx = Math.max(
      1,
      Math.round(parseIntLocale(row.secondaryProcedures) * basis * rowScale(seed, row.id, 9)),
    )

    return {
      ...row,
      totalReviewed: reviewed.toLocaleString("en-US"),
      changeRate: `${rate.toFixed(2)}%`,
      totalChanges: String(tc),
      increasedChanges: String(inc),
      decreasedChanges: String(dec),
      upChanges: String(up),
      avgMissedIncrease: formatUsd(missAvg),
      totalMissedRevenue: formatUsd(missTot),
      avgComplianceRiskSaved: formatUsd(compAvg),
      totalComplianceRiskPrevented: formatUsd(compTot),
      secondaryDiagnosis: String(secDx),
      secondaryProcedures: String(secPx),
    }
  })
}
