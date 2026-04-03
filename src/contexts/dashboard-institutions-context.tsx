"use client"

import * as React from "react"

import {
  INSTITUTION_SERIES_KEYS,
  type InstitutionSeriesKey,
} from "@/lib/dashboard-institutions"

type DashboardInstitutionsContextValue = {
  visibleInstitutionKeys: InstitutionSeriesKey[]
  setVisibleInstitutionKeys: (keys: string[]) => void
}

const DashboardInstitutionsContext =
  React.createContext<DashboardInstitutionsContextValue | null>(null)

export function DashboardInstitutionsProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const [visibleInstitutionKeys, setVisibleInstitutionKeysRaw] =
    React.useState<InstitutionSeriesKey[]>(() => [...INSTITUTION_SERIES_KEYS])

  const setVisibleInstitutionKeys = React.useCallback((next: string[]) => {
    const allowed = new Set<string>(INSTITUTION_SERIES_KEYS)
    const cleaned = next.filter((k): k is InstitutionSeriesKey =>
      allowed.has(k)
    )
    if (cleaned.length === 0) return
    setVisibleInstitutionKeysRaw(cleaned)
  }, [])

  const value = React.useMemo(
    (): DashboardInstitutionsContextValue => ({
      visibleInstitutionKeys,
      setVisibleInstitutionKeys,
    }),
    [visibleInstitutionKeys, setVisibleInstitutionKeys]
  )

  return (
    <DashboardInstitutionsContext.Provider value={value}>
      {children}
    </DashboardInstitutionsContext.Provider>
  )
}

export function useDashboardInstitutions() {
  const ctx = React.useContext(DashboardInstitutionsContext)
  if (!ctx) {
    throw new Error(
      "useDashboardInstitutions must be used within DashboardInstitutionsProvider"
    )
  }
  return ctx
}
