"use client"

import { useCoderOverviewDimension } from "@/contexts/coder-overview-dimension-context"
import type { CoderOverviewDimensionKey } from "@/lib/coder-overview-table-data"
import { cn } from "@/lib/utils"

export const CODER_OVERVIEW_TABLE_SECTION_ID = "coder-overview-table-section"

/** Sticky nav: `overall` shows all category rows; other keys filter to one. */
export const CODER_OVERVIEW_DIMENSIONS: {
  dimensionKey: CoderOverviewDimensionKey
  label: string
}[] = [
  { dimensionKey: "overall", label: "Overall" },
  { dimensionKey: "drg", label: "DRG" },
  { dimensionKey: "missed-opportunities", label: "Missed Opportunities" },
  { dimensionKey: "compliance", label: "Compliance" },
  { dimensionKey: "quality", label: "Quality" },
]

export const CODER_OVERVIEW_DIMENSION_LABELS: Record<
  CoderOverviewDimensionKey,
  string
> = {
  overall: "Overall",
  drg: "DRG",
  "missed-opportunities": "Missed Opportunities",
  compliance: "Compliance",
  quality: "Quality",
}

export function CoderOverviewDimensionNav({
  className,
}: {
  className?: string
}) {
  const { activeDimension, setActiveDimension } = useCoderOverviewDimension()

  return (
    <nav
      className={cn("flex flex-wrap items-center gap-2", className)}
      aria-label="Coder overview: Overall shows all categories, or filter by one"
    >
      {CODER_OVERVIEW_DIMENSIONS.map(({ dimensionKey, label }) => {
        const isActive = activeDimension === dimensionKey
        return (
          <button
            key={dimensionKey}
            type="button"
            aria-pressed={isActive}
            aria-controls={CODER_OVERVIEW_TABLE_SECTION_ID}
            className={cn(
              "rounded-md border px-2.5 py-1 text-xs font-medium transition-colors",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
              isActive
                ? "border-primary bg-primary text-primary-foreground"
                : "border-border/60 bg-muted/40 text-foreground hover:bg-muted/70",
            )}
            onClick={() => setActiveDimension(dimensionKey)}
          >
            {label}
          </button>
        )
      })}
    </nav>
  )
}
