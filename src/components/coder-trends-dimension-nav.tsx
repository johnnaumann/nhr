"use client"

import { useCoderTrendsDimension } from "@/contexts/coder-trends-dimension-context"
import type { CoderTrendCohortKey } from "@/lib/coder-trends-data"
import { CODER_TRENDS_COHORT_LABELS } from "@/lib/coder-trends-table-data"
import { cn } from "@/lib/utils"

export const CODER_TRENDS_TABLE_SECTION_ID = "coder-trends-table-section"

const COHORT_NAV_ORDER: CoderTrendCohortKey[] = [
  "top-performers",
  "flagged-risk",
  "recently-added",
]

export const CODER_TRENDS_DIMENSIONS: {
  filterKey: CoderTrendCohortKey
  label: string
}[] = COHORT_NAV_ORDER.map((k) => ({
  filterKey: k,
  label: CODER_TRENDS_COHORT_LABELS[k],
}))

export function CoderTrendsDimensionNav({
  className,
}: {
  className?: string
}) {
  const { activeFilter, setActiveFilter } = useCoderTrendsDimension()

  return (
    <nav
      className={cn(
        "flex min-h-8 flex-wrap items-center gap-2",
        className,
      )}
      aria-label="Coder trends: filter table by cohort"
    >
      {CODER_TRENDS_DIMENSIONS.map(({ filterKey, label }) => {
        const isActive = activeFilter === filterKey
        return (
          <button
            key={filterKey}
            type="button"
            aria-pressed={isActive}
            aria-controls={CODER_TRENDS_TABLE_SECTION_ID}
            className={cn(
              "inline-flex h-8 items-center rounded-md border px-2.5 text-[0.8rem] font-medium leading-none transition-colors",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
              isActive
                ? "border-primary bg-primary text-primary-foreground"
                : "border-border/60 bg-muted/40 text-foreground hover:bg-muted/70",
            )}
            onClick={() => setActiveFilter(filterKey)}
          >
            {label}
          </button>
        )
      })}
    </nav>
  )
}
