"use client"

import {
  ToggleGroup,
  ToggleGroupItem,
} from "@/components/ui/toggle-group"
import { useDashboardInstitutions } from "@/contexts/dashboard-institutions-context"
import {
  INSTITUTION_SERIES_KEYS,
  institutionChartConfig,
} from "@/lib/dashboard-institutions"
import { cn } from "@/lib/utils"

type DashboardInstitutionToggleProps = {
  className?: string
  /** Show a visible "Sites" label (e.g. in the sticky toolbar). */
  showInlineLabel?: boolean
}

export function DashboardInstitutionToggle({
  className,
  showInlineLabel,
}: DashboardInstitutionToggleProps) {
  const { visibleInstitutionKeys, setVisibleInstitutionKeys } =
    useDashboardInstitutions()

  return (
    <div
      className={cn(
        "flex min-w-0 flex-col gap-2 sm:flex-row sm:items-center sm:gap-2",
        className
      )}
    >
      {showInlineLabel ? (
        <span className="shrink-0 text-xs font-medium text-muted-foreground">
          Sites
        </span>
      ) : null}
      <ToggleGroup
        type="multiple"
        value={visibleInstitutionKeys}
        onValueChange={setVisibleInstitutionKeys}
        variant="outline"
        size="sm"
        spacing={0}
        className="w-max max-w-full flex-nowrap gap-0 overflow-x-auto [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        aria-label="Show or hide hospital sites on charts"
      >
        {INSTITUTION_SERIES_KEYS.map((key) => (
          <ToggleGroupItem
            key={key}
            value={key}
            className="shrink-0 gap-1.5 whitespace-nowrap px-2 data-[state=off]:opacity-40"
          >
            <span
              className="size-2 shrink-0 rounded-sm"
              style={{
                backgroundColor: institutionChartConfig[key].color,
              }}
              aria-hidden
            />
            <span className="truncate">
              {institutionChartConfig[key].label}
            </span>
          </ToggleGroupItem>
        ))}
      </ToggleGroup>
    </div>
  )
}
