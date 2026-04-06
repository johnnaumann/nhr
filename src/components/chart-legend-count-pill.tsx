import * as React from "react"
import { SearchIcon } from "lucide-react"

import { badgeVariants } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

/**
 * Same row layout as `tableTypeBadgeLayoutClass` in `coder-overview-tables.tsx`
 * (icon + label). Applied on top of `badgeVariants({ variant: "secondary" })`.
 *
 * Native `button`/`span` + classes avoid `Badge asChild`/`Slot` merges that were
 * collapsing to a column layout in some builds.
 */
const legendCountChipRowClass =
  "!inline-flex !flex-row flex-nowrap items-center justify-center gap-1 leading-none [&_svg]:inline-block [&>svg]:shrink-0"

export function LegendItemCountPill({
  count,
  itemLabel,
  onClick,
  className,
}: {
  count: number
  itemLabel: string
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void
  className?: string
}) {
  const formatted = count.toLocaleString()

  const chipClass = cn(
    badgeVariants({ variant: "secondary" }),
    legendCountChipRowClass,
    "!font-normal tabular-nums",
    onClick &&
      "cursor-pointer hover:bg-secondary/80 active:bg-secondary/90 focus-visible:outline-none",
    className,
  )

  const content = (
    <>
      <span className="leading-none tabular-nums">{formatted}</span>
      <SearchIcon className="opacity-60" aria-hidden />
    </>
  )

  if (onClick) {
    return (
      <button
        type="button"
        data-slot="badge"
        data-variant="secondary"
        className={chipClass}
        aria-label={`Open change details for ${itemLabel}, ${formatted} items`}
        onClick={onClick}
      >
        {content}
      </button>
    )
  }

  return (
    <span
      data-slot="badge"
      data-variant="secondary"
      className={chipClass}
    >
      {content}
    </span>
  )
}
