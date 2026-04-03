/**
 * Shared utilities used across dashboard chart components.
 */

/** Scale a base integer by `factor`, rounding and clamping to at least 1. */
export function scaleInt(n: number, factor: number) {
  return Math.max(1, Math.round(n * factor))
}

/** Parse a "YYYY-MM-DD" string into a local Date (avoids timezone shift from `new Date(iso)`). */
export function parseIsoDate(iso: string) {
  const [y, mo, d] = iso.split("-").map(Number)
  return new Date(y, mo - 1, d)
}

/**
 * Toggle a key in a visibility array while preserving the canonical order
 * defined by `allKeys`.
 */
export function toggleVisibleKey<T extends string>(
  prev: T[],
  key: T,
  on: boolean,
  allKeys: readonly T[]
): T[] {
  if (on) {
    if (prev.includes(key)) return prev
    const next = new Set(prev)
    next.add(key)
    return allKeys.filter((k) => next.has(k)) as T[]
  }
  return prev.filter((k) => k !== key)
}

export type PieInsightRow = { label: string; value: number; pct: number }

export type PieInsightCopy = {
  /** Extra sentence appended when top two slices are nearly tied. */
  tiedSuffix?: string
  /** Full sentence when the spread between top and bottom is small. */
  balancedText?: string
  /** Extra sentence appended when the top slice is very large. */
  dominantSuffix?: string
  /** Minimum pct for the "dominant" branch (default 38). */
  dominantThreshold?: number
}

/**
 * Generate a short narrative insight from sorted pie-breakdown rows.
 *
 * If `copy` is omitted the function still produces a sensible default using
 * only label names and percentages.  Pass partial `PieInsightCopy` to
 * customise the phrasing per chart.
 */
export function buildPieInsight(
  sorted: PieInsightRow[],
  total: number,
  copy: PieInsightCopy = {}
): string {
  if (sorted.length === 0 || total === 0) return ""

  const top = sorted[0]!
  const second = sorted[1]
  const bottom = sorted[sorted.length - 1]!
  const spread = top.pct - bottom.pct
  const threshold = copy.dominantThreshold ?? 38

  if (second && Math.abs(top.pct - second.pct) < 4) {
    const base = `${top.label} and ${second.label} are almost tied (${top.pct.toFixed(1)}% vs ${second.pct.toFixed(1)}%).`
    return copy.tiedSuffix ? `${base} ${copy.tiedSuffix}` : base
  }

  if (spread < 12) {
    return (
      copy.balancedText ??
      "Distribution is fairly balanced this period\u2014no single category dominates."
    )
  }

  if (top.pct >= threshold) {
    const base = `${top.label} accounts for a large share (${top.pct.toFixed(1)}%).`
    return copy.dominantSuffix ? `${base} ${copy.dominantSuffix}` : base
  }

  return `${top.label} leads with ${top.pct.toFixed(1)}% of ${total.toLocaleString()} total; ${bottom.label} is lowest at ${bottom.pct.toFixed(1)}%.`
}
