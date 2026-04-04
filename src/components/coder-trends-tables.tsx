"use client"

import type { ColumnDef } from "@tanstack/react-table"

import { CoderOverviewDataTable } from "@/components/coder-overview-data-table"
import { CODER_TRENDS_SECTIONS } from "@/components/coder-trends-dimension-nav"
import {
  CODER_TRENDS_FLAGGED_TABLE_DATA,
  CODER_TRENDS_RECENT_TABLE_DATA,
  CODER_TRENDS_TOP_TABLE_DATA,
  type CoderTrendTableRow,
} from "@/lib/coder-trends-table-data"

function rightHeader(label: string) {
  return () => <div className="w-full text-right">{label}</div>
}

const trendColumns: ColumnDef<CoderTrendTableRow>[] = [
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
    id: "Total Charts Reviewed",
    accessorKey: "totalChartsReviewed",
    header: rightHeader("Total charts reviewed"),
    cell: ({ getValue }) => (
      <div className="text-right tabular-nums">{getValue<string>()}</div>
    ),
  },
  {
    id: "Change Rate",
    accessorKey: "changeRate",
    header: rightHeader("Change rate"),
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
    id: "Denial Rate Potential",
    accessorKey: "denialRatePotential",
    header: rightHeader("Denial rate potential"),
    cell: ({ getValue }) => (
      <div className="text-right tabular-nums">{getValue<string>()}</div>
    ),
  },
  {
    id: "Avg. compliance risk saved",
    accessorKey: "avgComplianceRiskSaved",
    header: rightHeader("Avg. compliance risk saved"),
    cell: ({ getValue }) => (
      <div className="text-right tabular-nums">{getValue<string>()}</div>
    ),
  },
  {
    id: "Missed Quality Changes",
    accessorKey: "missedQualityChanges",
    header: rightHeader("Missed quality changes"),
    cell: ({ getValue }) => (
      <div className="text-right tabular-nums">{getValue<string>()}</div>
    ),
  },
]

export function CoderTrendsTables() {
  return (
    <div className="flex flex-col gap-10">
      <div className="flex flex-col gap-4 border-b border-border/60 pb-6">
        <div>
          <h1 className="font-heading text-2xl font-semibold tracking-tight">
            Coder Trends
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Use the sticky bar for reporting period, sites, and cohort
            shortcuts. Tables mirror the Excel-style export—demo data only.
          </p>
        </div>
      </div>

      <CoderOverviewDataTable
        title="Top performers"
        sectionId={CODER_TRENDS_SECTIONS[0].sectionId}
        initialData={CODER_TRENDS_TOP_TABLE_DATA}
        dataColumns={trendColumns}
      />

      <CoderOverviewDataTable
        title="Flagged for risk"
        sectionId={CODER_TRENDS_SECTIONS[1].sectionId}
        initialData={CODER_TRENDS_FLAGGED_TABLE_DATA}
        dataColumns={trendColumns}
      />

      <CoderOverviewDataTable
        title="Recently added (last 14 days)"
        sectionId={CODER_TRENDS_SECTIONS[2].sectionId}
        initialData={CODER_TRENDS_RECENT_TABLE_DATA}
        dataColumns={trendColumns}
      />
    </div>
  )
}
