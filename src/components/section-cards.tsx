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
import { TrendingDownIcon, TrendingUpIcon } from "lucide-react"

const SUMMARY_CARDS = [
  {
    label: "Missed revenue identified",
    value: "$23.6M",
    changeLabel: "+12.5%",
    trend: "up" as const,
    caption: "Beats prior quarter — DRG & add-on lift",
  },
  {
    label: "Quality enhancement cases",
    value: "45",
    changeLabel: "-8.2%",
    trend: "down" as const,
    caption: "Down vs last period after coder coaching",
  },
  {
    label: "Compliance flags",
    value: "156",
    changeLabel: "-14.3%",
    trend: "down" as const,
    caption: "Fewer flags; legacy audit backlog cleared",
  },
  {
    label: "Pending decisions",
    value: "72",
    changeLabel: "+5.1%",
    trend: "up" as const,
    caption: "Queue up — network & benefits changes",
  },
]

const trendBadgeClass = {
  up: "border-emerald-500/35 bg-emerald-500/10 text-emerald-800 dark:border-emerald-500/45 dark:bg-emerald-500/15 dark:text-emerald-300",
  down:
    "border-rose-500/35 bg-rose-500/10 text-rose-800 dark:border-rose-500/45 dark:bg-rose-500/15 dark:text-rose-300",
} as const

const trendIconClass = {
  up: "text-emerald-600 dark:text-emerald-400",
  down: "text-rose-600 dark:text-rose-400",
} as const

export function SectionCards() {
  return (
    <div
      className={cn(
        "grid grid-cols-1 *:data-[slot=card]:shadow-xs @xl/main:grid-cols-2 @5xl/main:grid-cols-4",
        dashboardMainGutterClass,
        dashboardGridGapClass,
      )}
    >
      {SUMMARY_CARDS.map((card) => {
        const TrendIcon = card.trend === "up" ? TrendingUpIcon : TrendingDownIcon
        return (
          <Card
            key={card.label}
            className={cn("@container/card", dashboardCardBlockGapClass)}
          >
            <CardHeader>
              <CardDescription>{card.label}</CardDescription>
              <CardTitle className="text-3xl font-semibold tabular-nums tracking-tight @[250px]/card:text-4xl @[380px]/card:text-5xl">
                {card.value}
              </CardTitle>
              <CardAction>
                <Badge
                  variant="outline"
                  className={cn("border font-medium", trendBadgeClass[card.trend])}
                >
                  <TrendIcon />
                  {card.changeLabel}
                </Badge>
              </CardAction>
            </CardHeader>
            <CardFooter className="text-sm">
              <div
                className={cn(
                  "flex min-w-0 items-center gap-2 font-medium",
                  trendIconClass[card.trend],
                )}
              >
                <TrendIcon className="size-4 shrink-0" aria-hidden />
                <span className="min-w-0 truncate">{card.caption}</span>
              </div>
            </CardFooter>
          </Card>
        )
      })}
    </div>
  )
}
