"use client"

import type { ColumnDef } from "@tanstack/react-table"
import { CoderOverviewDataTable } from "@/components/coder-overview-data-table"
import { CODER_OVERVIEW_TABLE_SECTION_ID } from "@/components/coder-overview-dimension-nav"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { useCoderOverviewDimension } from "@/contexts/coder-overview-dimension-context"
import {
  CODER_OVERVIEW_COMPLIANCE_DATA,
  CODER_OVERVIEW_DRG_DATA,
  CODER_OVERVIEW_MISSED_DATA,
  CODER_OVERVIEW_OVERALL_DATA,
  CODER_OVERVIEW_QUALITY_DATA,
  type CoderOverviewComplianceRow,
  type CoderOverviewDrgRow,
  type CoderOverviewMissedRow,
  type CoderOverviewOverallRow,
  type CoderOverviewQualityRow,
} from "@/lib/coder-overview-table-data"
import { cn } from "@/lib/utils"

const CODER_OVERVIEW_ALERT_USD_MIN = 5000
const CODER_OVERVIEW_ALERT_PERCENT_MIN = 10

function parseDisplayUsd(value: string): number | null {
  const n = Number.parseFloat(value.replace(/[$,]/g, ""))
  return Number.isFinite(n) ? n : null
}

function parseDisplayPercent(value: string): number | null {
  const n = Number.parseFloat(value.replace(/%/g, "").trim())
  return Number.isFinite(n) ? n : null
}

function CoderOverviewMetricCell({
  value,
  highlight,
}: {
  value: string
  highlight: "money" | "percent" | "none"
}) {
  let over = false
  if (highlight === "money") {
    const v = parseDisplayUsd(value)
    over = v !== null && v > CODER_OVERVIEW_ALERT_USD_MIN
  } else if (highlight === "percent") {
    const v = parseDisplayPercent(value)
    over = v !== null && v > CODER_OVERVIEW_ALERT_PERCENT_MIN
  }

  return (
    <div
      className={cn(
        "text-right tabular-nums",
        over && "font-medium text-destructive",
      )}
    >
      {value}
    </div>
  )
}

const CODER_OVERVIEW_COLUMN_HELP: Record<string, string> = {
  "Total Reviewed":
    "Count of encounters or charts this coder completed in the selected date range and sites.",
  "Change Rate":
    "Percentage of reviewed records that had at least one coding change in this lens.",
  "Total Missed Revenue":
    "Total estimated missed revenue associated with upward coding changes in this view.",
  "Total Compliance Risk Prevented":
    "Total estimated compliance risk avoided or corrected for this coder in the period.",
  "Missed Quality Change Rate":
    "Share of quality-related changes tied to missed-opportunity signals for this coder.",
  "Total Changes":
    "Total coding changes recorded for this coder in the selected period.",
  "Increased Changes":
    "Changes that increased weight, relative weight, or financial impact.",
  "Decreased Changes":
    "Changes that decreased weight, relative weight, or financial impact.",
  "Up Changes":
    "Count of upward-only adjustments (e.g. captures that increased payment).",
  "Avg missed $ increase":
    "Average estimated dollar impact per upward missed-revenue opportunity.",
  "Avg. Compliance Risk Saved":
    "Average compliance dollars attributed to each change in this compliance lens.",
  "Secondary Diagnosis":
    "Number of secondary diagnosis coding changes in the quality lens.",
  "Secondary Procedures":
    "Number of secondary procedure coding changes in the quality lens.",
}

function metricHeaderRight(columnId: string) {
  const description = CODER_OVERVIEW_COLUMN_HELP[columnId]
  const label = columnId
  if (!description) {
    return () => <div className="w-full text-right">{label}</div>
  }
  return function MetricHeader() {
    return (
      <div className="flex w-full justify-end">
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              type="button"
              className={cn(
                "cursor-help border-0 border-b border-dashed border-muted-foreground bg-transparent p-0 text-right font-medium text-inherit underline-offset-4 transition-colors",
                "hover:text-foreground",
                "focus-visible:rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
              )}
            >
              {label}
            </button>
          </TooltipTrigger>
          <TooltipContent
            side="bottom"
            align="end"
            sideOffset={6}
            className="max-w-none text-left"
          >
            <span className="inline-block max-w-sm text-left whitespace-normal">
              {description}
            </span>
          </TooltipContent>
        </Tooltip>
      </div>
    )
  }
}

const OVERALL_COLUMNS: ColumnDef<CoderOverviewOverallRow>[] = [
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
    header: metricHeaderRight("Total Reviewed"),
    cell: ({ getValue }) => (
      <CoderOverviewMetricCell value={getValue<string>()} highlight="none" />
    ),
  },
  {
    id: "Change Rate",
    accessorKey: "changeRate",
    header: metricHeaderRight("Change Rate"),
    cell: ({ getValue }) => (
      <CoderOverviewMetricCell value={getValue<string>()} highlight="percent" />
    ),
  },
  {
    id: "Total Missed Revenue",
    accessorKey: "totalMissedRevenue",
    header: metricHeaderRight("Total Missed Revenue"),
    cell: ({ getValue }) => (
      <CoderOverviewMetricCell value={getValue<string>()} highlight="none" />
    ),
  },
  {
    id: "Total Compliance Risk Prevented",
    accessorKey: "totalComplianceRiskPrevented",
    header: metricHeaderRight("Total Compliance Risk Prevented"),
    cell: ({ getValue }) => (
      <CoderOverviewMetricCell value={getValue<string>()} highlight="none" />
    ),
  },
  {
    id: "Missed Quality Change Rate",
    accessorKey: "missedQualityChangeRate",
    header: metricHeaderRight("Missed Quality Change Rate"),
    cell: ({ getValue }) => (
      <CoderOverviewMetricCell value={getValue<string>()} highlight="percent" />
    ),
  },
]

const DRG_COLUMNS: ColumnDef<CoderOverviewDrgRow>[] = [
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
    header: metricHeaderRight("Total Reviewed"),
    cell: ({ getValue }) => (
      <CoderOverviewMetricCell value={getValue<string>()} highlight="none" />
    ),
  },
  {
    id: "Total Changes",
    accessorKey: "totalChanges",
    header: metricHeaderRight("Total Changes"),
    cell: ({ getValue }) => (
      <CoderOverviewMetricCell value={getValue<string>()} highlight="none" />
    ),
  },
  {
    id: "Change Rate",
    accessorKey: "changeRate",
    header: metricHeaderRight("Change Rate"),
    cell: ({ getValue }) => (
      <CoderOverviewMetricCell value={getValue<string>()} highlight="percent" />
    ),
  },
  {
    id: "Increased Changes",
    accessorKey: "increasedChanges",
    header: metricHeaderRight("Increased Changes"),
    cell: ({ getValue }) => (
      <CoderOverviewMetricCell value={getValue<string>()} highlight="none" />
    ),
  },
  {
    id: "Decreased Changes",
    accessorKey: "decreasedChanges",
    header: metricHeaderRight("Decreased Changes"),
    cell: ({ getValue }) => (
      <CoderOverviewMetricCell value={getValue<string>()} highlight="none" />
    ),
  },
]

const MISSED_COLUMNS: ColumnDef<CoderOverviewMissedRow>[] = [
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
    header: metricHeaderRight("Total Reviewed"),
    cell: ({ getValue }) => (
      <CoderOverviewMetricCell value={getValue<string>()} highlight="none" />
    ),
  },
  {
    id: "Up Changes",
    accessorKey: "upChanges",
    header: metricHeaderRight("Up Changes"),
    cell: ({ getValue }) => (
      <CoderOverviewMetricCell value={getValue<string>()} highlight="none" />
    ),
  },
  {
    id: "Change Rate",
    accessorKey: "changeRate",
    header: metricHeaderRight("Change Rate"),
    cell: ({ getValue }) => (
      <CoderOverviewMetricCell value={getValue<string>()} highlight="percent" />
    ),
  },
  {
    id: "Avg missed $ increase",
    accessorKey: "avgMissedIncrease",
    header: metricHeaderRight("Avg missed $ increase"),
    cell: ({ getValue }) => (
      <CoderOverviewMetricCell value={getValue<string>()} highlight="money" />
    ),
  },
  {
    id: "Total Missed Revenue",
    accessorKey: "totalMissedRevenue",
    header: metricHeaderRight("Total Missed Revenue"),
    cell: ({ getValue }) => (
      <CoderOverviewMetricCell value={getValue<string>()} highlight="none" />
    ),
  },
]

const COMPLIANCE_COLUMNS: ColumnDef<CoderOverviewComplianceRow>[] = [
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
    header: metricHeaderRight("Total Reviewed"),
    cell: ({ getValue }) => (
      <CoderOverviewMetricCell value={getValue<string>()} highlight="none" />
    ),
  },
  {
    id: "Total Changes",
    accessorKey: "totalChanges",
    header: metricHeaderRight("Total Changes"),
    cell: ({ getValue }) => (
      <CoderOverviewMetricCell value={getValue<string>()} highlight="none" />
    ),
  },
  {
    id: "Change Rate",
    accessorKey: "changeRate",
    header: metricHeaderRight("Change Rate"),
    cell: ({ getValue }) => (
      <CoderOverviewMetricCell value={getValue<string>()} highlight="percent" />
    ),
  },
  {
    id: "Avg. Compliance Risk Saved",
    accessorKey: "avgComplianceRiskSaved",
    header: metricHeaderRight("Avg. Compliance Risk Saved"),
    cell: ({ getValue }) => (
      <CoderOverviewMetricCell value={getValue<string>()} highlight="money" />
    ),
  },
  {
    id: "Total Compliance Risk Prevented",
    accessorKey: "totalComplianceRiskPrevented",
    header: metricHeaderRight("Total Compliance Risk Prevented"),
    cell: ({ getValue }) => (
      <CoderOverviewMetricCell value={getValue<string>()} highlight="none" />
    ),
  },
]

const QUALITY_COLUMNS: ColumnDef<CoderOverviewQualityRow>[] = [
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
    header: metricHeaderRight("Total Reviewed"),
    cell: ({ getValue }) => (
      <CoderOverviewMetricCell value={getValue<string>()} highlight="none" />
    ),
  },
  {
    id: "Total Changes",
    accessorKey: "totalChanges",
    header: metricHeaderRight("Total Changes"),
    cell: ({ getValue }) => (
      <CoderOverviewMetricCell value={getValue<string>()} highlight="none" />
    ),
  },
  {
    id: "Change Rate",
    accessorKey: "changeRate",
    header: metricHeaderRight("Change Rate"),
    cell: ({ getValue }) => (
      <CoderOverviewMetricCell value={getValue<string>()} highlight="percent" />
    ),
  },
  {
    id: "Secondary Diagnosis",
    accessorKey: "secondaryDiagnosis",
    header: metricHeaderRight("Secondary Diagnosis"),
    cell: ({ getValue }) => (
      <CoderOverviewMetricCell value={getValue<string>()} highlight="none" />
    ),
  },
  {
    id: "Secondary Procedures",
    accessorKey: "secondaryProcedures",
    header: metricHeaderRight("Secondary Procedures"),
    cell: ({ getValue }) => (
      <CoderOverviewMetricCell value={getValue<string>()} highlight="none" />
    ),
  },
]

export function CoderOverviewTables() {
  const { activeDimension } = useCoderOverviewDimension()

  switch (activeDimension) {
    case "overall":
      return (
        <CoderOverviewDataTable<CoderOverviewOverallRow>
          key={activeDimension}
          sectionId={CODER_OVERVIEW_TABLE_SECTION_ID}
          initialData={CODER_OVERVIEW_OVERALL_DATA}
          dataColumns={OVERALL_COLUMNS}
          defaultPageSize={20}
        />
      )
    case "drg":
      return (
        <CoderOverviewDataTable<CoderOverviewDrgRow>
          key={activeDimension}
          sectionId={CODER_OVERVIEW_TABLE_SECTION_ID}
          initialData={CODER_OVERVIEW_DRG_DATA}
          dataColumns={DRG_COLUMNS}
          defaultPageSize={20}
        />
      )
    case "missed-opportunities":
      return (
        <CoderOverviewDataTable<CoderOverviewMissedRow>
          key={activeDimension}
          sectionId={CODER_OVERVIEW_TABLE_SECTION_ID}
          initialData={CODER_OVERVIEW_MISSED_DATA}
          dataColumns={MISSED_COLUMNS}
          defaultPageSize={20}
        />
      )
    case "compliance":
      return (
        <CoderOverviewDataTable<CoderOverviewComplianceRow>
          key={activeDimension}
          sectionId={CODER_OVERVIEW_TABLE_SECTION_ID}
          initialData={CODER_OVERVIEW_COMPLIANCE_DATA}
          dataColumns={COMPLIANCE_COLUMNS}
          defaultPageSize={20}
        />
      )
    case "quality":
      return (
        <CoderOverviewDataTable<CoderOverviewQualityRow>
          key={activeDimension}
          sectionId={CODER_OVERVIEW_TABLE_SECTION_ID}
          initialData={CODER_OVERVIEW_QUALITY_DATA}
          dataColumns={QUALITY_COLUMNS}
          defaultPageSize={20}
        />
      )
  }
}
