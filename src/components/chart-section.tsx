import * as React from "react"
import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  Pie,
  PieChart,
  PolarAngleAxis,
  PolarGrid,
  Radar,
  RadarChart,
  XAxis,
  YAxis,
  Label,
} from "recharts"
import { TrendingUpIcon } from "lucide-react"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"

// --- Revenue by Channel (Horizontal Bar Chart) ---

const revenueByChannelData = [
  { channel: "direct", revenue: 48200, fill: "var(--color-direct)" },
  { channel: "organic", revenue: 35800, fill: "var(--color-organic)" },
  { channel: "referral", revenue: 21400, fill: "var(--color-referral)" },
  { channel: "social", revenue: 16900, fill: "var(--color-social)" },
  { channel: "email", revenue: 12300, fill: "var(--color-email)" },
]

const revenueByChannelConfig = {
  revenue: { label: "Revenue" },
  direct: { label: "Direct", color: "var(--chart-1)" },
  organic: { label: "Organic Search", color: "var(--chart-2)" },
  referral: { label: "Referral", color: "var(--chart-3)" },
  social: { label: "Social Media", color: "var(--chart-4)" },
  email: { label: "Email", color: "var(--chart-5)" },
} satisfies ChartConfig

function ChartRevenueByChannel() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Revenue by Channel</CardTitle>
        <CardDescription>Acquisition source breakdown — Q1 2025</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={revenueByChannelConfig}>
          <BarChart
            accessibilityLayer
            data={revenueByChannelData}
            layout="vertical"
            margin={{ left: 0 }}
          >
            <YAxis
              dataKey="channel"
              type="category"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) =>
                revenueByChannelConfig[value as keyof typeof revenueByChannelConfig]?.label ?? value
              }
            />
            <XAxis dataKey="revenue" type="number" hide />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Bar dataKey="revenue" radius={5} />
          </BarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 leading-none font-medium">
          Direct traffic leads at 35.8% <TrendingUpIcon className="size-4" />
        </div>
        <div className="leading-none text-muted-foreground">
          Total revenue across all channels: $134,600
        </div>
      </CardFooter>
    </Card>
  )
}

// --- Traffic Sources (Donut Chart with Center Text) ---

const trafficSourceData = [
  { source: "organic", sessions: 42800, fill: "var(--color-organic)" },
  { source: "direct", sessions: 31200, fill: "var(--color-direct)" },
  { source: "social", sessions: 18600, fill: "var(--color-social)" },
  { source: "referral", sessions: 12400, fill: "var(--color-referral)" },
  { source: "paid", sessions: 9800, fill: "var(--color-paid)" },
]

const trafficSourceConfig = {
  sessions: { label: "Sessions" },
  organic: { label: "Organic", color: "var(--chart-1)" },
  direct: { label: "Direct", color: "var(--chart-2)" },
  social: { label: "Social", color: "var(--chart-3)" },
  referral: { label: "Referral", color: "var(--chart-4)" },
  paid: { label: "Paid Ads", color: "var(--chart-5)" },
} satisfies ChartConfig

function ChartTrafficSources() {
  const totalSessions = React.useMemo(
    () => trafficSourceData.reduce((acc, curr) => acc + curr.sessions, 0),
    []
  )

  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle>Traffic Sources</CardTitle>
        <CardDescription>Session distribution — March 2025</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={trafficSourceConfig}
          className="mx-auto aspect-square max-h-[250px]"
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie
              data={trafficSourceData}
              dataKey="sessions"
              nameKey="source"
              innerRadius={60}
              strokeWidth={5}
            >
              <Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    return (
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor="middle"
                        dominantBaseline="middle"
                      >
                        <tspan
                          x={viewBox.cx}
                          y={viewBox.cy}
                          className="fill-foreground text-3xl font-bold"
                        >
                          {(totalSessions / 1000).toFixed(1)}k
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 24}
                          className="fill-muted-foreground"
                        >
                          Sessions
                        </tspan>
                      </text>
                    )
                  }
                }}
              />
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm">
        <div className="flex items-center gap-2 leading-none font-medium">
          Organic traffic up 8.3% this month <TrendingUpIcon className="size-4" />
        </div>
        <div className="leading-none text-muted-foreground">
          Paid acquisition cost down 12% vs. last quarter
        </div>
      </CardFooter>
    </Card>
  )
}

// --- Conversion Rate (Line Chart with Dots) ---

const conversionData = [
  { month: "October", rate: 2.8, previous: 2.4 },
  { month: "November", rate: 3.1, previous: 2.6 },
  { month: "December", rate: 2.6, previous: 2.9 },
  { month: "January", rate: 3.4, previous: 2.7 },
  { month: "February", rate: 3.8, previous: 3.0 },
  { month: "March", rate: 4.2, previous: 3.1 },
]

const conversionConfig = {
  rate: { label: "This Period", color: "var(--chart-1)" },
  previous: { label: "Previous Period", color: "var(--chart-4)" },
} satisfies ChartConfig

function ChartConversionRate() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Conversion Rate</CardTitle>
        <CardDescription>6-month trend vs. previous period</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={conversionConfig}>
          <LineChart
            accessibilityLayer
            data={conversionData}
            margin={{ left: 12, right: 12 }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent />}
            />
            <Line
              dataKey="previous"
              type="natural"
              stroke="var(--color-previous)"
              strokeWidth={2}
              strokeDasharray="5 5"
              dot={false}
            />
            <Line
              dataKey="rate"
              type="natural"
              stroke="var(--color-rate)"
              strokeWidth={2}
              dot={{ fill: "var(--color-rate)" }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 leading-none font-medium">
          Up to 4.2% in March, a 50% improvement <TrendingUpIcon className="size-4" />
        </div>
        <div className="leading-none text-muted-foreground">
          Checkout redesign contributed to +1.4pp since October
        </div>
      </CardFooter>
    </Card>
  )
}

// --- Team Performance (Radar Chart) ---

const teamPerformanceData = [
  { metric: "Response Time", engineering: 92, design: 78 },
  { metric: "Throughput", engineering: 85, design: 90 },
  { metric: "Quality", engineering: 88, design: 95 },
  { metric: "Collaboration", engineering: 76, design: 88 },
  { metric: "Innovation", engineering: 70, design: 82 },
  { metric: "Delivery", engineering: 94, design: 72 },
]

const teamPerformanceConfig = {
  engineering: { label: "Engineering", color: "var(--chart-1)" },
  design: { label: "Design", color: "var(--chart-2)" },
} satisfies ChartConfig

function ChartTeamPerformance() {
  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center">
        <CardTitle>Team Performance</CardTitle>
        <CardDescription>
          Cross-functional score comparison — Q1 2025
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-1">
        <ChartContainer
          config={teamPerformanceConfig}
          className="mx-auto aspect-square max-h-[250px]"
        >
          <RadarChart
            data={teamPerformanceData}
            margin={{ top: -40, bottom: -10, left: 0, right: 0 }}
          >
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="line" />}
            />
            <PolarAngleAxis dataKey="metric" />
            <PolarGrid />
            <Radar
              dataKey="engineering"
              fill="var(--color-engineering)"
              fillOpacity={0.6}
            />
            <Radar dataKey="design" fill="var(--color-design)" />
            <ChartLegend className="mt-8" content={<ChartLegendContent />} />
          </RadarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col gap-2 pt-4 text-sm">
        <div className="flex items-center gap-2 leading-none font-medium">
          Engineering delivery score highest at 94 <TrendingUpIcon className="size-4" />
        </div>
        <div className="flex items-center gap-2 leading-none text-muted-foreground">
          Design leads in quality and collaboration
        </div>
      </CardFooter>
    </Card>
  )
}

// --- Exported Section ---

export function ChartSection() {
  return (
    <div className="grid grid-cols-1 gap-4 px-4 lg:grid-cols-2 lg:px-6">
      <ChartRevenueByChannel />
      <ChartTrafficSources />
      <ChartConversionRate />
      <ChartTeamPerformance />
    </div>
  )
}
