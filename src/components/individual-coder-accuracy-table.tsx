"use client"

import * as React from "react"

import { CoderOverviewDataTable } from "@/components/coder-overview-data-table"
import {
  buildIndividualCoderGridColumns,
  INDIVIDUAL_CODER_ACCURACY_TABLE_COLGROUP,
  INDIVIDUAL_CODER_TABLE_CLASS,
} from "@/components/individual-coder-grid-table"
import { dashboardMainGutterClass } from "@/lib/dashboard-layout"
import {
  accuracyRowsToGrid,
  INDIVIDUAL_CODER_ACCURACY_ROWS,
} from "@/lib/individual-coder-table-data"
import { cn } from "@/lib/utils"

export const INDIVIDUAL_CODER_ACCURACY_SECTION_ID =
  "individual-coder-accuracy-table"

const gridTableProps = {
  tableClassName: INDIVIDUAL_CODER_TABLE_CLASS,
  tableColGroup: INDIVIDUAL_CODER_ACCURACY_TABLE_COLGROUP,
} as const

export function IndividualCoderAccuracyTable({
  className,
}: {
  className?: string
}) {
  const gridRows = React.useMemo(
    () => accuracyRowsToGrid(INDIVIDUAL_CODER_ACCURACY_ROWS),
    [],
  )

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
        initialData={gridRows}
        dataColumns={buildIndividualCoderGridColumns({
          emptyLabelHeader: false,
          labelHeader: "Accuracy category",
          h1: "Total assignments",
          h2: "Total changes",
          h3: "Percent accuracy",
        })}
        defaultPageSize={20}
        hideColumnsAndExport
        hideFooter
        hideSelectColumn
        hideDragColumn
        hideActionsColumn
        {...gridTableProps}
      />
    </section>
  )
}
