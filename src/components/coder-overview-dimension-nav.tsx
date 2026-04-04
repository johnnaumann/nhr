"use client"

import { cn } from "@/lib/utils"

/** Section `id` values for Coder Overview tables (used by sticky nav and scroll targets). */
export const CODER_OVERVIEW_DIMENSIONS = [
  { sectionId: "coder-overview-overall", label: "Overall" },
  { sectionId: "coder-overview-drg", label: "DRG" },
  {
    sectionId: "coder-overview-missed-opportunities",
    label: "Missed Opportunities",
  },
  { sectionId: "coder-overview-compliance", label: "Compliance" },
  { sectionId: "coder-overview-quality", label: "Quality" },
] as const

function scrollToSection(sectionId: string) {
  document.getElementById(sectionId)?.scrollIntoView({
    behavior: "smooth",
    block: "start",
  })
}

export function CoderOverviewDimensionNav({
  className,
}: {
  className?: string
}) {
  return (
    <nav
      className={cn("flex flex-wrap items-center gap-2", className)}
      aria-label="Jump to dimension sections"
    >
      <span className="text-xs font-medium text-muted-foreground">
        Dimensions:
      </span>
      {CODER_OVERVIEW_DIMENSIONS.map(({ sectionId, label }) => (
        <button
          key={sectionId}
          type="button"
          aria-controls={sectionId}
          className={cn(
            "rounded-md border border-border/60 bg-muted/40 px-2.5 py-1 text-xs font-medium text-foreground",
            "transition-colors hover:bg-muted/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
          )}
          onClick={() => scrollToSection(sectionId)}
        >
          {label}
        </button>
      ))}
    </nav>
  )
}
