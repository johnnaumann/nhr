"use client"

import type { ColumnDef } from "@tanstack/react-table"

import { CoderOverviewDataTable } from "@/components/coder-overview-data-table"
import { dashboardMainGutterClass } from "@/lib/dashboard-layout"
import {
  INDIVIDUAL_CODER_BLOCK_COMPLIANCE,
  INDIVIDUAL_CODER_BLOCK_DRG,
  INDIVIDUAL_CODER_BLOCK_MISSED,
  INDIVIDUAL_CODER_BLOCK_QUALITY,
  INDIVIDUAL_CODER_OVERVIEW_BLOCK_IDS,
  type IndividualCoderBlockComplianceRow,
  type IndividualCoderBlockDrgRow,
  type IndividualCoderBlockMissedRow,
  type IndividualCoderBlockQualityRow,
} from "@/lib/individual-coder-table-data"
import { cn } from "@/lib/utils"

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

const blockDrgColumns: ColumnDef<IndividualCoderBlockDrgRow>[] = [
  {
    id: "Charts changed",
    accessorKey: "chartsChanged",
    header: metricHead("Charts changed"),
    cell: ({ getValue }) => <MetricCell value={getValue()} />,
  },
  {
    id: "Change rate",
    accessorKey: "changeRate",
    header: metricHead("Change rate"),
    cell: ({ getValue }) => <MetricCell value={getValue()} />,
  },
  {
    id: "DRG changes",
    accessorKey: "drgChanges",
    header: metricHead("DRG changes"),
    cell: ({ getValue }) => <MetricCell value={getValue()} />,
  },
  {
    id: "Quality changes",
    accessorKey: "qualityChanges",
    header: metricHead("Quality changes"),
    cell: ({ getValue }) => <MetricCell value={getValue()} />,
  },
  {
    id: "Recovered DRG",
    accessorKey: "recoveredDrg",
    header: metricHead("Recovered DRG"),
    cell: ({ getValue }) => <MetricCell value={getValue()} />,
  },
]

const blockMissedColumns: ColumnDef<IndividualCoderBlockMissedRow>[] = [
  {
    id: "Change rate",
    accessorKey: "changeRate",
    header: metricHead("Change rate"),
    cell: ({ getValue }) => <MetricCell value={getValue()} />,
  },
  {
    id: "Up changes",
    accessorKey: "upChanges",
    header: metricHead("Up changes"),
    cell: ({ getValue }) => <MetricCell value={getValue()} />,
  },
  {
    id: "Avg missed $ increase",
    accessorKey: "avgMissedIncrease",
    header: metricHead("Avg missed $ increase"),
    cell: ({ getValue }) => <MetricCell value={getValue()} />,
  },
  {
    id: "Total missed revenue",
    accessorKey: "totalMissedRevenue",
    header: metricHead("Total missed revenue"),
    cell: ({ getValue }) => <MetricCell value={getValue()} />,
  },
]

const blockComplianceColumns: ColumnDef<IndividualCoderBlockComplianceRow>[] = [
  {
    id: "Change rate",
    accessorKey: "changeRate",
    header: metricHead("Change rate"),
    cell: ({ getValue }) => <MetricCell value={getValue()} />,
  },
  {
    id: "Compliance changes",
    accessorKey: "complianceChanges",
    header: metricHead("Compliance changes"),
    cell: ({ getValue }) => <MetricCell value={getValue()} />,
  },
  {
    id: "Avg. compliance risk prevented",
    accessorKey: "avgComplianceRiskPrevented",
    header: metricHead("Avg. compliance risk prevented"),
    cell: ({ getValue }) => <MetricCell value={getValue()} />,
  },
  {
    id: "Total compliance risk prevented",
    accessorKey: "totalComplianceRiskPrevented",
    header: metricHead("Total compliance risk prevented"),
    cell: ({ getValue }) => <MetricCell value={getValue()} />,
  },
]

const blockQualityColumns: ColumnDef<IndividualCoderBlockQualityRow>[] = [
  {
    id: "Change rate",
    accessorKey: "changeRate",
    header: metricHead("Change rate"),
    cell: ({ getValue }) => <MetricCell value={getValue()} />,
  },
  {
    id: "PDX",
    accessorKey: "pdx",
    header: metricHead("PDX"),
    cell: ({ getValue }) => <MetricCell value={getValue()} />,
  },
  {
    id: "Secondary diagnosis",
    accessorKey: "secondaryDiagnosis",
    header: metricHead("Secondary diagnosis"),
    cell: ({ getValue }) => <MetricCell value={getValue()} />,
  },
  {
    id: "Secondary procedures",
    accessorKey: "secondaryProcedures",
    header: metricHead("Secondary procedures"),
    cell: ({ getValue }) => <MetricCell value={getValue()} />,
  },
]

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
          initialData={INDIVIDUAL_CODER_BLOCK_DRG}
          dataColumns={blockDrgColumns}
          defaultPageSize={10}
          hideColumnsAndExport
          hideFooter
        />

        <div className="flex flex-col gap-2">
          <h3 className="font-heading text-base font-semibold tracking-tight text-foreground">
            Missed revenue opportunities
          </h3>
          <CoderOverviewDataTable
            sectionId={INDIVIDUAL_CODER_OVERVIEW_BLOCK_IDS.missed}
            initialData={INDIVIDUAL_CODER_BLOCK_MISSED}
            dataColumns={blockMissedColumns}
            defaultPageSize={10}
            hideColumnsAndExport
            hideFooter
          />
        </div>

        <div className="flex flex-col gap-2">
          <h3 className="font-heading text-base font-semibold tracking-tight text-foreground">
            Compliance
          </h3>
          <CoderOverviewDataTable
            sectionId={INDIVIDUAL_CODER_OVERVIEW_BLOCK_IDS.compliance}
            initialData={INDIVIDUAL_CODER_BLOCK_COMPLIANCE}
            dataColumns={blockComplianceColumns}
            defaultPageSize={10}
            hideColumnsAndExport
            hideFooter
          />
        </div>

        <div className="flex flex-col gap-2">
          <h3 className="font-heading text-base font-semibold tracking-tight text-foreground">
            Quality
          </h3>
          <CoderOverviewDataTable
            sectionId={INDIVIDUAL_CODER_OVERVIEW_BLOCK_IDS.quality}
            initialData={INDIVIDUAL_CODER_BLOCK_QUALITY}
            dataColumns={blockQualityColumns}
            defaultPageSize={10}
            hideColumnsAndExport
            hideFooter
          />
        </div>
      </div>
    </section>
  )
}
