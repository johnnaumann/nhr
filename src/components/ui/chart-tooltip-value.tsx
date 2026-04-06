/**
 * Reusable value display for pie / horizontal-bar tooltip formatters.
 *
 * Renders: "N <unit> (pct%)". Uses horizontal margins between segments so spacing
 * survives Recharts tooltip rendering (whitespace and flex `gap` are unreliable there).
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
    <span className="inline-block max-w-full whitespace-normal text-xs leading-normal">
      <span className="font-mono font-medium text-foreground tabular-nums">
        {value.toLocaleString()}
      </span>
      <span className="mx-[0.2em] inline text-muted-foreground">{unit}</span>
      <span className="font-mono text-muted-foreground tabular-nums">
        ({pct}%)
      </span>
    </span>
  )
}
