/**
 * Reusable value display for pie / horizontal-bar tooltip formatters.
 *
 * Renders: "N <unit> (pct%)"  in the standard monospace/tabular style.
 */
export function ChartTooltipValue({
  value,
  total,
  unit = "changes",
}: {
  value: number
  total: number
  unit?: string
}) {
  const pct = total > 0 ? ((value / total) * 100).toFixed(1) : "0.0"
  return (
    <span className="inline-flex items-baseline gap-x-1.5 text-xs leading-none">
      <span className="font-mono font-medium text-foreground tabular-nums">
        {value.toLocaleString()}
      </span>
      <span className="text-muted-foreground">{unit}</span>
      <span className="font-mono text-muted-foreground tabular-nums">
        ({pct}%)
      </span>
    </span>
  )
}
