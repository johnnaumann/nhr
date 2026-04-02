"use client"

import { DateRangePicker } from "@/components/date-range-picker"
import { useDashboardDateRange } from "@/contexts/dashboard-date-range-context"

export function DashboardDateRangeToolbar() {
  const { range, setRange, referenceDate } = useDashboardDateRange()

  return (
    <div className="flex flex-col gap-3 px-4 sm:flex-row sm:items-center sm:justify-between sm:gap-4 lg:px-6">
      <div className="min-w-0 space-y-0.5">
        <p className="text-sm font-medium text-foreground">Reporting period</p>
        <p className="text-xs text-muted-foreground">
          Metrics and charts use this date range
        </p>
      </div>
      <DateRangePicker
        value={range}
        onValueChange={setRange}
        referenceDate={referenceDate}
        align="end"
        placeholder="Date range"
        className="w-full shrink-0 sm:w-auto sm:max-w-[min(100%,320px)]"
      />
    </div>
  )
}
