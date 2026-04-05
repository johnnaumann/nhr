"use client"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { dashboardMainGutterClass } from "@/lib/dashboard-layout"
import { cn } from "@/lib/utils"

export type IndividualCoderOverviewPanelProps = {
  coderLabel: string
  chartsReviewed: number
  className?: string
}

type LensBlock = {
  title: string
  cells: { label: string; value: string }[]
}

const LENS_BLOCKS: LensBlock[] = [
  {
    title: "Coder overview",
    cells: [
      { label: "Charts changed", value: "84" },
      { label: "Change rate", value: "8.0%" },
      { label: "DRG changes", value: "32" },
      { label: "Quality changes", value: "8" },
      { label: "Recovered DRG", value: "—" },
    ],
  },
  {
    title: "Missed revenue opportunities",
    cells: [
      { label: "Change rate", value: "6.20%" },
      { label: "Up changes", value: "63" },
      { label: "Avg missed $ increase", value: "$5,009.00" },
      { label: "Total missed revenue", value: "$1,262,268.00" },
    ],
  },
  {
    title: "Compliance",
    cells: [
      { label: "Change rate", value: "2.00%" },
      { label: "Compliance changes", value: "20" },
      { label: "Avg. compliance risk prevented", value: "$121.53" },
      { label: "Total compliance risk prevented", value: "$30,382.50" },
    ],
  },
  {
    title: "Quality",
    cells: [
      { label: "Change rate", value: "3.1%" },
      { label: "PDX", value: "8" },
      { label: "Secondary diagnosis", value: "11" },
      { label: "Secondary procedures", value: "14" },
    ],
  },
]

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

      <div className="flex flex-col gap-4">
        {LENS_BLOCKS.map((block) => (
          <div
            key={block.title}
            className="overflow-hidden rounded-lg border"
          >
            <h3 className="border-b bg-muted/40 px-4 py-2 text-sm font-medium text-foreground">
              {block.title}
            </h3>
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/30 hover:bg-muted/30">
                  {block.cells.map((c) => (
                    <TableHead
                      key={c.label}
                      className="text-right text-xs font-medium sm:text-sm"
                    >
                      {c.label}
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  {block.cells.map((c) => (
                    <TableCell
                      key={c.label}
                      className="text-right text-sm tabular-nums sm:text-base"
                    >
                      {c.value}
                    </TableCell>
                  ))}
                </TableRow>
              </TableBody>
            </Table>
          </div>
        ))}
      </div>
    </section>
  )
}
