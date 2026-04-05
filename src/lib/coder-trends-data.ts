/** Numeric series for charts / tables; labels anonymised as Coder 1, Coder 2, … */
export type CoderTrendCohortKey =
  | "top-performers"
  | "flagged-risk"
  | "recently-added"

export type CoderTrendChartRow = {
  coderId: string
  chartsReviewed: number
  changeRate: number
  avgMissedIncrease: number
  denialRate: number
  avgComplianceRiskSaved: number
  missedQualityChanges: number
}

export type CoderTrendGeneratedRow = CoderTrendChartRow & {
  cohort: CoderTrendCohortKey
}

/** Deterministic value in [0, 1) from coder index and salt. */
function noise(coderIndex: number, salt: number): number {
  let x = Math.imul(coderIndex ^ salt, 0x9e3779b1)
  x ^= x >>> 16
  x = Math.imul(x, 0x7feb352d)
  x ^= x >>> 15
  return (x >>> 0) % 10000 / 10000
}

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t
}

/** 50 cohort slots (~balanced), shuffled so types are interleaved irregularly. */
function shuffledCohortOrder(): CoderTrendCohortKey[] {
  const pool: CoderTrendCohortKey[] = [
    ...Array(17).fill("top-performers" as const),
    ...Array(17).fill("flagged-risk" as const),
    ...Array(16).fill("recently-added" as const),
  ]
  let state = 0xc0ffee42
  for (let i = pool.length - 1; i > 0; i--) {
    state = (Math.imul(state, 1664525) + 1013904223) >>> 0
    const j = state % (i + 1)
    const t = pool[i]!
    pool[i] = pool[j]!
    pool[j] = t
  }
  return pool
}

function buildRow(
  coderIndex: number,
  cohort: CoderTrendCohortKey,
): CoderTrendGeneratedRow {
  const n1 = noise(coderIndex, 11)
  const n2 = noise(coderIndex, 22)
  const n3 = noise(coderIndex, 33)
  const n4 = noise(coderIndex, 44)
  const n5 = noise(coderIndex, 55)
  const n6 = noise(coderIndex, 66)

  const coderId = `Coder ${coderIndex}`

  if (cohort === "top-performers") {
    return {
      coderId,
      cohort,
      chartsReviewed: Math.round(lerp(520, 1250, n1)),
      changeRate: lerp(1.4, 7.2, n2),
      avgMissedIncrease: lerp(38, 1080, n3),
      denialRate: lerp(0.55, 5.6, n4),
      avgComplianceRiskSaved: lerp(85, 2050, n5),
      missedQualityChanges: lerp(0.45, 3.6, n6),
    }
  }

  if (cohort === "flagged-risk") {
    return {
      coderId,
      cohort,
      chartsReviewed: Math.round(lerp(410, 1180, n1)),
      changeRate: lerp(5.5, 41, n2),
      avgMissedIncrease: lerp(780, 8100, n3),
      denialRate: lerp(2.8, 21, n4),
      avgComplianceRiskSaved: lerp(520, 9000, n5),
      missedQualityChanges: lerp(3.8, 47, n6),
    }
  }

  return {
    coderId,
    cohort,
    chartsReviewed: Math.round(lerp(42, 355, n1)),
    changeRate: lerp(2.8, 21, n2),
    avgMissedIncrease: lerp(65, 510, n3),
    denialRate: lerp(0.75, 6.4, n4),
    avgComplianceRiskSaved: lerp(60, 535, n5),
    missedQualityChanges: lerp(0.35, 5.1, n6),
  }
}

const cohortForRow = shuffledCohortOrder()

/** 50 demo coders with pseudo-random cohort mix and cohort-appropriate metrics. */
export const CODER_TRENDS_GENERATED_ROWS: CoderTrendGeneratedRow[] =
  cohortForRow.map((cohort, i) => buildRow(i + 1, cohort))
