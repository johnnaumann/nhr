"use client"

import { CoderOverviewDataTable } from "@/components/coder-overview-data-table"
import {
  buildIndividualCoderGridColumns,
  INDIVIDUAL_CODER_TABLE_CLASS,
  INDIVIDUAL_CODER_TABLE_COLGROUP,
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

const EM = "—"

const gridTableProps = {
  tableClassName: INDIVIDUAL_CODER_TABLE_CLASS,
  tableColGroup: INDIVIDUAL_CODER_TABLE_COLGROUP,
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
          dataColumns={buildIndividualCoderGridColumns({
            emptyLabelHeader: true,
            h1: "Charts changed",
            h2: "Change rate",
            h3: "DRG changes",
            h4: "Quality changes",
            h5: "Recovered DRG",
          })}
          defaultPageSize={10}
          hideColumnsAndExport
          hideFooter
          hideSelectColumn
          {...gridTableProps}
        />

        <div className="flex flex-col gap-2">
          <h3 className="font-heading text-base font-semibold tracking-tight text-foreground">
            Missed revenue opportunities
          </h3>
          <CoderOverviewDataTable
            sectionId={INDIVIDUAL_CODER_OVERVIEW_BLOCK_IDS.missed}
            initialData={INDIVIDUAL_CODER_GRID_BLOCK_MISSED}
            dataColumns={buildIndividualCoderGridColumns({
              emptyLabelHeader: true,
              h1: "Change rate",
              h2: "Up changes",
              h3: "Avg missed $ increase",
              h4: "Total missed revenue",
              h5: EM,
            })}
            defaultPageSize={10}
            hideColumnsAndExport
            hideFooter
            hideSelectColumn
            {...gridTableProps}
          />
        </div>

        <div className="flex flex-col gap-2">
          <h3 className="font-heading text-base font-semibold tracking-tight text-foreground">
            Compliance
          </h3>
          <CoderOverviewDataTable
            sectionId={INDIVIDUAL_CODER_OVERVIEW_BLOCK_IDS.compliance}
            initialData={INDIVIDUAL_CODER_GRID_BLOCK_COMPLIANCE}
            dataColumns={buildIndividualCoderGridColumns({
              emptyLabelHeader: true,
              h1: "Change rate",
              h2: "Compliance changes",
              h3: "Avg. compliance risk prevented",
              h4: "Total compliance risk prevented",
              h5: EM,
            })}
            defaultPageSize={10}
            hideColumnsAndExport
            hideFooter
            hideSelectColumn
            {...gridTableProps}
          />
        </div>

        <div className="flex flex-col gap-2">
          <h3 className="font-heading text-base font-semibold tracking-tight text-foreground">
            Quality
          </h3>
          <CoderOverviewDataTable
            sectionId={INDIVIDUAL_CODER_OVERVIEW_BLOCK_IDS.quality}
            initialData={INDIVIDUAL_CODER_GRID_BLOCK_QUALITY}
            dataColumns={buildIndividualCoderGridColumns({
              emptyLabelHeader: true,
              h1: "Change rate",
              h2: "PDX",
              h3: "Secondary diagnosis",
              h4: "Secondary procedures",
              h5: EM,
            })}
            defaultPageSize={10}
            hideColumnsAndExport
            hideFooter
            hideSelectColumn
            {...gridTableProps}
          />
        </div>
      </div>
    </section>
  )
}
