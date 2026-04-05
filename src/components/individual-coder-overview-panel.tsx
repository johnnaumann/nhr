"use client"

import { CoderOverviewDataTable } from "@/components/coder-overview-data-table"
import {
  buildIndividualCoderOverviewMetricColumns,
  INDIVIDUAL_CODER_OVERVIEW_TABLE_CLASS,
} from "@/components/individual-coder-grid-table"
import { dashboardMainGutterClass } from "@/lib/dashboard-layout"
import {
  INDIVIDUAL_CODER_GRID_BLOCK_COMPLIANCE,
  INDIVIDUAL_CODER_GRID_BLOCK_DRG,
  INDIVIDUAL_CODER_GRID_BLOCK_MISSED,
  INDIVIDUAL_CODER_GRID_BLOCK_QUALITY,
  INDIVIDUAL_CODER_OVERVIEW_BLOCK_IDS,
} from "@/lib/individual-coder-table-data"
import { cn } from "@/lib/utils"

const gridTableProps = {
  tableClassName: INDIVIDUAL_CODER_OVERVIEW_TABLE_CLASS,
  tableFrameClassName: "w-fit max-w-full",
} as const

export type IndividualCoderOverviewPanelProps = {
  coderLabel: string
  chartsReviewed: number
  className?: string
}

export function IndividualCoderOverviewPanel({
  coderLabel,
  chartsReviewed,
  className,
}: IndividualCoderOverviewPanelProps) {
  return (
    <section
      className={cn(dashboardMainGutterClass, "flex flex-col gap-4", className)}
      aria-labelledby="individual-coder-overview-heading"
    >
      <div className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between sm:gap-4">
        <h2
          id="individual-coder-overview-heading"
          className="font-heading text-lg font-semibold tracking-tight"
        >
          Coder overview
        </h2>
        <p className="text-sm text-muted-foreground">
          {coderLabel} · based on{" "}
          <span className="font-medium text-foreground tabular-nums">
            {chartsReviewed.toLocaleString("en-US")}
          </span>{" "}
          charts reviewed
        </p>
      </div>

      <div className="flex flex-col gap-4 md:gap-5">
        <CoderOverviewDataTable
          sectionId={INDIVIDUAL_CODER_OVERVIEW_BLOCK_IDS.drg}
          initialData={INDIVIDUAL_CODER_GRID_BLOCK_DRG}
          title="Charts Changed"
          titleAs="h3"
          dataColumns={buildIndividualCoderOverviewMetricColumns({
            h1: "Change Rate",
            h2: "DRG Changes",
            h3: "Quality Changes",
            h4: "Recovered DRG",
          })}
          defaultPageSize={10}
          hideColumnsAndExport
          hideFooter
          hideSelectColumn
          hideDragColumn
          {...gridTableProps}
        />

        <CoderOverviewDataTable
          sectionId={INDIVIDUAL_CODER_OVERVIEW_BLOCK_IDS.missed}
          initialData={INDIVIDUAL_CODER_GRID_BLOCK_MISSED}
          title="Missed Revenue Opportunities"
          titleAs="h3"
          dataColumns={buildIndividualCoderOverviewMetricColumns({
            h1: "Change Rate",
            h2: "Up Changes",
            h3: "Avg missed $ increase",
            h4: "Total Missed Revenue",
            dangerMetricIndices: [3, 4],
          })}
          defaultPageSize={10}
          hideColumnsAndExport
          hideFooter
          hideSelectColumn
          hideDragColumn
          {...gridTableProps}
        />

        <CoderOverviewDataTable
          sectionId={INDIVIDUAL_CODER_OVERVIEW_BLOCK_IDS.compliance}
          initialData={INDIVIDUAL_CODER_GRID_BLOCK_COMPLIANCE}
          title="Compliance"
          titleAs="h3"
          dataColumns={buildIndividualCoderOverviewMetricColumns({
            h1: "Change Rate",
            h2: "Compliance Changes",
            h3: "Avg compliance Risk Prevented",
            h4: "Total Compliance Risk Prevented",
          })}
          defaultPageSize={10}
          hideColumnsAndExport
          hideFooter
          hideSelectColumn
          hideDragColumn
          {...gridTableProps}
        />

        <CoderOverviewDataTable
          sectionId={INDIVIDUAL_CODER_OVERVIEW_BLOCK_IDS.quality}
          initialData={INDIVIDUAL_CODER_GRID_BLOCK_QUALITY}
          title="Quality"
          titleAs="h3"
          dataColumns={buildIndividualCoderOverviewMetricColumns({
            h1: "Change Rate",
            h2: "PDX",
            h3: "Secondary Diagnosis",
            h4: "Secondary Procedures",
          })}
          defaultPageSize={10}
          hideColumnsAndExport
          hideFooter
          hideSelectColumn
          hideDragColumn
          {...gridTableProps}
        />
      </div>
    </section>
  )
}
