"use client"

import type { ColumnDef } from "@tanstack/react-table"

import { CoderOverviewDataTable } from "@/components/coder-overview-data-table"
import { dashboardMainGutterClass } from "@/lib/dashboard-layout"
import {
  INDIVIDUAL_CODER_ACCURACY_ROWS,
  type IndividualCoderAccuracyRow,
} from "@/lib/individual-coder-table-data"
import { cn } from "@/lib/utils"

export const INDIVIDUAL_CODER_ACCURACY_SECTION_ID =
  "individual-coder-accuracy-table"

const accuracyColumns: ColumnDef<IndividualCoderAccuracyRow>[] = [
  {
    id: "Type",
    accessorKey: "type",
    header: "Type",
    cell: ({ row }) => (
      <span className="font-medium">{row.original.type}</span>
    ),
    enableHiding: false,
  },
  {
    id: "Ttl assig",
    accessorKey: "ttlAssig",
    header: () => <div className="w-full text-right">Ttl assig</div>,
    cell: ({ getValue }) => (
      <div className="text-right tabular-nums">{getValue<number>()}</div>
    ),
  },
  {
    id: "Ttl chg",
    accessorKey: "ttlChg",
    header: () => <div className="w-full text-right">Ttl chg</div>,
    cell: ({ getValue }) => (
      <div className="text-right tabular-nums">{getValue<number>()}</div>
    ),
  },
  {
    id: "% acc",
    accessorKey: "pctAcc",
    header: () => <div className="w-full text-right">% acc</div>,
    cell: ({ getValue }) => (
      <div className="text-right tabular-nums">{getValue<string>()}</div>
    ),
  },
]

export function IndividualCoderAccuracyTable({
  className,
}: {
  className?: string
}) {
  return (
    <section
      className={cn(dashboardMainGutterClass, "flex flex-col gap-3", className)}
      aria-labelledby="individual-coder-accuracy-heading"
    >
      <h2
        id="individual-coder-accuracy-heading"
        className="font-heading text-lg font-semibold tracking-tight"
      >
        Coder accuracy snapshot
      </h2>

      <CoderOverviewDataTable
        sectionId={INDIVIDUAL_CODER_ACCURACY_SECTION_ID}
        initialData={INDIVIDUAL_CODER_ACCURACY_ROWS}
        dataColumns={accuracyColumns}
        defaultPageSize={20}
        hideColumnsAndExport
        hideFooter
      />
    </section>
  )
}
