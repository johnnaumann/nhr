"use client"

import * as React from "react"
import { endOfDay, startOfDay, subDays } from "date-fns"
import type { DateRange } from "react-day-picker"

/** Last day with demo dashboard data (visitor series). */
export const DASHBOARD_DATA_REFERENCE = new Date(2024, 5, 30)

export function createInitialDashboardDateRange(): DateRange | undefined {
  return {
    from: startOfDay(subDays(DASHBOARD_DATA_REFERENCE, 90)),
    to: endOfDay(DASHBOARD_DATA_REFERENCE),
  }
}

type DashboardDateRangeContextValue = {
  range: DateRange | undefined
  setRange: React.Dispatch<React.SetStateAction<DateRange | undefined>>
  referenceDate: Date
}

const DashboardDateRangeContext =
  React.createContext<DashboardDateRangeContextValue | null>(null)

export function DashboardDateRangeProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const [range, setRange] = React.useState<DateRange | undefined>(
    createInitialDashboardDateRange
  )

  const value = React.useMemo(
    (): DashboardDateRangeContextValue => ({
      range,
      setRange,
      referenceDate: DASHBOARD_DATA_REFERENCE,
    }),
    [range]
  )

  return (
    <DashboardDateRangeContext.Provider value={value}>
      {children}
    </DashboardDateRangeContext.Provider>
  )
}

export function useDashboardDateRange() {
  const ctx = React.useContext(DashboardDateRangeContext)
  if (!ctx) {
    throw new Error(
      "useDashboardDateRange must be used within DashboardDateRangeProvider"
    )
  }
  return ctx
}
