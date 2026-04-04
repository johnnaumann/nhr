import * as React from "react"
import { SearchIcon } from "lucide-react"

import { cn } from "@/lib/utils"

/**
 * Count + search affordance for chart legend rows. Uses secondary surface tokens
 * like `Badge variant="secondary"` but owns layout so the shared `Badge` stays
 * for tables and generic UI only.
 */
const legendCountPillClass =
  "inline-grid h-6 w-fit shrink-0 auto-cols-max grid-flow-col items-center gap-x-1.5 whitespace-nowrap rounded-4xl border border-transparent bg-secondary px-2 py-0 text-xs font-normal leading-none text-secondary-foreground tabular-nums transition-colors [&_svg]:inline-block [&_svg]:shrink-0 [&_svg]:align-middle"

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
    <>
      <span>{formatted}</span>
      <SearchIcon className="size-3 opacity-60" aria-hidden />
    </>
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
