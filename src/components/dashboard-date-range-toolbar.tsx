"use client"

import { DashboardInstitutionToggle } from "@/components/dashboard-institution-toggle"
import { DateRangePicker } from "@/components/date-range-picker"
import { useDashboardDateRange } from "@/contexts/dashboard-date-range-context"

export function DashboardDateRangeToolbar() {
  const { range, setRange, referenceDate } = useDashboardDateRange()

  return (
    <div
      className="sticky top-(--header-height) z-30 border-b border-border/60 bg-background/95 py-3 backdrop-blur-sm supports-[backdrop-filter]:bg-background/80"
      data-slot="dashboard-date-range-sticky"
    >
      <div className="flex flex-col gap-4 px-4 lg:px-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
          <div className="min-w-0 space-y-0.5">
            <p className="text-sm font-medium text-foreground">
              Reporting period &amp; sites
            </p>
            <p className="text-xs text-muted-foreground">
              The date range and site toggles to the right apply everywhere
              institutions appear—worksheets over time, site impact stacks, and
              related totals.
            </p>
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
      </div>
    </div>
  )
}
