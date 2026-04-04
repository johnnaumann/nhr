import { chartPlotHeightClass, chartPlotTallHeightClass } from "@/lib/chart-layout"
import { cn } from "@/lib/utils"

/**
 * Consistent empty-state placeholder used inside chart panels.
 *
 * - `"chart"` (default): same flex + min-height as `chartPlotHeightClass`
 * - `"chart-tall"`: same flex + min-height as `chartPlotTallHeightClass`
 * - `"pie"`: fills parent height (no min-height)
 */
export function ChartEmptyState({
  children,
  variant = "chart",
  className,
}: {
  children: React.ReactNode
  variant?: "chart" | "chart-tall" | "pie"
  className?: string
}) {
  return (
    <div
      className={cn(
        "flex items-center justify-center px-2 text-center text-sm text-muted-foreground",
        variant === "chart" && chartPlotHeightClass,
        variant === "chart-tall" && chartPlotTallHeightClass,
        variant === "pie" && "h-full w-full",
        className
      )}
    >
      {children}
    </div>
  )
}
