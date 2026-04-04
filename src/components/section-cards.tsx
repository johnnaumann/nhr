"use client"

import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  dashboardCardBlockGapClass,
  dashboardGridGapClass,
  dashboardMainGutterClass,
} from "@/lib/dashboard-layout"
import { cn } from "@/lib/utils"
import { TrendingUpIcon, TrendingDownIcon } from "lucide-react"

export function SectionCards() {
  return (
    <div
      className={cn(
        "grid grid-cols-1 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card *:data-[slot=card]:shadow-xs @xl/main:grid-cols-2 @5xl/main:grid-cols-4 dark:*:data-[slot=card]:bg-card",
        dashboardMainGutterClass,
        dashboardGridGapClass,
      )}
    >
      <Card className={cn("@container/card", dashboardCardBlockGapClass)}>
        <CardHeader>
          <CardDescription>Missed Revenue Identified</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            $23.6M
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              <TrendingUpIcon />
              +12.5%
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Positive revenue opportunity{" "}
            <TrendingUpIcon className="size-4" />
          </div>
          <div className="text-muted-foreground">
            Missed positive revenue identified
          </div>
        </CardFooter>
      </Card>
      <Card className={cn("@container/card", dashboardCardBlockGapClass)}>
        <CardHeader>
          <CardDescription>Quality Enhancement Changes</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            45
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              <TrendingDownIcon />
              -8.2%
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Coding quality cases down{" "}
            <TrendingDownIcon className="size-4" />
          </div>
          <div className="text-muted-foreground">
            Cases requiring quality enhancement
          </div>
        </CardFooter>
      </Card>
      <Card className={cn("@container/card", dashboardCardBlockGapClass)}>
        <CardHeader>
          <CardDescription>Flagged for Compliance</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            156
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              <TrendingDownIcon />
              -14.3%
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Compliance flags decreasing{" "}
            <TrendingDownIcon className="size-4" />
          </div>
          <div className="text-muted-foreground">
            Cases flagged for compliance review
          </div>
        </CardFooter>
      </Card>
      <Card className={cn("@container/card", dashboardCardBlockGapClass)}>
        <CardHeader>
          <CardDescription>Pending Decisions</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            72
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              <TrendingUpIcon />
              +5.1%
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            53 of 156 cases had changes{" "}
            <TrendingUpIcon className="size-4" />
          </div>
          <div className="text-muted-foreground">
            Decisions awaiting review
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}
