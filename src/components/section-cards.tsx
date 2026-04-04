"use client"

import NumberFlow, { useCanAnimate } from "@number-flow/react"
import * as React from "react"

import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { SectionTrendChip } from "@/components/section-trend-chip"
import { useDashboardDateRange } from "@/contexts/dashboard-date-range-context"
import { useDashboardInstitutions } from "@/contexts/dashboard-institutions-context"
import {
  dashboardGridGapClass,
  dashboardMainGutterClass,
} from "@/lib/dashboard-layout"
import { computeDashboardSummaryCards } from "@/lib/dashboard-summary-metrics"
import { cn } from "@/lib/utils"
import { TrendingDownIcon, TrendingUpIcon } from "lucide-react"

const trendIconClass = {
  up: "text-emerald-600 dark:text-emerald-400",
  down: "text-rose-600 dark:text-rose-400",
} as const

const flapTiming = {
  transformTiming: {
    duration: 720,
    easing:
      "linear(0,.005,.019,.039,.066,.096,.129,.165,.202,.24,.278,.316,.354,.39,.426,.461,.494,.526,.557,.586,.614,.64,.665,.689,.711,.731,.751,.769,.786,.802,.817,.831,.844,.856,.867,.877,.887,.896,.904,.912,.919,.925,.931,.937,.942,.947,.951,.955,.959,.962,.965,.968,.971,.973,.976,.978,.98,.981,.983,.984,.986,.987,.988,.989,.99,.991,.992,.992,.993,.994,.994,.995,.995,.996,.996,.9963,.9967,.9969,.9972,.9975,.9977,.9979,.9981,.9982,.9984,.9985,.9987,.9988,.9989,1)",
  } as EffectTiming,
  opacityTiming: { duration: 380, easing: "ease-out" } as EffectTiming,
}

export function SectionCards() {
  const { range } = useDashboardDateRange()
  const { visibleInstitutionKeys } = useDashboardInstitutions()
  const canAnimate = useCanAnimate()

  const cards = React.useMemo(
    () => computeDashboardSummaryCards(range, visibleInstitutionKeys),
    [range, visibleInstitutionKeys]
  )

  return (
    <div
      className={cn(
        "grid grid-cols-1 *:data-[slot=card]:shadow-xs @xl/main:grid-cols-2 @5xl/main:grid-cols-4",
        dashboardMainGutterClass,
        dashboardGridGapClass,
      )}
    >
      {cards.map((card) => {
        const TrendIcon = card.trend === "up" ? TrendingUpIcon : TrendingDownIcon
        return (
          <Card
            key={card.label}
            className={cn(
              "@container/card",
              // Tighter than default chart cards: avoid dashboardCardBlockGapClass (gap-4 md:gap-6).
              "gap-2 overflow-visible py-3",
            )}
          >
            <CardHeader className="relative gap-2 px-4 pb-2 pt-1">
              <CardDescription className="pe-16 @[280px]/card-header:pe-20">
                {card.label}
              </CardDescription>
              <CardTitle className="min-w-0 pe-16 leading-none @[280px]/card-header:pe-20">
                {card.kind === "moneyMillions" ? (
                  <NumberFlow
                    isolate
                    animated={canAnimate}
                    className="block text-3xl font-semibold tabular-nums tracking-tight @[250px]/card:text-4xl @[380px]/card:text-5xl"
                    value={card.value}
                    format={{
                      minimumFractionDigits: 1,
                      maximumFractionDigits: 1,
                    }}
                    prefix="$"
                    suffix="M"
                    {...flapTiming}
                  />
                ) : (
                  <NumberFlow
                    isolate
                    animated={canAnimate}
                    className="block text-3xl font-semibold tabular-nums tracking-tight @[250px]/card:text-4xl @[380px]/card:text-5xl"
                    value={card.value}
                    format={{ maximumFractionDigits: 0 }}
                    {...flapTiming}
                  />
                )}
              </CardTitle>
              {/* Absolute chip: CardAction’s 2-row grid cell was stretching and breaking inner flex. */}
              <div className="absolute end-3 top-1 z-10 w-max max-w-none sm:end-4">
                <SectionTrendChip
                  trend={card.trend}
                  changePercent={card.changePercent}
                />
              </div>
            </CardHeader>
            <CardFooter className="text-sm px-4 py-2.5">
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
