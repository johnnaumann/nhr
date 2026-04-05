"use client"

import * as React from "react"
import type { ColumnDef } from "@tanstack/react-table"
import { AlertTriangleIcon, AwardIcon, UserPlusIcon } from "lucide-react"

import { CoderOverviewDataTable } from "@/components/coder-overview-data-table"
import { CODER_TRENDS_TABLE_SECTION_ID } from "@/components/coder-trends-dimension-nav"
import { Badge } from "@/components/ui/badge"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { useCoderTrendsDimension } from "@/contexts/coder-trends-dimension-context"
import { useDashboardDateRange } from "@/contexts/dashboard-date-range-context"
import { useDashboardInstitutions } from "@/contexts/dashboard-institutions-context"
import type { CoderTrendCohortKey } from "@/lib/coder-trends-data"
import { deriveCoderTrendsUnifiedData } from "@/lib/coder-trends-derived-data"
import {
  CODER_TRENDS_COHORT_LABELS,
  CODER_TRENDS_UNIFIED_DATA,
  type CoderTrendUnifiedRow,
} from "@/lib/coder-trends-table-data"
import { cn } from "@/lib/utils"

const tableTypeBadgeLayoutClass =
  "inline-flex flex-row flex-nowrap items-center justify-center gap-0 leading-none [&_svg]:inline-block [&_svg]:shrink-0"

const tableTypeBadgeLabelClass = "pl-1 leading-none text-inherit"

const cohortBadgeTone: Record<CoderTrendCohortKey, string> = {
  "top-performers":
    "border-emerald-500/45 text-emerald-800 dark:text-emerald-300",
  "flagged-risk": "border-destructive/45 text-destructive dark:text-red-400",
  "recently-added": "border-sky-500/45 text-sky-800 dark:text-sky-300",
}

const cohortTypeIcon: Record<
  CoderTrendCohortKey,
  React.ComponentType<{ className?: string }>
> = {
  "top-performers": AwardIcon,
  "flagged-risk": AlertTriangleIcon,
  "recently-added": UserPlusIcon,
}

function CoderTrendsTypeBadge({ cohort }: { cohort: CoderTrendCohortKey }) {
  const Icon = cohortTypeIcon[cohort]
  const label = CODER_TRENDS_COHORT_LABELS[cohort]
  return (
    <Badge
      variant="outline"
      className={cn(
        tableTypeBadgeLayoutClass,
        "px-1.5",
        cohortBadgeTone[cohort],
      )}
    >
      <Icon className="size-3 shrink-0 opacity-90" aria-hidden />
      <span className={tableTypeBadgeLabelClass}>{label}</span>
    </Badge>
  )
}

const CODER_TRENDS_COLUMN_HELP: Record<string, string> = {
  Reviewed:
    "Total charts or encounters reviewed for this coder in the selected reporting period.",
  "Chg %":
    "Share of reviewed charts with at least one coding change in the trend window.",
  "Avg miss +$":
    "Average estimated dollar increase tied to missed-revenue opportunities per chart.",
  "Denial %":
    "Modeled denial-rate exposure based on coding patterns in this cohort.",
  "Avg comp $":
    "Average compliance dollars saved or corrected per chart for this coder.",
  "Qual miss %":
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

const typeColumn: ColumnDef<CoderTrendUnifiedRow> = {
  id: "Type",
  accessorKey: "cohort",
  header: "Type",
  cell: ({ row }) => <CoderTrendsTypeBadge cohort={row.original.cohort} />,
  enableHiding: false,
}

const coderColumn: ColumnDef<CoderTrendUnifiedRow> = {
  id: "Coder",
  accessorKey: "coderId",
  header: "Coder",
  cell: ({ row }) => (
    <span className="font-medium">{row.original.coderId}</span>
  ),
  enableHiding: false,
}

const metricColumns: ColumnDef<CoderTrendUnifiedRow>[] = [
  {
    id: "Reviewed",
    accessorKey: "totalChartsReviewed",
    header: metricHeaderRight("Reviewed"),
    cell: ({ getValue }) => (
      <div className="text-right tabular-nums">{getValue<string>()}</div>
    ),
  },
  {
    id: "Chg %",
    accessorKey: "changeRate",
    header: metricHeaderRight("Chg %"),
    cell: ({ getValue }) => (
      <div className="text-right tabular-nums">{getValue<string>()}</div>
    ),
  },
  {
    id: "Avg miss +$",
    accessorKey: "avgMissedIncrease",
    header: metricHeaderRight("Avg miss +$"),
    cell: ({ getValue }) => (
      <div className="text-right tabular-nums">{getValue<string>()}</div>
    ),
  },
  {
    id: "Denial %",
    accessorKey: "denialRatePotential",
    header: metricHeaderRight("Denial %"),
    cell: ({ getValue }) => (
      <div className="text-right tabular-nums">{getValue<string>()}</div>
    ),
  },
  {
    id: "Avg comp $",
    accessorKey: "avgComplianceRiskSaved",
    header: metricHeaderRight("Avg comp $"),
    cell: ({ getValue }) => (
      <div className="text-right tabular-nums">{getValue<string>()}</div>
    ),
  },
  {
    id: "Qual miss %",
    accessorKey: "missedQualityChanges",
    header: metricHeaderRight("Qual miss %"),
    cell: ({ getValue }) => (
      <div className="text-right tabular-nums">{getValue<string>()}</div>
    ),
  },
]

const dataColumns: ColumnDef<CoderTrendUnifiedRow>[] = [
  coderColumn,
  typeColumn,
  ...metricColumns,
]

export function CoderTrendsTables() {
  const { activeFilter } = useCoderTrendsDimension()
  const { range } = useDashboardDateRange()
  const { visibleInstitutionKeys } = useDashboardInstitutions()

  const derivedData = React.useMemo(
    () =>
      deriveCoderTrendsUnifiedData(CODER_TRENDS_UNIFIED_DATA, {
        range,
        visibleInstitutionKeys,
      }),
    [range, visibleInstitutionKeys],
  )

  const filteredData = React.useMemo(() => {
    if (activeFilter === "overall") return derivedData
    return derivedData.filter((row) => row.cohort === activeFilter)
  }, [activeFilter, derivedData])

  return (
    <CoderOverviewDataTable
      key={activeFilter}
      sectionId={CODER_TRENDS_TABLE_SECTION_ID}
      initialData={filteredData}
      dataColumns={dataColumns}
      defaultPageSize={30}
    />
  )
}
