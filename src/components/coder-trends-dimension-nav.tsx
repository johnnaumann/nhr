"use client"

import { cn } from "@/lib/utils"

export const CODER_TRENDS_SECTIONS = [
  { sectionId: "coder-trends-top-performers", label: "Top performers" },
  { sectionId: "coder-trends-flagged-risk", label: "Flagged for risk" },
  {
    sectionId: "coder-trends-recently-added",
    label: "Recently added",
  },
] as const

function scrollToSection(sectionId: string) {
  document.getElementById(sectionId)?.scrollIntoView({
    behavior: "smooth",
    block: "start",
  })
}

export function CoderTrendsDimensionNav({
  className,
}: {
  className?: string
}) {
  return (
    <nav
      className={cn("flex flex-wrap items-center gap-2", className)}
      aria-label="Jump to trend cohort sections"
    >
      <span className="text-xs font-medium text-muted-foreground">
        Cohorts:
      </span>
      {CODER_TRENDS_SECTIONS.map(({ sectionId, label }) => (
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
