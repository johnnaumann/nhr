"use client"

import * as React from "react"
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts"

import { Button } from "@/components/ui/button"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { useIsMobile } from "@/hooks/use-mobile"
import type { DocumentChange } from "@/lib/document-change-schema"

const drawerChartData = [
  { week: "Week 1", revisions: 4, reviewComments: 12 },
  { week: "Week 2", revisions: 7, reviewComments: 18 },
  { week: "Week 3", revisions: 5, reviewComments: 9 },
  { week: "Week 4", revisions: 2, reviewComments: 14 },
  { week: "Week 5", revisions: 6, reviewComments: 8 },
  { week: "Week 6", revisions: 3, reviewComments: 5 },
]

const drawerChartConfig = {
  revisions: {
    label: "Revisions",
    color: "var(--chart-1)",
  },
  reviewComments: {
    label: "Review comments",
    color: "var(--chart-5)",
  },
} satisfies ChartConfig

export function ChangeDetailDrawerPanel({ item }: { item: DocumentChange }) {
  const isMobile = useIsMobile()

  return (
    <>
      <DrawerHeader className="gap-1">
        <DrawerTitle>{item.header}</DrawerTitle>
        <DrawerDescription>
          Required document change: what needs updating, who is reviewing it,
          and how long it is expected to take versus the allowed window.
        </DrawerDescription>
      </DrawerHeader>
      <div className="flex flex-col gap-4 overflow-y-auto px-4 text-sm">
        {!isMobile && (
          <>
            <ChartContainer config={drawerChartConfig}>
              <AreaChart
                accessibilityLayer
                data={drawerChartData}
                margin={{
                  left: 0,
                  right: 10,
                }}
              >
                <CartesianGrid vertical={false} />
                <XAxis
                  dataKey="week"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  tickFormatter={(value) =>
                    (value as string).replace("Week ", "W")
                  }
                />
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent indicator="dot" showTotal />}
                />
                <Area
                  dataKey="reviewComments"
                  type="natural"
                  fill="var(--color-reviewComments)"
                  fillOpacity={0.6}
                  stroke="var(--color-reviewComments)"
                  stackId="a"
                />
                <Area
                  dataKey="revisions"
                  type="natural"
                  fill="var(--color-revisions)"
                  fillOpacity={0.4}
                  stroke="var(--color-revisions)"
                  stackId="a"
                />
              </AreaChart>
            </ChartContainer>
            <Separator />
            <div className="grid gap-2">
              <div className="flex gap-2 leading-none font-medium">
                Review activity over the last 6 weeks
              </div>
              <div className="text-muted-foreground">
                Tracks document revisions and reviewer comments for this
                change. Higher comment volume may indicate sections that need
                additional clarification before sign-off.
              </div>
            </div>
            <Separator />
          </>
        )}
        <form className="flex flex-col gap-4">
          <div className="flex flex-col gap-3">
            <Label htmlFor="header">Change summary</Label>
            <Input id="header" defaultValue={item.header} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-3">
              <Label htmlFor="type">Section type</Label>
              <Select defaultValue={item.type}>
                <SelectTrigger id="type" className="w-full">
                  <SelectValue placeholder="Select a type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="Benefits narrative">
                      Benefits narrative
                    </SelectItem>
                    <SelectItem value="Claims">Claims</SelectItem>
                    <SelectItem value="Compliance exhibit">
                      Compliance exhibit
                    </SelectItem>
                    <SelectItem value="Data & systems">Data & systems</SelectItem>
                    <SelectItem value="Exhibit">Exhibit</SelectItem>
                    <SelectItem value="Financial">Financial</SelectItem>
                    <SelectItem value="Legal & compliance">
                      Legal & compliance
                    </SelectItem>
                    <SelectItem value="Member communications">
                      Member communications
                    </SelectItem>
                    <SelectItem value="Member guide">Member guide</SelectItem>
                    <SelectItem value="Network & access">
                      Network & access
                    </SelectItem>
                    <SelectItem value="Operations">Operations</SelectItem>
                    <SelectItem value="Pharmacy">Pharmacy</SelectItem>
                    <SelectItem value="Planning">Planning</SelectItem>
                    <SelectItem value="Policy schedule">Policy schedule</SelectItem>
                    <SelectItem value="Research">Research</SelectItem>
                    <SelectItem value="Summary">Summary</SelectItem>
                    <SelectItem value="Utilization management">
                      Utilization management
                    </SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-col gap-3">
              <Label htmlFor="status">Status</Label>
              <Select defaultValue={item.status}>
                <SelectTrigger id="status" className="w-full">
                  <SelectValue placeholder="Select a status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="Done">Done</SelectItem>
                    <SelectItem value="In Process">In Process</SelectItem>
                    <SelectItem value="In Progress">In Progress</SelectItem>
                    <SelectItem value="Not Started">Not Started</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-3">
              <Label htmlFor="target">Target days</Label>
              <Input
                id="target"
                defaultValue={item.target}
                inputMode="numeric"
                aria-describedby="target-hint"
              />
              <p id="target-hint" className="text-xs text-muted-foreground">
                Working goal for completing this change (days).
              </p>
            </div>
            <div className="flex flex-col gap-3">
              <Label htmlFor="limit">Maximum days</Label>
              <Input
                id="limit"
                defaultValue={item.limit}
                inputMode="numeric"
                aria-describedby="limit-hint"
              />
              <p id="limit-hint" className="text-xs text-muted-foreground">
                Policy or SLA ceiling; change should not exceed this many days.
              </p>
            </div>
          </div>
          <div className="flex flex-col gap-3">
            <Label htmlFor="reviewer">Reviewer</Label>
            <Select defaultValue={item.reviewer}>
              <SelectTrigger id="reviewer" className="w-full">
                <SelectValue placeholder="Select a reviewer" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="Reviewer 1">Reviewer 1</SelectItem>
                  <SelectItem value="Reviewer 2">Reviewer 2</SelectItem>
                  <SelectItem value="Reviewer 3">Reviewer 3</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        </form>
      </div>
      <DrawerFooter>
        <Button type="button">Submit</Button>
        <DrawerClose asChild>
          <Button variant="outline">Done</Button>
        </DrawerClose>
      </DrawerFooter>
    </>
  )
}

export function ChangeDetailDrawerWithTrigger({
  item,
  children,
}: {
  item: DocumentChange
  children: React.ReactNode
}) {
  const isMobile = useIsMobile()

  return (
    <Drawer direction={isMobile ? "bottom" : "right"}>
      <DrawerTrigger asChild>{children}</DrawerTrigger>
      <DrawerContent>
        <ChangeDetailDrawerPanel item={item} />
      </DrawerContent>
    </Drawer>
  )
}

export function ChangeDetailDrawerControlled({
  item,
  open,
  onOpenChange,
}: {
  item: DocumentChange | null
  open: boolean
  onOpenChange: (open: boolean) => void
}) {
  const isMobile = useIsMobile()

  return (
    <Drawer
      direction={isMobile ? "bottom" : "right"}
      open={open}
      onOpenChange={onOpenChange}
    >
      <DrawerContent>
        {item ? (
          <ChangeDetailDrawerPanel key={item.id} item={item} />
        ) : null}
      </DrawerContent>
    </Drawer>
  )
}
