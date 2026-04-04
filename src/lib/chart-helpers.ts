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
  /** Appended after the tied pattern (keep ~same length as other charts’ suffixes). */
  tiedSuffix?: string
  /** Full insight when the spread between top and bottom is small (~same length as other branches). */
  balancedText?: string
  /** Appended after the dominant pattern. */
  dominantSuffix?: string
  /** Appended after the spread pattern (top vs bottom labels). */
  spreadSuffix?: string
  /** Minimum pct for the "dominant" branch (default 38). */
  dominantThreshold?: number
}

function normalizePieInsightText(s: string): string {
  return s.replace(/\s+/g, " ").trim()
}

/**
 * Pie summary lines use parallel patterns per branch. Category labels are kept
 * whole (trimmed only); long text scrolls inside the fixed pie insight slot.
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

  const a = top.label.trim()
  const b = bottom.label.trim()
  const p1 = Math.round(top.pct)
  const p2 = second ? Math.round(second.pct) : 0
  const pb = Math.round(bottom.pct)

  if (second && Math.abs(top.pct - second.pct) < 4) {
    const s2 = second.label.trim()
    const core = `${a} & ${s2} tied ${p1}%/${p2}%.`
    const tail =
      copy.tiedSuffix ??
      "See charts for timing and share details in this range."
    return normalizePieInsightText(`${core} ${tail}`)
  }

  if (spread < 12) {
    const text =
      copy.balancedText ??
      "Mix looks even this range\u2014no slice leads the pie by a clear margin."
    return normalizePieInsightText(text)
  }

  if (top.pct >= threshold) {
    const core = `${a} leads at ${p1}% in this pie slice.`
    const tail =
      copy.dominantSuffix ??
      "Confirm drivers on the paired chart for this reporting range."
    return normalizePieInsightText(`${core} ${tail}`)
  }

  const core = `${a} leads ${p1}%; ${b} lowest ${pb}%.`
  const tail =
    copy.spreadSuffix ??
    "Compare top versus bottom slices in the paired chart views."
  return normalizePieInsightText(`${core} ${tail}`)
}
