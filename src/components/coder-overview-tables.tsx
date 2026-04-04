"use client"

import type { ColumnDef } from "@tanstack/react-table"

import { CoderOverviewDataTable } from "@/components/coder-overview-data-table"
import { CODER_OVERVIEW_DIMENSIONS } from "@/components/coder-overview-dimension-nav"
import {
  CODER_COMPLIANCE_DATA,
  CODER_DRG_DATA,
  CODER_MISSED_DATA,
  CODER_OVERALL_DATA,
  CODER_QUALITY_DATA,
  type CoderOverviewComplianceRow,
  type CoderOverviewDrgRow,
  type CoderOverviewMissedRow,
  type CoderOverviewOverallRow,
  type CoderOverviewQualityRow,
} from "@/lib/coder-overview-table-data"

function rightHeader(label: string) {
  return () => <div className="w-full text-right">{label}</div>
}

const overallColumns: ColumnDef<CoderOverviewOverallRow>[] = [
  {
    id: "Coder ID",
    accessorKey: "coderId",
    header: "Coder ID",
    cell: ({ row }) => (
      <span className="font-medium">{row.original.coderId}</span>
    ),
    enableHiding: false,
  },
  {
    id: "Total Reviewed",
    accessorKey: "totalReviewed",
    header: rightHeader("Total Reviewed"),
    cell: ({ getValue }) => (
      <div className="text-right tabular-nums">{getValue<string>()}</div>
    ),
  },
  {
    id: "Change Rate",
    accessorKey: "changeRate",
    header: rightHeader("Change Rate"),
    cell: ({ getValue }) => (
      <div className="text-right tabular-nums">{getValue<string>()}</div>
    ),
  },
  {
    id: "Total Missed Revenue",
    accessorKey: "totalMissedRevenue",
    header: rightHeader("Total Missed Revenue"),
    cell: ({ getValue }) => (
      <div className="text-right tabular-nums">{getValue<string>()}</div>
    ),
  },
  {
    id: "Total Compliance Risk Prevented",
    accessorKey: "totalComplianceRiskPrevented",
    header: rightHeader("Total Compliance Risk Prevented"),
    cell: ({ getValue }) => (
      <div className="text-right tabular-nums">{getValue<string>()}</div>
    ),
  },
  {
    id: "Missed Quality Change Rate",
    accessorKey: "missedQualityChangeRate",
    header: rightHeader("Missed Quality Change Rate"),
    cell: ({ getValue }) => (
      <div className="text-right tabular-nums">{getValue<string>()}</div>
    ),
  },
]

const drgColumns: ColumnDef<CoderOverviewDrgRow>[] = [
  {
    id: "Coder ID",
    accessorKey: "coderId",
    header: "Coder ID",
    cell: ({ row }) => (
      <span className="font-medium">{row.original.coderId}</span>
    ),
    enableHiding: false,
  },
  {
    id: "Total Reviewed",
    accessorKey: "totalReviewed",
    header: rightHeader("Total Reviewed"),
    cell: ({ getValue }) => (
      <div className="text-right tabular-nums">{getValue<string>()}</div>
    ),
  },
  {
    id: "Total Changes",
    accessorKey: "totalChanges",
    header: rightHeader("Total Changes"),
    cell: ({ getValue }) => (
      <div className="text-right tabular-nums">{getValue<string>()}</div>
    ),
  },
  {
    id: "Change Rate",
    accessorKey: "changeRate",
    header: rightHeader("Change Rate"),
    cell: ({ getValue }) => (
      <div className="text-right tabular-nums">{getValue<string>()}</div>
    ),
  },
  {
    id: "Increased Changes",
    accessorKey: "increasedChanges",
    header: rightHeader("Increased Changes"),
    cell: ({ getValue }) => (
      <div className="text-right tabular-nums">{getValue<string>()}</div>
    ),
  },
  {
    id: "Decreased Changes",
    accessorKey: "decreasedChanges",
    header: rightHeader("Decreased Changes"),
    cell: ({ getValue }) => (
      <div className="text-right tabular-nums">{getValue<string>()}</div>
    ),
  },
]

const missedColumns: ColumnDef<CoderOverviewMissedRow>[] = [
  {
    id: "Coder ID",
    accessorKey: "coderId",
    header: "Coder ID",
    cell: ({ row }) => (
      <span className="font-medium">{row.original.coderId}</span>
    ),
    enableHiding: false,
  },
  {
    id: "Total Reviewed",
    accessorKey: "totalReviewed",
    header: rightHeader("Total Reviewed"),
    cell: ({ getValue }) => (
      <div className="text-right tabular-nums">{getValue<string>()}</div>
    ),
  },
  {
    id: "Up Changes",
    accessorKey: "upChanges",
    header: rightHeader("Up Changes"),
    cell: ({ getValue }) => (
      <div className="text-right tabular-nums">{getValue<string>()}</div>
    ),
  },
  {
    id: "Change Rate",
    accessorKey: "changeRate",
    header: rightHeader("Change Rate"),
    cell: ({ getValue }) => (
      <div className="text-right tabular-nums">{getValue<string>()}</div>
    ),
  },
  {
    id: "Avg missed $ increase",
    accessorKey: "avgMissedIncrease",
    header: rightHeader("Avg missed $ increase"),
    cell: ({ getValue }) => (
      <div className="text-right tabular-nums">{getValue<string>()}</div>
    ),
  },
  {
    id: "Total Missed Revenue",
    accessorKey: "totalMissedRevenue",
    header: rightHeader("Total Missed Revenue"),
    cell: ({ getValue }) => (
      <div className="text-right tabular-nums">{getValue<string>()}</div>
    ),
  },
]

const complianceColumns: ColumnDef<CoderOverviewComplianceRow>[] = [
  {
    id: "Coder ID",
    accessorKey: "coderId",
    header: "Coder ID",
    cell: ({ row }) => (
      <span className="font-medium">{row.original.coderId}</span>
    ),
    enableHiding: false,
  },
  {
    id: "Total Reviewed",
    accessorKey: "totalReviewed",
    header: rightHeader("Total Reviewed"),
    cell: ({ getValue }) => (
      <div className="text-right tabular-nums">{getValue<string>()}</div>
    ),
  },
  {
    id: "Total Changes",
    accessorKey: "totalChanges",
    header: rightHeader("Total Changes"),
    cell: ({ getValue }) => (
      <div className="text-right tabular-nums">{getValue<string>()}</div>
    ),
  },
  {
    id: "Change Rate",
    accessorKey: "changeRate",
    header: rightHeader("Change Rate"),
    cell: ({ getValue }) => (
      <div className="text-right tabular-nums">{getValue<string>()}</div>
    ),
  },
  {
    id: "Avg. Compliance Risk Saved",
    accessorKey: "avgComplianceRiskSaved",
    header: rightHeader("Avg. Compliance Risk Saved"),
    cell: ({ getValue }) => (
      <div className="text-right tabular-nums">{getValue<string>()}</div>
    ),
  },
  {
    id: "Total Compliance Risk Prevented",
    accessorKey: "totalComplianceRiskPrevented",
    header: rightHeader("Total Compliance Risk Prevented"),
    cell: ({ getValue }) => (
      <div className="text-right tabular-nums">{getValue<string>()}</div>
    ),
  },
]

const qualityColumns: ColumnDef<CoderOverviewQualityRow>[] = [
  {
    id: "Coder ID",
    accessorKey: "coderId",
    header: "Coder ID",
    cell: ({ row }) => (
      <span className="font-medium">{row.original.coderId}</span>
    ),
    enableHiding: false,
  },
  {
    id: "Total Reviewed",
    accessorKey: "totalReviewed",
    header: rightHeader("Total Reviewed"),
    cell: ({ getValue }) => (
      <div className="text-right tabular-nums">{getValue<string>()}</div>
    ),
  },
  {
    id: "Total Changes",
    accessorKey: "totalChanges",
    header: rightHeader("Total Changes"),
    cell: ({ getValue }) => (
      <div className="text-right tabular-nums">{getValue<string>()}</div>
    ),
  },
  {
    id: "Change Rate",
    accessorKey: "changeRate",
    header: rightHeader("Change Rate"),
    cell: ({ getValue }) => (
      <div className="text-right tabular-nums">{getValue<string>()}</div>
    ),
  },
  {
    id: "Secondary Diagnosis",
    accessorKey: "secondaryDiagnosis",
    header: rightHeader("Secondary Diagnosis"),
    cell: ({ getValue }) => (
      <div className="text-right tabular-nums">{getValue<string>()}</div>
    ),
  },
  {
    id: "Secondary Procedures",
    accessorKey: "secondaryProcedures",
    header: rightHeader("Secondary Procedures"),
    cell: ({ getValue }) => (
      <div className="text-right tabular-nums">{getValue<string>()}</div>
    ),
  },
]

export function CoderOverviewTables() {
  return (
    <div className="flex flex-col gap-10">
      <div className="flex flex-col gap-4 border-b border-border/60 pb-6">
        <div>
          <h1 className="font-heading text-2xl font-semibold tracking-tight">
            Coder Overview
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Use the sticky bar for date range, sites, and dimension shortcuts.
            Tables mirror the Excel export structure—demo data only.
          </p>
        </div>
      </div>

      <CoderOverviewDataTable
        title="Overall"
        sectionId={CODER_OVERVIEW_DIMENSIONS[0].sectionId}
        initialData={CODER_OVERALL_DATA}
        dataColumns={overallColumns}
      />

      <CoderOverviewDataTable
        title="DRG"
        sectionId={CODER_OVERVIEW_DIMENSIONS[1].sectionId}
        initialData={CODER_DRG_DATA}
        dataColumns={drgColumns}
      />

      <CoderOverviewDataTable
        title="Missed Opportunities"
        sectionId={CODER_OVERVIEW_DIMENSIONS[2].sectionId}
        initialData={CODER_MISSED_DATA}
        dataColumns={missedColumns}
      />

      <CoderOverviewDataTable
        title="Compliance"
        sectionId={CODER_OVERVIEW_DIMENSIONS[3].sectionId}
        initialData={CODER_COMPLIANCE_DATA}
        dataColumns={complianceColumns}
      />

      <CoderOverviewDataTable
        title="Quality"
        sectionId={CODER_OVERVIEW_DIMENSIONS[4].sectionId}
        initialData={CODER_QUALITY_DATA}
        dataColumns={qualityColumns}
      />
    </div>
  )
}
