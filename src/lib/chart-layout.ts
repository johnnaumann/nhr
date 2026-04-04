import { cn } from "@/lib/utils"

import { dashboardGridGapClass } from "./dashboard-layout"

export { dashboardGridGapClass } from "./dashboard-layout"

/**
 * Dashboard chart panels: shared bordered-muted chrome. Every panel uses the
 * same inset (`px-4` + `py-4`); **only** the grid’s `dashboardGridGapClass`
 * separates adjacent columns so spacing stays visually consistent.
 */

const mutedPanelShell =
  "flex min-h-0 min-w-0 flex-col rounded-xl border border-border/60 bg-muted/40 p-4 dark:bg-muted/20"

export const chartPanelClass = mutedPanelShell

export const legendPanelClass = cn(mutedPanelShell, "h-full flex-1 gap-4")

export const filterToolbarClass =
  "flex flex-wrap items-baseline gap-x-1 gap-y-2 text-sm text-muted-foreground"

export const filterSelectTriggerClass =
  "h-8 w-fit border-0 border-b border-dashed border-muted-foreground/50 bg-transparent px-1 py-0 font-medium text-foreground shadow-none hover:bg-muted/40 focus:ring-0 focus-visible:ring-0 dark:hover:bg-muted/20"

/**
 * Chart body: horizontal inset matches CardHeader (`px-4`). No extra bottom
 * padding — `Card` already uses `py-4`, so adding `pb-*` here doubled the
 * space below the charts vs. the sides.
 */
export const chartContentClass = cn(
  "flex flex-col px-4 pt-0 pb-0",
  dashboardGridGapClass
)

export const pieInsightClass =
  "max-h-24 w-full shrink-0 overflow-y-auto pb-2 text-left text-xs leading-relaxed text-muted-foreground"
