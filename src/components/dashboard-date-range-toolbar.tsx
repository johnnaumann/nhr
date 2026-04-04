"use client"

import type { ReactNode } from "react"

import { DashboardInstitutionToggle } from "@/components/dashboard-institution-toggle"
import { DateRangePicker } from "@/components/date-range-picker"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { useDashboardDateRange } from "@/contexts/dashboard-date-range-context"
import { cn } from "@/lib/utils"

const DEFAULT_TITLE = "Reporting period & sites"

const DEFAULT_DESCRIPTION =
  "The date range and site toggles to the right apply everywhere sites appear—worksheets over time, site impact stacks, and related totals."

type DashboardDateRangeToolbarProps = {
  /** Overrides the lead title (plain text; use for route-specific labeling). */
  title?: string
  /** Overrides the helper line under the title. */
  description?: string
  /** Renders below the main row inside the same sticky bar (e.g. in-page section links). */
  extension?: ReactNode
}

export function DashboardDateRangeToolbar({
  title = DEFAULT_TITLE,
  description = DEFAULT_DESCRIPTION,
  extension,
}: DashboardDateRangeToolbarProps = {}) {
  const { range, setRange, referenceDate } = useDashboardDateRange()

  return (
    <div
      className="sticky top-(--header-height) z-30 border-b border-border/60 bg-background/95 py-4 backdrop-blur-sm supports-[backdrop-filter]:bg-background/80"
      data-slot="dashboard-date-range-sticky"
    >
      <div className="flex flex-col gap-4 px-4 lg:px-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
          <div className="flex min-w-0 items-center gap-1.5">
            <p className="text-sm font-medium text-foreground">{title}</p>
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  type="button"
                  className={cn(
                    "inline-flex size-5 shrink-0 items-center justify-center rounded-full border border-muted-foreground/35 text-muted-foreground",
                    "transition-colors hover:border-muted-foreground/55 hover:text-foreground",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                  )}
                  aria-label={`About ${title}`}
                >
                  <span className="sr-only">About {title}</span>
                  <span
                    className="text-[10px] font-semibold leading-none"
                    aria-hidden
                  >
                    ?
                  </span>
                </button>
              </TooltipTrigger>
              <TooltipContent
                side="bottom"
                align="start"
                sideOffset={6}
                className="max-w-sm text-left leading-relaxed"
              >
                {description}
              </TooltipContent>
            </Tooltip>
          </div>
          <div className="flex w-full min-w-0 flex-col gap-3 sm:w-auto sm:max-w-none sm:flex-row sm:items-center sm:justify-end sm:gap-4">
            <DateRangePicker
              value={range}
              onValueChange={setRange}
              referenceDate={referenceDate}
              align="end"
              placeholder="Date range"
              className="w-full shrink-0 sm:w-auto sm:max-w-[min(100%,320px)]"
            />
            <DashboardInstitutionToggle />
          </div>
        </div>
        {extension ? (
          <div className="border-t border-border/60 pt-4">{extension}</div>
        ) : null}
      </div>
    </div>
  )
}
