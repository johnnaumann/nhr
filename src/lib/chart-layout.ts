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

/**
 * Legend list shell: `h-full min-h-0` so the bordered panel matches sibling chart
 * columns in `items-stretch` grids (content stays top-aligned via `flex-col`).
 */
export const legendPanelClass = cn(mutedPanelShell, "h-full min-h-0 gap-4")

/** Pie / compound sidebar: grow within a flex column parent. */
export const legendPanelFillClass = cn(legendPanelClass, "flex-1")

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

/**
 * Cartesian plots: fill the padded chart panel (flex-1) with sensible minimums.
 * `basis-0` + `flex-1` lets the plot consume remaining row height in stretch grids.
 */
export const chartPlotHeightClass = cn(
  "flex h-full w-full min-w-0 flex-1 flex-col !aspect-auto",
  "min-h-[240px] basis-0 md:min-h-[280px]"
)

/** Taller minimum on `md+` (e.g. many categories in empty state). */
export const chartPlotTallHeightClass = cn(
  "flex h-full w-full min-w-0 flex-1 flex-col !aspect-auto",
  "min-h-[240px] basis-0 md:min-h-[320px]"
)

/** Pie slot inside a flex column: grows like Cartesian charts, same minimum heights. */
export const chartPieSlotClass = cn(
  "flex min-h-[240px] w-full min-w-0 flex-1 flex-col items-center justify-center",
  "md:min-h-[280px]"
)

/**
 * Fixed-height block above pie charts so stretch-grids don’t resize sibling charts.
 * Long summaries scroll inside this slot; labels are no longer shortened mid-word in {@link buildPieInsight}.
 */
export const chartPieInsightSlotClass =
  "h-20 w-full shrink-0 overflow-y-auto overflow-x-hidden"

/** Full summary body; lives inside {@link chartPieInsightSlotClass} (scroll there if needed). */
export const pieInsightClass =
  "m-0 w-full text-pretty text-left text-sm leading-relaxed text-muted-foreground"

/** Label before pie insight body (pair with `{" "}` after the span so a space is always present). */
export const pieInsightLabelClass = "shrink-0 font-medium text-foreground"
