/**
 * Shared Tailwind class-string tokens for dashboard chart panels.
 *
 * Every chart card uses the same bordered-muted panel chrome, filter toolbar
 * layout, and dashed-underline select triggers.  Centralising the strings here
 * keeps visual consistency when a class is tweaked.
 */

export const chartPanelClass =
  "flex min-h-0 min-w-0 flex-col rounded-xl border border-border/60 bg-muted/40 p-3 sm:p-4 dark:bg-muted/20"

export const legendPanelClass =
  "flex h-full min-h-0 flex-1 flex-col gap-3 rounded-xl border border-border/60 bg-muted/40 p-3 sm:p-4 dark:bg-muted/20"

export const filterToolbarClass =
  "flex flex-wrap items-baseline gap-x-1 gap-y-2 text-sm text-muted-foreground"

export const filterSelectTriggerClass =
  "h-8 w-fit border-0 border-b border-dashed border-muted-foreground/50 bg-transparent px-1 py-0 font-medium text-foreground shadow-none hover:bg-muted/40 focus:ring-0 focus-visible:ring-0 dark:hover:bg-muted/20"

export const chartContentClass =
  "flex flex-col gap-8 px-4 pt-2 pb-2 sm:pt-4 lg:px-6"

export const pieInsightClass =
  "max-h-24 w-full shrink-0 overflow-y-auto pb-2 text-left text-xs leading-relaxed text-muted-foreground"
