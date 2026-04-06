"use client"

import * as React from "react"
import type { ColumnDef } from "@tanstack/react-table"

import { CoderOverviewDataTable } from "@/components/coder-overview-data-table"
import { CODER_TRENDS_TABLE_SECTION_ID } from "@/components/coder-trends-dimension-nav"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { useCoderTrendsDimension } from "@/contexts/coder-trends-dimension-context"
import {
  CODER_TRENDS_UNIFIED_DATA,
  type CoderTrendUnifiedRow,
} from "@/lib/coder-trends-table-data"
import { cn } from "@/lib/utils"

const CODER_TRENDS_ALERT_USD_MIN = 5000
const CODER_TRENDS_ALERT_PERCENT_MIN = 10

function parseDisplayUsd(value: string): number | null {
  const n = Number.parseFloat(value.replace(/[$,]/g, ""))
  return Number.isFinite(n) ? n : null
}

function parseDisplayPercent(value: string): number | null {
  const n = Number.parseFloat(value.replace(/%/g, "").trim())
  return Number.isFinite(n) ? n : null
}

function CoderTrendsMetricCell({
  value,
  highlight,
}: {
  value: string
  highlight: "money" | "percent" | "none"
}) {
  let over = false
  if (highlight === "money") {
    const v = parseDisplayUsd(value)
    over = v !== null && v > CODER_TRENDS_ALERT_USD_MIN
  } else if (highlight === "percent") {
    const v = parseDisplayPercent(value)
    over = v !== null && v > CODER_TRENDS_ALERT_PERCENT_MIN
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

const CODER_TRENDS_COLUMN_HELP: Record<string, string> = {
  "Total Charts Reviewed":
    "Total charts or encounters reviewed for this coder in the last three months.",
  "Change Rate":
    "Share of reviewed charts with at least one coding change in the trend window.",
  "Avg missed $ increase":
    "Average estimated dollar increase tied to missed-revenue opportunities per chart.",
  "Denial Rate Potential":
    "Modeled denial-rate exposure based on coding patterns in this cohort.",
  "Avg. compliance risk saved":
    "Average compliance dollars saved or corrected per chart for this coder.",
  "Missed Quality Changes":
    "Share of charts with missed quality-related coding changes in the period.",
}

function metricHeaderRight(columnId: string) {
  const description = CODER_TRENDS_COLUMN_HELP[columnId]
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

const coderColumn: ColumnDef<CoderTrendUnifiedRow> = {
  id: "Coder ID",
  accessorKey: "coderId",
  header: "Coder ID",
  cell: ({ row }) => (
    <span className="font-medium">{row.original.coderId}</span>
  ),
  enableHiding: false,
}

const metricColumns: ColumnDef<CoderTrendUnifiedRow>[] = [
  {
    id: "Total Charts Reviewed",
    accessorKey: "totalChartsReviewed",
    header: metricHeaderRight("Total Charts Reviewed"),
    cell: ({ getValue }) => (
      <CoderTrendsMetricCell value={getValue<string>()} highlight="none" />
    ),
  },
  {
    id: "Change Rate",
    accessorKey: "changeRate",
    header: metricHeaderRight("Change Rate"),
    cell: ({ getValue }) => (
      <CoderTrendsMetricCell value={getValue<string>()} highlight="percent" />
    ),
  },
  {
    id: "Avg missed $ increase",
    accessorKey: "avgMissedIncrease",
    header: metricHeaderRight("Avg missed $ increase"),
    cell: ({ getValue }) => (
      <CoderTrendsMetricCell value={getValue<string>()} highlight="money" />
    ),
  },
  {
    id: "Denial Rate Potential",
    accessorKey: "denialRatePotential",
    header: metricHeaderRight("Denial Rate Potential"),
    cell: ({ getValue }) => (
      <CoderTrendsMetricCell value={getValue<string>()} highlight="percent" />
    ),
  },
  {
    id: "Avg. compliance risk saved",
    accessorKey: "avgComplianceRiskSaved",
    header: metricHeaderRight("Avg. compliance risk saved"),
    cell: ({ getValue }) => (
      <CoderTrendsMetricCell value={getValue<string>()} highlight="money" />
    ),
  },
  {
    id: "Missed Quality Changes",
    accessorKey: "missedQualityChanges",
    header: metricHeaderRight("Missed Quality Changes"),
    cell: ({ getValue }) => (
      <CoderTrendsMetricCell value={getValue<string>()} highlight="percent" />
    ),
  },
]

const dataColumns: ColumnDef<CoderTrendUnifiedRow>[] = [
  coderColumn,
  ...metricColumns,
]

export function CoderTrendsTables() {
  const { activeFilter } = useCoderTrendsDimension()

  const filteredData = React.useMemo(
    () => CODER_TRENDS_UNIFIED_DATA.filter((row) => row.cohort === activeFilter),
    [activeFilter],
  )

  return (
    <CoderOverviewDataTable
      key={activeFilter}
      title="Last 3 months"
      titleAs="h3"
      sectionId={CODER_TRENDS_TABLE_SECTION_ID}
      initialData={filteredData}
      dataColumns={dataColumns}
      defaultPageSize={20}
    />
  )
}
