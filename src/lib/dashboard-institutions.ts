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
  institution1: { label: "Site 1", color: "var(--chart-1)" },
  institution2: { label: "Site 2", color: "var(--chart-2)" },
  institution3: { label: "Site 3", color: "var(--chart-3)" },
  institution4: { label: "Site 4", color: "var(--chart-4)" },
} satisfies ChartConfig

/** Map impact-chart site labels to worksheet institution keys. */
export const SITE_SHORT_TO_INSTITUTION_KEY: Record<
  string,
  InstitutionSeriesKey
> = {
  "Site 1": "institution1",
  "Site 2": "institution2",
  "Site 3": "institution3",
  "Site 4": "institution4",
}

export const INSTITUTION_COUNT = INSTITUTION_SERIES_KEYS.length
