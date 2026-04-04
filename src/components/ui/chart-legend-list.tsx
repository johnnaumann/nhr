import { ArrowDownUpIcon } from "lucide-react"

import { LegendItemCountPill } from "@/components/chart-legend-count-pill"
import { Button } from "@/components/ui/button"
import { RadioGroupItemMulti } from "@/components/ui/radio-group"
import { useDashboardLegendDetailOpener } from "@/components/dashboard-legend-detail-provider"
import { legendPanelClass } from "@/lib/chart-layout"
import { cn } from "@/lib/utils"

export interface LegendItem {
  key: string
  label: string
  count: number
  color: string
}

interface ChartLegendListProps {
  title: string
  /** Pre-sorted items to display. */
  items: LegendItem[]
  visibleKeys: string[]
  onToggle: (key: string, checked: boolean) => void
  sortDesc?: boolean
  onToggleSort?: () => void
  /** Prefix for checkbox id attributes (e.g. "impact-chart-filter"). */
  idPrefix: string
  ariaLabel: string
  labelClassName?: string
  className?: string
}

export function ChartLegendList({
  title,
  items,
  visibleKeys,
  onToggle,
  sortDesc,
  onToggleSort,
  idPrefix,
  ariaLabel,
  labelClassName,
  className,
}: ChartLegendListProps) {
  const openLegendDetail = useDashboardLegendDetailOpener()

  return (
    <div className={cn(legendPanelClass, "w-full", className)}>
      <div className="flex items-start justify-between gap-2">
        <p className="text-sm text-muted-foreground">{title}</p>
        {onToggleSort != null && (
          <Button
            type="button"
            variant="ghost"
            size="icon-xs"
            className="shrink-0 text-muted-foreground"
            aria-label={
              sortDesc
                ? "Sort ascending by count"
                : "Sort descending by count"
            }
            onClick={onToggleSort}
          >
            <ArrowDownUpIcon className="size-3.5" />
          </Button>
        )}
      </div>
      <ul className="flex flex-col gap-3" aria-label={ariaLabel}>
        {items.map(({ key, label, count, color }) => {
          const filterId = `${idPrefix}-${key}`
          const isOn = visibleKeys.includes(key)
          return (
            <li
              key={key}
              className={cn(
                "flex min-w-0 items-center gap-2.5 text-sm transition-opacity",
                !isOn && "opacity-40"
              )}
            >
              <RadioGroupItemMulti
                id={filterId}
                checked={isOn}
                indicatorColor={color}
                className="self-center"
                onCheckedChange={(on) => onToggle(key, !!on)}
              />
              <label
                htmlFor={filterId}
                className={cn(
                  "flex min-h-4 min-w-0 flex-1 cursor-pointer items-center font-normal leading-none text-foreground",
                  labelClassName
                )}
              >
                <span className="min-w-0 truncate">{label}</span>
              </label>
              {openLegendDetail ? (
                <LegendItemCountPill
                  count={count}
                  itemLabel={label}
                  onClick={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    openLegendDetail({ key, label, count })
                  }}
                />
              ) : (
                <LegendItemCountPill count={count} itemLabel={label} />
              )}
            </li>
          )
        })}
      </ul>
    </div>
  )
}
