import * as React from "react"
import { SearchIcon } from "lucide-react"

import { cn } from "@/lib/utils"

/**
 * Count + search affordance for chart legend rows. Uses secondary surface tokens
 * like `Badge variant="secondary"` but owns layout so the shared `Badge` stays
 * for tables and generic UI only.
 */
/** Shell: chrome + vertical centering; inner span uses inline flex row for count + icon. */
const legendCountPillClass =
  "inline-flex h-6 w-fit shrink-0 items-center justify-center whitespace-nowrap rounded-4xl border border-transparent bg-secondary px-2 py-0 text-xs font-normal leading-none text-secondary-foreground tabular-nums transition-colors"

/** Inline grid so count + icon stay in one row even if a parent uses `flex-col` on `button`. */
const countIconRowStyle: React.CSSProperties = {
  display: "inline-grid",
  gridAutoFlow: "column",
  gridAutoColumns: "max-content",
  alignItems: "center",
  columnGap: "0.375rem",
}

const legendCountPillInteractiveClass =
  "cursor-pointer font-inherit hover:bg-secondary/80 focus-visible:border-ring focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50"

export function LegendItemCountPill({
  count,
  itemLabel,
  onClick,
  className,
}: {
  count: number
  /** Legend row label (for accessible name when interactive). */
  itemLabel: string
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void
  className?: string
}) {
  const formatted = count.toLocaleString()

  const inner = (
    <span className="whitespace-nowrap leading-none" style={countIconRowStyle}>
      <span className="tabular-nums">{formatted}</span>
      <SearchIcon className="size-3 shrink-0 opacity-60" aria-hidden />
    </span>
  )

  if (onClick) {
    return (
      <button
        type="button"
        className={cn(
          legendCountPillClass,
          legendCountPillInteractiveClass,
          className
        )}
        aria-label={`Open change details for ${itemLabel}, ${formatted} items`}
        onClick={onClick}
      >
        {inner}
      </button>
    )
  }

  return (
    <span className={cn(legendCountPillClass, className)}>{inner}</span>
  )
}
