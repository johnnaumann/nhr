"use client"

import * as React from "react"

import { ChangeDetailDrawerControlled } from "@/components/change-detail-drawer"
import type { DocumentChange } from "@/lib/document-change-schema"

export type LegendDetailPayload = {
  key: string
  label: string
  count: number
}

const DashboardLegendDetailContext = React.createContext<
  ((payload: LegendDetailPayload) => void) | null
>(null)

function hashKey(key: string): number {
  let h = 0
  for (let i = 0; i < key.length; i++) {
    h = Math.imul(31, h) + key.charCodeAt(i)
  }
  return Math.abs(h)
}

function buildDetailFromLegend(
  rows: DocumentChange[],
  payload: LegendDetailPayload
): DocumentChange {
  if (rows.length === 0) {
    return {
      id: 0,
      header: `${payload.label} — ${payload.count.toLocaleString()} changes (reporting period)`,
      type: "Summary",
      status: "In Process",
      target: "18",
      limit: "24",
      reviewer: "Reviewer 1",
    }
  }
  const idx = hashKey(payload.key) % rows.length
  const row = rows[idx]!
  return {
    ...row,
    header: `${payload.label} — ${payload.count.toLocaleString()} changes (reporting period)`,
  }
}

export function DashboardLegendDetailProvider({
  children,
  tableRows,
}: {
  children: React.ReactNode
  tableRows: DocumentChange[]
}) {
  const [detail, setDetail] = React.useState<DocumentChange | null>(null)

  const openFromLegend = React.useCallback(
    (payload: LegendDetailPayload) => {
      setDetail(buildDetailFromLegend(tableRows, payload))
    },
    [tableRows]
  )

  return (
    <DashboardLegendDetailContext.Provider value={openFromLegend}>
      {children}
      <ChangeDetailDrawerControlled
        item={detail}
        open={detail !== null}
        onOpenChange={(open) => {
          if (!open) setDetail(null)
        }}
      />
    </DashboardLegendDetailContext.Provider>
  )
}

export function useDashboardLegendDetailOpener() {
  return React.useContext(DashboardLegendDetailContext)
}
