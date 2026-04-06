"use client"

import type { ColumnDef } from "@tanstack/react-table"

import type { IndividualCoderGridRow } from "@/lib/individual-coder-table-data"
import { cn } from "@/lib/utils"

/** Label + three metrics (no actions column; use with `hideActionsColumn` on the data table). */
const ACCURACY_LABEL_COL_PCT = 38

export const INDIVIDUAL_CODER_ACCURACY_TABLE_COLGROUP = (
  <colgroup>
    <col style={{ width: `${ACCURACY_LABEL_COL_PCT}%` }} />
    <col
      style={{
        width: `calc((100% - ${ACCURACY_LABEL_COL_PCT}%) / 3)`,
      }}
    />
    <col
      style={{
        width: `calc((100% - ${ACCURACY_LABEL_COL_PCT}%) / 3)`,
      }}
    />
    <col
      style={{
        width: `calc((100% - ${ACCURACY_LABEL_COL_PCT}%) / 3)`,
      }}
    />
  </colgroup>
)

export const INDIVIDUAL_CODER_TABLE_CLASS = "table-fixed"

/** Section title column + four metric columns + actions; full-width fixed layout. */
export const INDIVIDUAL_CODER_OVERVIEW_TABLE_COLGROUP = (
  <colgroup>
    <col style={{ width: "24%" }} />
    <col style={{ width: "calc((100% - 24% - 2.75rem) / 4)" }} />
    <col style={{ width: "calc((100% - 24% - 2.75rem) / 4)" }} />
    <col style={{ width: "calc((100% - 24% - 2.75rem) / 4)" }} />
    <col style={{ width: "calc((100% - 24% - 2.75rem) / 4)" }} />
    <col style={{ width: "2.75rem" }} />
  </colgroup>
)

/** Individual coder overview summary tables: full-width fixed layout aligned with {@link INDIVIDUAL_CODER_OVERVIEW_TABLE_COLGROUP}. */
export const INDIVIDUAL_CODER_OVERVIEW_TABLE_CLASS = cn(
  INDIVIDUAL_CODER_TABLE_CLASS,
  "w-full [&_th:first-child]:pl-1.5 [&_td:first-child]:pl-1.5 [&_th:first-child]:align-top",
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
  /** First column header when `emptyLabelHeader` is false (default "Type"). */
  labelHeader?: string
  h1: string
  h2: string
  h3: string
}): ColumnDef<IndividualCoderGridRow>[] {
  const { emptyLabelHeader, labelHeader = "Type", h1, h2, h3 } = options
  const headers = [h1, h2, h3] as const
  const keys = ["s1", "s2", "s3"] as const

  return [
    {
      id: "label",
      accessorKey: "label",
      header: emptyLabelHeader
        ? () => <BlankLabelHeader />
        : labelHeader,
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

/**
 * Section title in the first header cell + four metric columns; first body cell is a
 * layout placeholder (values are in the metric columns only).
 */
export function buildIndividualCoderOverviewColumns(options: {
  sectionTitle: string
  h1: string
  h2: string
  h3: string
  h4: string
  dangerMetricIndices?: number[]
}): ColumnDef<IndividualCoderGridRow>[] {
  const { sectionTitle, ...metricOptions } = options
  return [
    {
      id: "section",
      accessorKey: "label",
      header: () => (
        <span className="block max-w-[16rem] text-left text-sm font-semibold leading-snug text-foreground sm:text-base">
          {sectionTitle}
        </span>
      ),
      cell: () => (
        <span className="block text-muted-foreground" aria-hidden>
          {"\u00a0"}
        </span>
      ),
      enableHiding: false,
    },
    ...buildIndividualCoderOverviewMetricColumns(metricOptions),
  ]
}
