"use client"

import * as React from "react"

import type { CoderTrendCohortKey } from "@/lib/coder-trends-data"

type CoderTrendsDimensionContextValue = {
  activeFilter: CoderTrendCohortKey
  setActiveFilter: (key: CoderTrendCohortKey) => void
}

const CoderTrendsDimensionContext =
  React.createContext<CoderTrendsDimensionContextValue | null>(null)

export function CoderTrendsDimensionProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const [activeFilter, setActiveFilter] =
    React.useState<CoderTrendCohortKey>("top-performers")

  const value = React.useMemo(
    () => ({ activeFilter, setActiveFilter }),
    [activeFilter],
  )

  return (
    <CoderTrendsDimensionContext.Provider value={value}>
      {children}
    </CoderTrendsDimensionContext.Provider>
  )
}

export function useCoderTrendsDimension() {
  const ctx = React.useContext(CoderTrendsDimensionContext)
  if (!ctx) {
    throw new Error(
      "useCoderTrendsDimension must be used within CoderTrendsDimensionProvider",
    )
  }
  return ctx
}
