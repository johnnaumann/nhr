"use client"

import * as React from "react"
import type { ColumnDef } from "@tanstack/react-table"
import {
  AwardIcon,
  LayersIcon,
  ShieldCheckIcon,
  TrendingUpIcon,
} from "lucide-react"

import { CoderOverviewDataTable } from "@/components/coder-overview-data-table"
import {
  CODER_OVERVIEW_DIMENSION_LABELS,
  CODER_OVERVIEW_TABLE_SECTION_ID,
} from "@/components/coder-overview-dimension-nav"
import { Badge } from "@/components/ui/badge"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { useCoderOverviewDimension } from "@/contexts/coder-overview-dimension-context"
import { useDashboardDateRange } from "@/contexts/dashboard-date-range-context"
import { useDashboardInstitutions } from "@/contexts/dashboard-institutions-context"
import { deriveCoderOverviewUnifiedData } from "@/lib/coder-overview-derived-data"
import {
  CODER_OVERVIEW_UNIFIED_DATA,
  type CoderOverviewRowDimension,
  type CoderOverviewUnifiedRow,
} from "@/lib/coder-overview-table-data"
import { cn } from "@/lib/utils"

/** Match dashboard `DataTable` status cell layout (icon + label). */
const tableTypeBadgeLayoutClass =
  "inline-flex flex-row flex-nowrap items-center justify-center gap-0 leading-none [&_svg]:inline-block [&_svg]:shrink-0"

const tableTypeBadgeLabelClass = "pl-1 leading-none text-inherit"

const dimensionBadgeTone: Record<CoderOverviewRowDimension, string> = {
  drg: "border-sky-500/45 text-sky-800 dark:text-sky-300",
  "missed-opportunities":
    "border-amber-500/45 text-amber-900 dark:text-amber-300",
  compliance: "border-violet-500/45 text-violet-800 dark:text-violet-300",
  quality: "border-emerald-500/45 text-emerald-800 dark:text-emerald-300",
}

const dimensionTypeIcon: Record<
  CoderOverviewRowDimension,
  React.ComponentType<{ className?: string }>
> = {
  drg: LayersIcon,
  "missed-opportunities": TrendingUpIcon,
  compliance: ShieldCheckIcon,
  quality: AwardIcon,
}

function CoderOverviewTypeBadge({
  dimension,
}: {
  dimension: CoderOverviewRowDimension
}) {
  const Icon = dimensionTypeIcon[dimension]
  const label = CODER_OVERVIEW_DIMENSION_LABELS[dimension]
  return (
    <Badge
      variant="outline"
      className={cn(
        tableTypeBadgeLayoutClass,
        "px-1.5",
        dimensionBadgeTone[dimension],
      )}
    >
      <Icon className="size-3 shrink-0 opacity-90" aria-hidden />
      <span className={tableTypeBadgeLabelClass}>{label}</span>
    </Badge>
  )
}

/** Hover help for numeric / metric columns (not Coder or Type). */
const CODER_OVERVIEW_COLUMN_HELP: Record<string, string> = {
  Reviewed:
    "Count of encounters or charts this coder completed in the selected date range and sites.",
  "Chg %":
    "Percentage of reviewed records that had at least one coding change in this lens.",
  Changes:
    "Total coding changes recorded for this coder in the selected period.",
  "+Chg":
    "Changes that increased weight, relative weight, or financial impact (e.g. higher DRG or dollars).",
  "-Chg":
    "Changes that decreased weight, relative weight, or financial impact.",
  Up: "Count of upward-only adjustments in the missed-revenue view (e.g. captures that increased payment).",
  "Avg miss $":
    "Average estimated dollar impact per upward missed-revenue opportunity.",
  "Missed $":
    "Total estimated missed revenue associated with upward coding changes in this view.",
  "Avg comp $":
    "Average compliance dollars attributed to each change in this compliance lens.",
  "Comp prev $":
    "Total estimated compliance risk avoided or corrected for this coder in the period.",
  "2° Dx":
    "Number of secondary diagnosis coding changes in the quality lens.",
  "2° Proc":
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

const typeColumn: ColumnDef<CoderOverviewUnifiedRow> = {
  id: "Type",
  accessorKey: "dimension",
  header: "Type",
  cell: ({ row }) => (
    <CoderOverviewTypeBadge dimension={row.original.dimension} />
  ),
  enableHiding: false,
}

/** All categories at once: full metric set (every row has values). */
const allCategoriesMetricColumns: ColumnDef<CoderOverviewUnifiedRow>[] = [
  {
    id: "Coder",
    accessorKey: "coderId",
    header: "Coder",
    cell: ({ row }) => (
      <span className="font-medium">{row.original.coderId}</span>
    ),
    enableHiding: false,
  },
  {
    id: "Reviewed",
    accessorKey: "totalReviewed",
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
    id: "Changes",
    accessorKey: "totalChanges",
    header: metricHeaderRight("Changes"),
    cell: ({ getValue }) => (
      <div className="text-right tabular-nums">{getValue<string>()}</div>
    ),
  },
  {
    id: "+Chg",
    accessorKey: "increasedChanges",
    header: metricHeaderRight("+Chg"),
    cell: ({ getValue }) => (
      <div className="text-right tabular-nums">{getValue<string>()}</div>
    ),
  },
  {
    id: "-Chg",
    accessorKey: "decreasedChanges",
    header: metricHeaderRight("-Chg"),
    cell: ({ getValue }) => (
      <div className="text-right tabular-nums">{getValue<string>()}</div>
    ),
  },
  {
    id: "Up",
    accessorKey: "upChanges",
    header: metricHeaderRight("Up"),
    cell: ({ getValue }) => (
      <div className="text-right tabular-nums">{getValue<string>()}</div>
    ),
  },
  {
    id: "Avg miss $",
    accessorKey: "avgMissedIncrease",
    header: metricHeaderRight("Avg miss $"),
    cell: ({ getValue }) => (
      <div className="text-right tabular-nums">{getValue<string>()}</div>
    ),
  },
  {
    id: "Missed $",
    accessorKey: "totalMissedRevenue",
    header: metricHeaderRight("Missed $"),
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
    id: "Comp prev $",
    accessorKey: "totalComplianceRiskPrevented",
    header: metricHeaderRight("Comp prev $"),
    cell: ({ getValue }) => (
      <div className="text-right tabular-nums">{getValue<string>()}</div>
    ),
  },
  {
    id: "2° Dx",
    accessorKey: "secondaryDiagnosis",
    header: metricHeaderRight("2° Dx"),
    cell: ({ getValue }) => (
      <div className="text-right tabular-nums">{getValue<string>()}</div>
    ),
  },
  {
    id: "2° Proc",
    accessorKey: "secondaryProcedures",
    header: metricHeaderRight("2° Proc"),
    cell: ({ getValue }) => (
      <div className="text-right tabular-nums">{getValue<string>()}</div>
    ),
  },
]

const drgColumns: ColumnDef<CoderOverviewUnifiedRow>[] = [
  {
    id: "Coder",
    accessorKey: "coderId",
    header: "Coder",
    cell: ({ row }) => (
      <span className="font-medium">{row.original.coderId}</span>
    ),
    enableHiding: false,
  },
  {
    id: "Reviewed",
    accessorKey: "totalReviewed",
    header: metricHeaderRight("Reviewed"),
    cell: ({ getValue }) => (
      <div className="text-right tabular-nums">{getValue<string>()}</div>
    ),
  },
  {
    id: "Changes",
    accessorKey: "totalChanges",
    header: metricHeaderRight("Changes"),
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
    id: "+Chg",
    accessorKey: "increasedChanges",
    header: metricHeaderRight("+Chg"),
    cell: ({ getValue }) => (
      <div className="text-right tabular-nums">{getValue<string>()}</div>
    ),
  },
  {
    id: "-Chg",
    accessorKey: "decreasedChanges",
    header: metricHeaderRight("-Chg"),
    cell: ({ getValue }) => (
      <div className="text-right tabular-nums">{getValue<string>()}</div>
    ),
  },
]

const missedColumns: ColumnDef<CoderOverviewUnifiedRow>[] = [
  {
    id: "Coder",
    accessorKey: "coderId",
    header: "Coder",
    cell: ({ row }) => (
      <span className="font-medium">{row.original.coderId}</span>
    ),
    enableHiding: false,
  },
  {
    id: "Reviewed",
    accessorKey: "totalReviewed",
    header: metricHeaderRight("Reviewed"),
    cell: ({ getValue }) => (
      <div className="text-right tabular-nums">{getValue<string>()}</div>
    ),
  },
  {
    id: "Up",
    accessorKey: "upChanges",
    header: metricHeaderRight("Up"),
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
    id: "Avg miss $",
    accessorKey: "avgMissedIncrease",
    header: metricHeaderRight("Avg miss $"),
    cell: ({ getValue }) => (
      <div className="text-right tabular-nums">{getValue<string>()}</div>
    ),
  },
  {
    id: "Missed $",
    accessorKey: "totalMissedRevenue",
    header: metricHeaderRight("Missed $"),
    cell: ({ getValue }) => (
      <div className="text-right tabular-nums">{getValue<string>()}</div>
    ),
  },
]

const complianceColumns: ColumnDef<CoderOverviewUnifiedRow>[] = [
  {
    id: "Coder",
    accessorKey: "coderId",
    header: "Coder",
    cell: ({ row }) => (
      <span className="font-medium">{row.original.coderId}</span>
    ),
    enableHiding: false,
  },
  {
    id: "Reviewed",
    accessorKey: "totalReviewed",
    header: metricHeaderRight("Reviewed"),
    cell: ({ getValue }) => (
      <div className="text-right tabular-nums">{getValue<string>()}</div>
    ),
  },
  {
    id: "Changes",
    accessorKey: "totalChanges",
    header: metricHeaderRight("Changes"),
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
    id: "Avg comp $",
    accessorKey: "avgComplianceRiskSaved",
    header: metricHeaderRight("Avg comp $"),
    cell: ({ getValue }) => (
      <div className="text-right tabular-nums">{getValue<string>()}</div>
    ),
  },
  {
    id: "Comp prev $",
    accessorKey: "totalComplianceRiskPrevented",
    header: metricHeaderRight("Comp prev $"),
    cell: ({ getValue }) => (
      <div className="text-right tabular-nums">{getValue<string>()}</div>
    ),
  },
]

const qualityColumns: ColumnDef<CoderOverviewUnifiedRow>[] = [
  {
    id: "Coder",
    accessorKey: "coderId",
    header: "Coder",
    cell: ({ row }) => (
      <span className="font-medium">{row.original.coderId}</span>
    ),
    enableHiding: false,
  },
  {
    id: "Reviewed",
    accessorKey: "totalReviewed",
    header: metricHeaderRight("Reviewed"),
    cell: ({ getValue }) => (
      <div className="text-right tabular-nums">{getValue<string>()}</div>
    ),
  },
  {
    id: "Changes",
    accessorKey: "totalChanges",
    header: metricHeaderRight("Changes"),
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
    id: "2° Dx",
    accessorKey: "secondaryDiagnosis",
    header: metricHeaderRight("2° Dx"),
    cell: ({ getValue }) => (
      <div className="text-right tabular-nums">{getValue<string>()}</div>
    ),
  },
  {
    id: "2° Proc",
    accessorKey: "secondaryProcedures",
    header: metricHeaderRight("2° Proc"),
    cell: ({ getValue }) => (
      <div className="text-right tabular-nums">{getValue<string>()}</div>
    ),
  },
]

const METRIC_COLUMNS_BY_ROW_DIMENSION: Record<
  CoderOverviewRowDimension,
  ColumnDef<CoderOverviewUnifiedRow>[]
> = {
  drg: drgColumns,
  "missed-opportunities": missedColumns,
  compliance: complianceColumns,
  quality: qualityColumns,
}

export function CoderOverviewTables() {
  const { activeDimension } = useCoderOverviewDimension()
  const { range } = useDashboardDateRange()
  const { visibleInstitutionKeys } = useDashboardInstitutions()

  const derivedData = React.useMemo(
    () =>
      deriveCoderOverviewUnifiedData(CODER_OVERVIEW_UNIFIED_DATA, {
        range,
        visibleInstitutionKeys,
      }),
    [range, visibleInstitutionKeys],
  )

  const filteredData = React.useMemo(
    () =>
      activeDimension === "overall"
        ? derivedData
        : derivedData.filter((row) => row.dimension === activeDimension),
    [activeDimension, derivedData],
  )

  const dataColumns = React.useMemo(() => {
    const metrics =
      activeDimension === "overall"
        ? allCategoriesMetricColumns
        : METRIC_COLUMNS_BY_ROW_DIMENSION[activeDimension]
    const [coderIdColumn, ...restMetrics] = metrics
    return [coderIdColumn, typeColumn, ...restMetrics]
  }, [activeDimension])

  return (
    <CoderOverviewDataTable
      key={activeDimension}
      sectionId={CODER_OVERVIEW_TABLE_SECTION_ID}
      initialData={filteredData}
      dataColumns={dataColumns}
      defaultPageSize={30}
    />
  )
}
