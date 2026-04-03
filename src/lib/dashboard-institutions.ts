import type { ChartConfig } from "@/components/ui/chart"

/** Stable keys aligned with worksheet line series `dataKey`s. */
export const INSTITUTION_SERIES_KEYS = [
  "institution1",
  "institution2",
  "institution3",
  "institution4",
] as const

export type InstitutionSeriesKey = (typeof INSTITUTION_SERIES_KEYS)[number]

/** Labels and colours for institution toggles and Recharts `ChartContainer`. */
export const institutionChartConfig = {
  institution1: { label: "LICH", color: "var(--chart-1)" },
  institution2: { label: "LTH", color: "var(--chart-2)" },
  institution3: { label: "NYU", color: "var(--chart-3)" },
  institution4: { label: "WTH", color: "var(--chart-4)" },
} satisfies ChartConfig

/** Map impact-chart site short codes to worksheet institution keys. */
export const SITE_SHORT_TO_INSTITUTION_KEY: Record<
  string,
  InstitutionSeriesKey
> = {
  LICH: "institution1",
  LTH: "institution2",
  NYU: "institution3",
  WTH: "institution4",
}

export const INSTITUTION_COUNT = INSTITUTION_SERIES_KEYS.length
