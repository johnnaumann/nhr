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
  /** Rendered between date range and sites in the right cluster. */
  trailing?: ReactNode
  /** When false, site multi-select is hidden (e.g. individual coder page). */
  showInstitutionToggle?: boolean
}

export function DashboardDateRangeToolbar({
  extension,
  trailing,
  showInstitutionToggle = true,
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
            <div className="flex min-h-8 min-w-0 flex-1 flex-wrap items-center">
              {extension}
            </div>
          ) : null}
          <div className="flex w-full min-w-0 shrink-0 flex-col gap-3 sm:min-h-8 sm:w-auto sm:flex-row sm:items-center sm:justify-end sm:gap-3">
            <DateRangePicker
              value={range}
              onValueChange={setRange}
              referenceDate={referenceDate}
              align="end"
              placeholder="Date range"
              className="w-full shrink-0 sm:w-auto sm:max-w-[min(100%,320px)]"
            />
            {trailing ? (
              <div className="flex h-8 shrink-0 items-center gap-2 sm:gap-3">
                {trailing}
              </div>
            ) : null}
            {showInstitutionToggle ? <DashboardInstitutionToggle /> : null}
          </div>
        </div>
      </div>
    </div>
  )
}
