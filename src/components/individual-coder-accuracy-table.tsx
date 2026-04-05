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

const ACCURACY_ROWS: {
  type: string
  ttlAssig: number
  ttlChg: number
  pctAcc: string
}[] = [
  { type: "Coding accuracy", ttlAssig: 235, ttlChg: 9, pctAcc: "96%" },
  { type: "Dx accuracy", ttlAssig: 182, ttlChg: 9, pctAcc: "95%" },
  { type: "PCS accuracy", ttlAssig: 53, ttlChg: 0, pctAcc: "100%" },
  { type: "Disposition acc", ttlAssig: 23, ttlChg: 0, pctAcc: "100%" },
  { type: "POA accuracy", ttlAssig: 182, ttlChg: 0, pctAcc: "100%" },
  { type: "Risk of mortality", ttlAssig: 23, ttlChg: 1, pctAcc: "96%" },
  { type: "Severity of illness", ttlAssig: 23, ttlChg: 3, pctAcc: "87%" },
]

export function IndividualCoderAccuracyTable({
  className,
}: {
  className?: string
}) {
  return (
    <section
      className={cn(dashboardMainGutterClass, className)}
      aria-labelledby="individual-coder-accuracy-heading"
    >
      <h2
        id="individual-coder-accuracy-heading"
        className="mb-3 font-heading text-lg font-semibold tracking-tight"
      >
        Coder accuracy snapshot
      </h2>
      <div className="overflow-hidden rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50 hover:bg-muted/50">
              <TableHead className="font-medium">Type</TableHead>
              <TableHead className="text-right font-medium">Ttl assig</TableHead>
              <TableHead className="text-right font-medium">Ttl chg</TableHead>
              <TableHead className="text-right font-medium">% acc</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {ACCURACY_ROWS.map((row) => (
              <TableRow key={row.type}>
                <TableCell className="font-medium">{row.type}</TableCell>
                <TableCell className="text-right tabular-nums">
                  {row.ttlAssig}
                </TableCell>
                <TableCell className="text-right tabular-nums">
                  {row.ttlChg}
                </TableCell>
                <TableCell className="text-right tabular-nums">
                  {row.pctAcc}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </section>
  )
}
