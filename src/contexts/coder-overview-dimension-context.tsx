"use client"

import * as React from "react"

import type { CoderOverviewDimensionKey } from "@/lib/coder-overview-table-data"

type CoderOverviewDimensionContextValue = {
  activeDimension: CoderOverviewDimensionKey
  setActiveDimension: (d: CoderOverviewDimensionKey) => void
}

const CoderOverviewDimensionContext =
  React.createContext<CoderOverviewDimensionContextValue | null>(null)

export function CoderOverviewDimensionProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const [activeDimension, setActiveDimension] =
    React.useState<CoderOverviewDimensionKey>("overall")

  const value = React.useMemo(
    () => ({ activeDimension, setActiveDimension }),
    [activeDimension],
  )

  return (
    <CoderOverviewDimensionContext.Provider value={value}>
      {children}
    </CoderOverviewDimensionContext.Provider>
  )
}

export function useCoderOverviewDimension() {
  const ctx = React.useContext(CoderOverviewDimensionContext)
  if (!ctx) {
    throw new Error(
      "useCoderOverviewDimension must be used within CoderOverviewDimensionProvider",
    )
  }
  return ctx
}
