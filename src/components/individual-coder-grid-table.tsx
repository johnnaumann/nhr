"use client"

import type { ColumnDef } from "@tanstack/react-table"

import type { IndividualCoderGridRow } from "@/lib/individual-coder-table-data"
import { cn } from "@/lib/utils"

/** Label + three metrics (no actions column; use with `hideActionsColumn` on the data table). */
export const INDIVIDUAL_CODER_ACCURACY_TABLE_COLGROUP = (
  <colgroup>
    <col style={{ width: "28%" }} />
    <col style={{ width: "calc((100% - 28%) / 3)" }} />
    <col style={{ width: "calc((100% - 28%) / 3)" }} />
    <col style={{ width: "calc((100% - 28%) / 3)" }} />
  </colgroup>
)

export const INDIVIDUAL_CODER_TABLE_CLASS = "table-fixed"

/** Four metric columns + actions; widths fill the table so overview blocks span the full content width. */
export const INDIVIDUAL_CODER_OVERVIEW_TABLE_COLGROUP = (
  <colgroup>
    <col style={{ width: "calc((100% - 2.75rem) / 4)" }} />
    <col style={{ width: "calc((100% - 2.75rem) / 4)" }} />
    <col style={{ width: "calc((100% - 2.75rem) / 4)" }} />
    <col style={{ width: "calc((100% - 2.75rem) / 4)" }} />
    <col style={{ width: "2.75rem" }} />
  </colgroup>
)

/** Individual coder overview summary tables: full-width fixed layout aligned with {@link INDIVIDUAL_CODER_OVERVIEW_TABLE_COLGROUP}. */
export const INDIVIDUAL_CODER_OVERVIEW_TABLE_CLASS = cn(
  INDIVIDUAL_CODER_TABLE_CLASS,
  "w-full [&_th:first-child]:pl-1.5 [&_td:first-child]:pl-1.5",
)

function metricHead(label: string) {
  return () => (
    <div className="w-full text-right text-sm font-medium leading-none">
      {label}
    </div>
  )
}

function MetricCell({ value }: { value: unknown }) {
  return (
    <div className="text-right text-sm tabular-nums leading-none sm:text-base">
      {String(value ?? "")}
    </div>
  )
}

function BlankLabelHeader() {
  return (
    <span className="block min-w-[2.5rem]" aria-hidden>
      {"\u00a0"}
    </span>
  )
}

/**
 * Label (optional blank header) + three right-aligned metric slots (`s1`–`s3`).
 * Use with `INDIVIDUAL_CODER_ACCURACY_TABLE_COLGROUP` (coder accuracy snapshot table).
 */
export function buildIndividualCoderGridColumns(options: {
  emptyLabelHeader: boolean
  h1: string
  h2: string
  h3: string
}): ColumnDef<IndividualCoderGridRow>[] {
  const { emptyLabelHeader, h1, h2, h3 } = options
  const headers = [h1, h2, h3] as const
  const keys = ["s1", "s2", "s3"] as const

  return [
    {
      id: "label",
      accessorKey: "label",
      header: emptyLabelHeader
        ? () => <BlankLabelHeader />
        : "Type",
      cell: ({ row }) => {
        const v = row.original.label
        if (!v) {
          return (
            <span className="block text-muted-foreground" aria-hidden>
              {"\u00a0"}
            </span>
          )
        }
        return <span className="font-medium">{v}</span>
      },
      enableHiding: false,
    },
    ...keys.map((key, i) => ({
      id: headers[i]!,
      accessorKey: key,
      header: metricHead(headers[i]!),
      cell: ({ getValue }: { getValue: () => unknown }) => (
        <MetricCell value={getValue()} />
      ),
    })),
  ]
}

/**
 * Four right-aligned metric columns only (no label column), for individual coder overview
 * summary tables that match the design mock.
 */
export function buildIndividualCoderOverviewMetricColumns(options: {
  h1: string
  h2: string
  h3: string
  h4: string
  /** 1-based indices among the four metrics (e.g. 3 and 4 for currency emphasis). */
  dangerMetricIndices?: number[]
}): ColumnDef<IndividualCoderGridRow>[] {
  const { h1, h2, h3, h4, dangerMetricIndices = [] } = options
  const headers = [h1, h2, h3, h4] as const
  const keys = ["s1", "s2", "s3", "s4"] as const
  const danger = new Set(dangerMetricIndices)

  return keys.map((key, i) => ({
    id: headers[i]!,
    accessorKey: key,
    header: metricHead(headers[i]!),
    cell: ({ getValue }: { getValue: () => unknown }) => {
      const value = getValue()
      const emphasize = danger.has(i + 1)
      return (
        <div
          className={cn(
            "text-right text-sm tabular-nums leading-none sm:text-base",
            emphasize && "font-medium text-destructive",
          )}
        >
          {String(value ?? "")}
        </div>
      )
    },
  }))
}
