"use client"

import * as React from "react"
import { endOfDay, startOfDay, subDays } from "date-fns"
import type { DateRange } from "react-day-picker"

/** Legacy anchor for docs or future real data cutoffs (charts use range-native demo data). */
export const DASHBOARD_DATA_REFERENCE = new Date(2024, 5, 30)

/** Inclusive calendar days in the default reporting period (today is the end). */
const DASHBOARD_INITIAL_RANGE_DAYS = 7

export function createInitialDashboardDateRange(): DateRange | undefined {
  const today = new Date()
  return {
    from: startOfDay(subDays(today, DASHBOARD_INITIAL_RANGE_DAYS - 1)),
    to: endOfDay(today),
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

  const value = React.useMemo((): DashboardDateRangeContextValue => {
    const referenceDate = startOfDay(new Date())
    return {
      range,
      setRange,
      referenceDate,
    }
  }, [range])

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
