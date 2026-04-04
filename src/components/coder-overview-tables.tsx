"use client"

import * as React from "react"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

const OVERALL_ROWS = [
  ["Coder 1", "889", "2.23%", "$13,587.84", "$30,382.50", "1.8%"],
  ["Coder 2", "842", "35.6%", "$2,017,816.92", "$1,430,382.50", "38.8%"],
  ["Coder 3", "999", "5.28%", "$240,387.84", "$55,382.50", "2.8%"],
  ["Coder 4", "889", "28.2%", "$254,268.00", "$1,130,382.50", "4.5%"],
  ["Coder 5", "532", "6.23%", "$217,448.28", "$130,382.50", "3.6%"],
  ["Coder 6", "1042", "4.43%", "$65,068.92", "$55,555.00", "1.3%"],
  ["Coder 7", "1021", "8.0%", "$1,262,268.00", "$168,255.00", "3.1%"],
  ["Coder 8", "931", "6.1%", "$245,196.00", "$155,682.50", "23.9%"],
  ["Coder 9", "1058", "5.43%", "$265,587.84", "$508,607.50", "2.3%"],
] as const

const DRG_ROWS = [
  ["Coder 1", "889", "11", "1.23%", "7", "4"],
  ["Coder 2", "842", "241", "28.6%", "152", "89"],
  ["Coder 3", "999", "33", "3.28%", "21", "12"],
  ["Coder 4", "889", "224", "25.2%", "141", "83"],
  ["Coder 5", "532", "17", "3.23%", "11", "6"],
  ["Coder 6", "1042", "25", "2.43%", "16", "9"],
  ["Coder 7", "1021", "84", "8.2%", "53", "31"],
  ["Coder 8", "931", "57", "6.1%", "36", "21"],
  ["Coder 9", "1058", "34", "3.21%", "21", "13"],
] as const

const MISSED_ROWS = [
  ["Coder 1", "889", "7", "0.75%", "$53.92", "$13,587.84"],
  ["Coder 2", "842", "190", "22.6%", "$8,007.21", "$2,017,816.92"],
  ["Coder 3", "999", "17", "1.75%", "$953.92", "$240,387.84"],
  ["Coder 4", "889", "163", "18.3%", "$1,009.00", "$254,268.00"],
  ["Coder 5", "532", "13", "2.50%", "$862.89", "$217,448.28"],
  ["Coder 6", "1042", "13", "1.24%", "$258.21", "$65,068.92"],
  ["Coder 7", "1021", "63", "6.2%", "$5,009.00", "$1,262,268.00"],
  ["Coder 8", "931", "38", "4.1%", "$973.00", "$245,196.00"],
  ["Coder 9", "1058", "12", "1.18%", "$1,053.92", "$265,587.84"],
] as const

const COMPLIANCE_ROWS = [
  ["Coder 1", "889", "2", "0.23%", "$121.53", "$30,382.50"],
  ["Coder 2", "842", "157", "18.6%", "$5,721.53", "$1,430,382.50"],
  ["Coder 3", "999", "23", "2.28%", "$221.53", "$55,382.50"],
  ["Coder 4", "889", "129", "14.6%", "$4,521.53", "$1,130,382.50"],
  ["Coder 5", "532", "12", "2.23%", "$521.53", "$130,382.50"],
  ["Coder 6", "1042", "15", "1.43%", "$222.22", "$55,555.00"],
  ["Coder 7", "1021", "20", "2.0%", "$673.02", "$168,255.00"],
  ["Coder 8", "931", "10", "1.1%", "$622.73", "$155,682.50"],
  ["Coder 9", "1058", "35", "3.30%", "$2,034.43", "$508,607.50"],
] as const

const QUALITY_ROWS = [
  ["Coder 1", "889", "16", "1.8%", "6", "7"],
  ["Coder 2", "842", "327", "38.8%", "118", "140"],
  ["Coder 3", "999", "28", "2.8%", "10", "12"],
  ["Coder 4", "889", "40", "4.5%", "14", "17"],
  ["Coder 5", "532", "19", "3.6%", "7", "8"],
  ["Coder 6", "1042", "14", "1.3%", "5", "6"],
  ["Coder 7", "1021", "32", "3.1%", "11", "14"],
  ["Coder 8", "931", "223", "23.9%", "80", "96"],
  ["Coder 9", "1058", "24", "2.3%", "9", "10"],
] as const

const DIMENSIONS = ["Overall", "DRG", "Missed Opportunities", "Compliance", "Quality"] as const

function OverviewTable({
  title,
  description,
  headers,
  rows,
}: {
  title: string
  description?: string
  headers: readonly string[]
  rows: readonly (readonly string[])[]
}) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base">{title}</CardTitle>
        {description ? (
          <CardDescription>{description}</CardDescription>
        ) : null}
      </CardHeader>
      <CardContent className="px-0 sm:px-6">
        <Table>
          <TableHeader className="bg-muted">
            <TableRow>
              {headers.map((h) => (
                <TableHead
                  key={h}
                  className={
                    h === "Coder ID"
                      ? "pl-4 sm:pl-6"
                      : "text-right tabular-nums"
                  }
                >
                  {h}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((cells) => (
              <TableRow key={cells[0]}>
                {cells.map((cell, i) => (
                  <TableCell
                    key={`${cells[0]}-${i}`}
                    className={
                      i === 0
                        ? "pl-4 font-medium sm:pl-6"
                        : "text-right tabular-nums"
                    }
                  >
                    {cell}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}

export function CoderOverviewTables() {
  const [timeFilter, setTimeFilter] = React.useState("last-90")
  const [siteFilter, setSiteFilter] = React.useState("all")

  return (
    <div className="flex flex-col gap-6">
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

      <OverviewTable
        title="Overall"
        headers={[
          "Coder ID",
          "Total Reviewed",
          "Change Rate",
          "Total Missed Revenue",
          "Total Compliance Risk Prevented",
          "Missed Quality Change Rate",
        ]}
        rows={OVERALL_ROWS}
      />

      <OverviewTable
        title="DRG"
        headers={[
          "Coder ID",
          "Total Reviewed",
          "Total Changes",
          "Change Rate",
          "Increased Changes",
          "Decreased Changes",
        ]}
        rows={DRG_ROWS}
      />

      <OverviewTable
        title="Missed Opportunities"
        headers={[
          "Coder ID",
          "Total Reviewed",
          "Up Changes",
          "Change Rate",
          "Avg missed $ increase",
          "Total Missed Revenue",
        ]}
        rows={MISSED_ROWS}
      />

      <OverviewTable
        title="Compliance"
        headers={[
          "Coder ID",
          "Total Reviewed",
          "Total Changes",
          "Change Rate",
          "Avg. Compliance Risk Saved",
          "Total Compliance Risk Prevented",
        ]}
        rows={COMPLIANCE_ROWS}
      />

      <OverviewTable
        title="Quality"
        headers={[
          "Coder ID",
          "Total Reviewed",
          "Total Changes",
          "Change Rate",
          "Secondary Diagnosis",
          "Secondary Procedures",
        ]}
        rows={QUALITY_ROWS}
      />
    </div>
  )
}
