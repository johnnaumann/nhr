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
import {
  CODER_OVERVIEW_UNIFIED_DATA,
  type CoderOverviewRowDimension,
  type CoderOverviewUnifiedRow,
} from "@/lib/coder-overview-table-data"
import { cn } from "@/lib/utils"

/** Match dashboard `DataTable` status cell layout (icon + label). */
const tableTypeBadgeLayoutClass =
  "inline-flex flex-row flex-nowrap items-center justify-center gap-0 leading-none [&_svg]:inline-block [&_svg]:shrink-0"

const tableTypeBadgeLabelClass =
  "translate-y-px pl-1 leading-none text-inherit"

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
  id: "dimension",
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
    id: "Total Changes",
    accessorKey: "totalChanges",
    header: rightHeader("Total Changes"),
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
  {
    id: "Up Changes",
    accessorKey: "upChanges",
    header: rightHeader("Up Changes"),
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

const drgColumns: ColumnDef<CoderOverviewUnifiedRow>[] = [
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

const missedColumns: ColumnDef<CoderOverviewUnifiedRow>[] = [
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

const complianceColumns: ColumnDef<CoderOverviewUnifiedRow>[] = [
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

const qualityColumns: ColumnDef<CoderOverviewUnifiedRow>[] = [
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

  const filteredData = React.useMemo(
    () =>
      activeDimension === "overall"
        ? CODER_OVERVIEW_UNIFIED_DATA
        : CODER_OVERVIEW_UNIFIED_DATA.filter(
            (row) => row.dimension === activeDimension,
          ),
    [activeDimension],
  )

  const dataColumns = React.useMemo(() => {
    const metrics =
      activeDimension === "overall"
        ? allCategoriesMetricColumns
        : METRIC_COLUMNS_BY_ROW_DIMENSION[activeDimension]
    return [typeColumn, ...metrics]
  }, [activeDimension])

  const title = CODER_OVERVIEW_DIMENSION_LABELS[activeDimension]

  return (
    <div className="flex flex-col gap-10">
      <div className="flex flex-col gap-4 border-b border-border/60 pb-6">
        <div>
          <h1 className="font-heading text-2xl font-semibold tracking-tight">
            Coder Overview
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Use the sticky bar for date range and sites. Overall lists every
            category; other choices show one category—demo data only.
          </p>
        </div>
      </div>

      <CoderOverviewDataTable
        key={activeDimension}
        title={title}
        sectionId={CODER_OVERVIEW_TABLE_SECTION_ID}
        initialData={filteredData}
        dataColumns={dataColumns}
      />
    </div>
  )
}
