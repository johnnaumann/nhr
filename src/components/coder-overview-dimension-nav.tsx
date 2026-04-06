"use client"

import { useCoderOverviewDimension } from "@/contexts/coder-overview-dimension-context"
import type { CoderOverviewDimensionKey } from "@/lib/coder-overview-table-data"
import { cn } from "@/lib/utils"

export const CODER_OVERVIEW_TABLE_SECTION_ID = "coder-overview-table-section"

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
      className={cn(
        "flex min-h-8 flex-wrap items-center gap-2",
        className,
      )}
      aria-label="Coder overview: choose summary or metric lens"
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
              "inline-flex h-8 items-center rounded-md border px-2.5 text-[0.8rem] font-medium leading-none transition-colors",
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
