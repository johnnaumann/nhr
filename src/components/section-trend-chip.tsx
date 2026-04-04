"use client"

import { TrendingDownIcon, TrendingUpIcon } from "lucide-react"

import { cn } from "@/lib/utils"

export type SectionTrend = "up" | "down"

const trendChipToneClass = {
  up: "border-emerald-500/35 bg-emerald-500/10 text-emerald-800 dark:border-emerald-500/45 dark:bg-emerald-500/15 dark:text-emerald-300",
  down:
    "border-rose-500/35 bg-rose-500/10 text-rose-800 dark:border-rose-500/45 dark:bg-rose-500/15 dark:text-rose-300",
} as const

/** Plain text — NumberFlow’s web component breaks flex row layout inside small chips. */
function formatChangePercentLabel(value: number): string {
  if (value > 0) return `+${value.toFixed(1)}%`
  return `${value.toFixed(1)}%`
}

/**
 * Percent-change chip for dashboard summary cards (NumberFlow cards).
 * Not the shared `Badge` primitive — layout and tokens are tuned for this slot only.
 */
/** Same rhythm as table status badges: flex row, icon–label gap via `pl-1` on the text. */
const trendChipLayoutClass =
  "inline-flex flex-row flex-nowrap items-center justify-center gap-0 whitespace-nowrap rounded-4xl border px-2 py-0.5 text-xs font-medium leading-none tabular-nums shadow-none [&_svg]:inline-block [&_svg]:shrink-0"

const trendChipLabelClass = "translate-y-px pl-1 leading-none tabular-nums text-inherit"

export function SectionTrendChip({
  trend,
  changePercent,
  className,
}: {
  trend: SectionTrend
  changePercent: number
  className?: string
}) {
  const TrendIcon = trend === "up" ? TrendingUpIcon : TrendingDownIcon
  const label = formatChangePercentLabel(changePercent)

  return (
    <span
      role="status"
      aria-label={`Change vs prior period ${label}`}
      className={cn(trendChipLayoutClass, trendChipToneClass[trend], className)}
    >
      <TrendIcon className="size-3 shrink-0" aria-hidden />
      <span className={trendChipLabelClass}>{label}</span>
    </span>
  )
}
