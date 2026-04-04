"use client"

import * as React from "react"
import type { ColumnDef } from "@tanstack/react-table"

import { CoderOverviewDataTable } from "@/components/coder-overview-data-table"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
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

const DIMENSIONS = ["Overall", "DRG", "Missed Opportunities", "Compliance", "Quality"] as const

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
  const [timeFilter, setTimeFilter] = React.useState("last-90")
  const [siteFilter, setSiteFilter] = React.useState("all")

  return (
    <div className="flex flex-col gap-10">
      <div className="flex flex-col gap-4 border-b border-border/60 pb-6">
        <div>
          <h1 className="font-heading text-2xl font-semibold tracking-tight">
            Coder Overview
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Filter by time and location (site). Tables mirror the Excel export
            structure—demo data only.
          </p>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-end sm:gap-4">
          <div className="space-y-1.5">
            <p className="text-xs font-medium text-muted-foreground">Time</p>
            <Select value={timeFilter} onValueChange={setTimeFilter}>
              <SelectTrigger className="w-full min-w-[12rem] sm:w-[12rem]">
                <SelectValue placeholder="Period" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="last-30">Last 30 days</SelectItem>
                <SelectItem value="last-90">Last 90 days</SelectItem>
                <SelectItem value="ytd">Year to date</SelectItem>
                <SelectItem value="custom">Custom range</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <p className="text-xs font-medium text-muted-foreground">
              Location (site)
            </p>
            <Select value={siteFilter} onValueChange={setSiteFilter}>
              <SelectTrigger className="w-full min-w-[12rem] sm:w-[12rem]">
                <SelectValue placeholder="All sites" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All sites</SelectItem>
                <SelectItem value="site-1">Site 1</SelectItem>
                <SelectItem value="site-2">Site 2</SelectItem>
                <SelectItem value="site-3">Site 3</SelectItem>
                <SelectItem value="site-4">Site 4</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div
          className="flex flex-wrap gap-2 text-xs text-muted-foreground"
          aria-hidden
        >
          <span className="font-medium text-foreground">Dimensions:</span>
          {DIMENSIONS.map((d) => (
            <span
              key={d}
              className="rounded-md border border-border/60 bg-muted/40 px-2 py-0.5"
            >
              {d}
            </span>
          ))}
        </div>
      </div>

      <CoderOverviewDataTable
        title="Overall"
        initialData={CODER_OVERALL_DATA}
        dataColumns={overallColumns}
      />

      <CoderOverviewDataTable
        title="DRG"
        initialData={CODER_DRG_DATA}
        dataColumns={drgColumns}
      />

      <CoderOverviewDataTable
        title="Missed Opportunities"
        initialData={CODER_MISSED_DATA}
        dataColumns={missedColumns}
      />

      <CoderOverviewDataTable
        title="Compliance"
        initialData={CODER_COMPLIANCE_DATA}
        dataColumns={complianceColumns}
      />

      <CoderOverviewDataTable
        title="Quality"
        initialData={CODER_QUALITY_DATA}
        dataColumns={qualityColumns}
      />
    </div>
  )
}
