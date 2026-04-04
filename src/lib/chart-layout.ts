import { cn } from "@/lib/utils"

import { dashboardGridGapClass } from "./dashboard-layout"

export { dashboardGridGapClass } from "./dashboard-layout"

/**
 * Dashboard chart panels: shared bordered-muted chrome, filter toolbar strings,
 * and gaps aligned with `dashboard-layout` so the page reads as one grid.
 */

export const chartPanelClass =
  "flex min-h-0 min-w-0 flex-col rounded-xl border border-border/60 bg-muted/40 p-4 dark:bg-muted/20"

export const legendPanelClass =
  "flex h-full min-h-0 flex-1 flex-col gap-4 rounded-xl border border-border/60 bg-muted/40 p-4 dark:bg-muted/20"

export const filterToolbarClass =
  "flex flex-wrap items-baseline gap-x-1 gap-y-2 text-sm text-muted-foreground"

export const filterSelectTriggerClass =
  "h-8 w-fit border-0 border-b border-dashed border-muted-foreground/50 bg-transparent px-1 py-0 font-medium text-foreground shadow-none hover:bg-muted/40 focus:ring-0 focus-visible:ring-0 dark:hover:bg-muted/20"

/** Vertical rhythm matches dashboard grid; horizontal px matches CardHeader. */
export const chartContentClass = cn(
  "flex flex-col px-4 pt-0 pb-4 sm:pb-6",
  dashboardGridGapClass
)

export const pieInsightClass =
  "max-h-24 w-full shrink-0 overflow-y-auto pb-2 text-left text-xs leading-relaxed text-muted-foreground"
