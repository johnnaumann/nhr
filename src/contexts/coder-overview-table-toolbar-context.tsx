"use client"

import * as React from "react"
import type { Table } from "@tanstack/react-table"

export type CoderOverviewToolbarTable = Table<unknown>

type CoderOverviewTableToolbarContextValue = {
  table: CoderOverviewToolbarTable | null
  setTable: (table: CoderOverviewToolbarTable | null) => void
}

const CoderOverviewTableToolbarContext =
  React.createContext<CoderOverviewTableToolbarContextValue | null>(null)

export function CoderOverviewTableToolbarProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const [table, setTable] = React.useState<CoderOverviewToolbarTable | null>(
    null,
  )

  const value = React.useMemo(
    () => ({ table, setTable }),
    [table],
  )

  return (
    <CoderOverviewTableToolbarContext.Provider value={value}>
      {children}
    </CoderOverviewTableToolbarContext.Provider>
  )
}

/** `null` when not under {@link CoderOverviewTableToolbarProvider}. */
export function useCoderOverviewTableToolbar() {
  return React.useContext(CoderOverviewTableToolbarContext)
}
