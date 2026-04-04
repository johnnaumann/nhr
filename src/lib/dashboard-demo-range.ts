import { eachDayOfInterval, startOfDay, subDays } from "date-fns"
import type { DateRange } from "react-day-picker"

import type { InstitutionSeriesKey } from "./dashboard-institutions"

/**
 * Length of the original Q2 demo window (Apr 1–Jun 30), used to scale volumes
 * so longer ranges grow roughly proportionally.
 */
export const DEMO_SCALE_REFERENCE_DAYS = 91

/** Calendar bounds for demo charts; always `to >= from`, at start-of-day. */
export function resolveDashboardRangeBounds(
  range: DateRange | undefined
): { from: Date; to: Date } {
  const today = startOfDay(new Date())
  if (!range?.from) {
    return {
      from: subDays(today, DEMO_SCALE_REFERENCE_DAYS - 1),
      to: today,
    }
  }
  let from = startOfDay(range.from)
  let to = startOfDay(range.to ?? range.from)
  if (to < from) {
    const t = from
    from = to
    to = t
  }
  return { from, to }
}

/** Every `yyyy-MM-dd` in the reporting range (inclusive). */
export function eachIsoDateInDashboardRange(
  range: DateRange | undefined
): string[] {
  const { from, to } = resolveDashboardRangeBounds(range)
  return eachDayOfInterval({ start: from, end: to }).map((d) => {
    const y = d.getFullYear()
    const m = String(d.getMonth() + 1).padStart(2, "0")
    const day = String(d.getDate()).padStart(2, "0")
    return `${y}-${m}-${day}`
  })
}

export function dashboardRangeDayCount(
  range: DateRange | undefined
): number {
  return eachIsoDateInDashboardRange(range).length
}

/**
 * Demo-only multiplier from sticky header site selection + reporting range so
 * charts that are not truly per-site still move noticeably during a presentation.
 * Stable for the same inputs; typically ~0.75–1.15.
 */
export function demoHeaderBlendMultiplier(
  visibleInstitutionKeys: InstitutionSeriesKey[],
  range: DateRange | undefined,
  chartSalt: string
): number {
  const sortedKeys = [...visibleInstitutionKeys].sort().join("|")
  const isos = eachIsoDateInDashboardRange(range)
  const rangeKey =
    isos.length > 0
      ? `${isos[0]}..${isos[isos.length - 1]}#${isos.length}`
      : "empty"

  let h = chartSalt.length * 911
  for (let i = 0; i < sortedKeys.length; i++) {
    h = Math.imul(h, 31) + sortedKeys.charCodeAt(i)
  }
  for (let i = 0; i < rangeKey.length; i++) {
    h = Math.imul(h, 31) + rangeKey.charCodeAt(i)
  }
  h >>>= 0

  const jitter = 0.9 + (h % 21) / 100
  const siteBreadth = visibleInstitutionKeys.length / 4
  const base = 0.78 + 0.22 * siteBreadth
  return base * jitter
}
