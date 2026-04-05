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

function rightHeader(label: string) {
  return () => <div className="w-full text-right">{label}</div>
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
    header: rightHeader("Reviewed"),
    cell: ({ getValue }) => (
      <div className="text-right tabular-nums">{getValue<string>()}</div>
    ),
  },
  {
    id: "Chg %",
    accessorKey: "changeRate",
    header: rightHeader("Chg %"),
    cell: ({ getValue }) => (
      <div className="text-right tabular-nums">{getValue<string>()}</div>
    ),
  },
  {
    id: "Changes",
    accessorKey: "totalChanges",
    header: rightHeader("Changes"),
    cell: ({ getValue }) => (
      <div className="text-right tabular-nums">{getValue<string>()}</div>
    ),
  },
  {
    id: "+Chg",
    accessorKey: "increasedChanges",
    header: rightHeader("+Chg"),
    cell: ({ getValue }) => (
      <div className="text-right tabular-nums">{getValue<string>()}</div>
    ),
  },
  {
    id: "-Chg",
    accessorKey: "decreasedChanges",
    header: rightHeader("-Chg"),
    cell: ({ getValue }) => (
      <div className="text-right tabular-nums">{getValue<string>()}</div>
    ),
  },
  {
    id: "Up",
    accessorKey: "upChanges",
    header: rightHeader("Up"),
    cell: ({ getValue }) => (
      <div className="text-right tabular-nums">{getValue<string>()}</div>
    ),
  },
  {
    id: "Avg miss $",
    accessorKey: "avgMissedIncrease",
    header: rightHeader("Avg miss $"),
    cell: ({ getValue }) => (
      <div className="text-right tabular-nums">{getValue<string>()}</div>
    ),
  },
  {
    id: "Missed $",
    accessorKey: "totalMissedRevenue",
    header: rightHeader("Missed $"),
    cell: ({ getValue }) => (
      <div className="text-right tabular-nums">{getValue<string>()}</div>
    ),
  },
  {
    id: "Avg comp $",
    accessorKey: "avgComplianceRiskSaved",
    header: rightHeader("Avg comp $"),
    cell: ({ getValue }) => (
      <div className="text-right tabular-nums">{getValue<string>()}</div>
    ),
  },
  {
    id: "Comp prev $",
    accessorKey: "totalComplianceRiskPrevented",
    header: rightHeader("Comp prev $"),
    cell: ({ getValue }) => (
      <div className="text-right tabular-nums">{getValue<string>()}</div>
    ),
  },
  {
    id: "2° Dx",
    accessorKey: "secondaryDiagnosis",
    header: rightHeader("2° Dx"),
    cell: ({ getValue }) => (
      <div className="text-right tabular-nums">{getValue<string>()}</div>
    ),
  },
  {
    id: "2° Proc",
    accessorKey: "secondaryProcedures",
    header: rightHeader("2° Proc"),
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
    header: rightHeader("Reviewed"),
    cell: ({ getValue }) => (
      <div className="text-right tabular-nums">{getValue<string>()}</div>
    ),
  },
  {
    id: "Changes",
    accessorKey: "totalChanges",
    header: rightHeader("Changes"),
    cell: ({ getValue }) => (
      <div className="text-right tabular-nums">{getValue<string>()}</div>
    ),
  },
  {
    id: "Chg %",
    accessorKey: "changeRate",
    header: rightHeader("Chg %"),
    cell: ({ getValue }) => (
      <div className="text-right tabular-nums">{getValue<string>()}</div>
    ),
  },
  {
    id: "+Chg",
    accessorKey: "increasedChanges",
    header: rightHeader("+Chg"),
    cell: ({ getValue }) => (
      <div className="text-right tabular-nums">{getValue<string>()}</div>
    ),
  },
  {
    id: "-Chg",
    accessorKey: "decreasedChanges",
    header: rightHeader("-Chg"),
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
    header: rightHeader("Reviewed"),
    cell: ({ getValue }) => (
      <div className="text-right tabular-nums">{getValue<string>()}</div>
    ),
  },
  {
    id: "Up",
    accessorKey: "upChanges",
    header: rightHeader("Up"),
    cell: ({ getValue }) => (
      <div className="text-right tabular-nums">{getValue<string>()}</div>
    ),
  },
  {
    id: "Chg %",
    accessorKey: "changeRate",
    header: rightHeader("Chg %"),
    cell: ({ getValue }) => (
      <div className="text-right tabular-nums">{getValue<string>()}</div>
    ),
  },
  {
    id: "Avg miss $",
    accessorKey: "avgMissedIncrease",
    header: rightHeader("Avg miss $"),
    cell: ({ getValue }) => (
      <div className="text-right tabular-nums">{getValue<string>()}</div>
    ),
  },
  {
    id: "Missed $",
    accessorKey: "totalMissedRevenue",
    header: rightHeader("Missed $"),
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
    header: rightHeader("Reviewed"),
    cell: ({ getValue }) => (
      <div className="text-right tabular-nums">{getValue<string>()}</div>
    ),
  },
  {
    id: "Changes",
    accessorKey: "totalChanges",
    header: rightHeader("Changes"),
    cell: ({ getValue }) => (
      <div className="text-right tabular-nums">{getValue<string>()}</div>
    ),
  },
  {
    id: "Chg %",
    accessorKey: "changeRate",
    header: rightHeader("Chg %"),
    cell: ({ getValue }) => (
      <div className="text-right tabular-nums">{getValue<string>()}</div>
    ),
  },
  {
    id: "Avg comp $",
    accessorKey: "avgComplianceRiskSaved",
    header: rightHeader("Avg comp $"),
    cell: ({ getValue }) => (
      <div className="text-right tabular-nums">{getValue<string>()}</div>
    ),
  },
  {
    id: "Comp prev $",
    accessorKey: "totalComplianceRiskPrevented",
    header: rightHeader("Comp prev $"),
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
    header: rightHeader("Reviewed"),
    cell: ({ getValue }) => (
      <div className="text-right tabular-nums">{getValue<string>()}</div>
    ),
  },
  {
    id: "Changes",
    accessorKey: "totalChanges",
    header: rightHeader("Changes"),
    cell: ({ getValue }) => (
      <div className="text-right tabular-nums">{getValue<string>()}</div>
    ),
  },
  {
    id: "Chg %",
    accessorKey: "changeRate",
    header: rightHeader("Chg %"),
    cell: ({ getValue }) => (
      <div className="text-right tabular-nums">{getValue<string>()}</div>
    ),
  },
  {
    id: "2° Dx",
    accessorKey: "secondaryDiagnosis",
    header: rightHeader("2° Dx"),
    cell: ({ getValue }) => (
      <div className="text-right tabular-nums">{getValue<string>()}</div>
    ),
  },
  {
    id: "2° Proc",
    accessorKey: "secondaryProcedures",
    header: rightHeader("2° Proc"),
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
