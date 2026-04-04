"use client"

import type { ReactNode } from "react"

import { DashboardInstitutionToggle } from "@/components/dashboard-institution-toggle"
import { DateRangePicker } from "@/components/date-range-picker"
import { useDashboardDateRange } from "@/contexts/dashboard-date-range-context"
import { dashboardMainGutterClass } from "@/lib/dashboard-layout"
import { cn } from "@/lib/utils"

type DashboardDateRangeToolbarProps = {
  /** Left side of the bar (e.g. dimension or cohort jump links). Date and sites stay on the right. */
  extension?: ReactNode
}

export function DashboardDateRangeToolbar({
  extension,
}: DashboardDateRangeToolbarProps = {}) {
  const { range, setRange, referenceDate } = useDashboardDateRange()

  return (
    <div
      className="sticky top-(--header-height) z-30 border-b border-border/60 bg-background/95 py-4 backdrop-blur-sm supports-[backdrop-filter]:bg-background/80"
      data-slot="dashboard-date-range-sticky"
    >
      <div className={dashboardMainGutterClass}>
        <div
          className={cn(
            "flex w-full min-w-0 flex-col gap-3 sm:flex-row sm:items-center sm:gap-4",
            extension ? "sm:justify-between" : "sm:justify-end",
          )}
        >
          {extension ? (
            <div className="min-w-0 flex-1">{extension}</div>
          ) : null}
          <div className="flex w-full min-w-0 shrink-0 flex-col gap-3 sm:w-auto sm:flex-row sm:items-center sm:justify-end sm:gap-4">
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
      </div>
    </div>
  )
}
