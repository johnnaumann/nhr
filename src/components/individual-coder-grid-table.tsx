"use client"

import type { ColumnDef } from "@tanstack/react-table"

import type { IndividualCoderGridRow } from "@/lib/individual-coder-table-data"

/** Aligns drag + label + five metrics + actions across individual coder tables. */
export const INDIVIDUAL_CODER_TABLE_COLGROUP = (
  <colgroup>
    <col style={{ width: "2.25rem" }} />
    <col style={{ width: "13%" }} />
    <col style={{ width: "16.75%" }} />
    <col style={{ width: "16.75%" }} />
    <col style={{ width: "16.75%" }} />
    <col style={{ width: "16.75%" }} />
    <col style={{ width: "16.75%" }} />
    <col style={{ width: "2.75rem" }} />
  </colgroup>
)

export const INDIVIDUAL_CODER_TABLE_CLASS = "table-fixed"

function metricHead(label: string) {
  return () => (
    <div className="w-full text-right text-sm font-medium leading-tight">
      {label}
    </div>
  )
}

function MetricCell({ value }: { value: unknown }) {
  return (
    <div className="text-right text-sm tabular-nums sm:text-base">
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
 * Six data columns: label (optional blank) + five right-aligned metric slots.
 * Matches {@link INDIVIDUAL_CODER_TABLE_COLGROUP} column count with drag/actions.
 */
export function buildIndividualCoderGridColumns(
  options: {
    emptyLabelHeader: boolean
    h1: string
    h2: string
    h3: string
    h4: string
    h5: string
  },
): ColumnDef<IndividualCoderGridRow>[] {
  const { emptyLabelHeader, h1, h2, h3, h4, h5 } = options
  const headers = [h1, h2, h3, h4, h5] as const
  const keys = ["s1", "s2", "s3", "s4", "s5"] as const

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
