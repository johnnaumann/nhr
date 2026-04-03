import { cn } from "@/lib/utils"

/**
 * Consistent empty-state placeholder used inside chart panels.
 *
 * - `"chart"` (default): standard min-height 240/280px, fills flex parent
 * - `"chart-tall"`: taller 240/320px for charts with many categories
 * - `"pie"`:  fills parent height (no min-height)
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
        variant === "chart" &&
          "min-h-[240px] w-full flex-1 md:min-h-[280px]",
        variant === "chart-tall" &&
          "min-h-[240px] flex-1 md:min-h-[320px]",
        variant === "pie" && "h-full w-full",
        className
      )}
    >
      {children}
    </div>
  )
}
