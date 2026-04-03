"use client"

import * as React from "react"
import { endOfDay, format, startOfDay, subDays } from "date-fns"
import { CalendarIcon } from "lucide-react"
import type { DateRange } from "react-day-picker"

import { useIsMobile } from "@/hooks/use-mobile"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

export type DateRangePickerProps = {
  value: DateRange | undefined
  onValueChange: (range: DateRange | undefined) => void
  /** End anchor for quick presets and calendar cap (`disabled` after this day). Usually today. */
  referenceDate: Date
  className?: string
  align?: "start" | "center" | "end"
  placeholder?: string
}

/** `dayCount` calendar days inclusive, ending on `referenceDate` (same day as its calendar date). */
function makePresetRange(
  referenceDate: Date,
  dayCount: number
): DateRange {
  const to = endOfDay(referenceDate)
  const from = startOfDay(subDays(referenceDate, dayCount - 1))
  return { from, to }
}

export function DateRangePicker({
  value,
  onValueChange,
  referenceDate,
  className,
  align = "end",
  placeholder = "Pick a date range",
}: DateRangePickerProps) {
  const isMobile = useIsMobile()

  const presets = React.useMemo(
    () =>
      [
        { label: "Last 7 days", range: () => makePresetRange(referenceDate, 7) },
        { label: "Last 30 days", range: () => makePresetRange(referenceDate, 30) },
        { label: "Last 3 months", range: () => makePresetRange(referenceDate, 90) },
      ] as const,
    [referenceDate]
  )

  return (
    <div className={cn("grid gap-2", className)}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className={cn(
              "w-full min-w-0 justify-start text-left font-normal sm:w-[min(100%,280px)]",
              !value?.from && "text-muted-foreground"
            )}
            aria-label={placeholder}
          >
            <CalendarIcon />
            {value?.from ? (
              value.to ? (
                <>
                  {format(value.from, "MMM d, y")} –{" "}
                  {format(value.to, "MMM d, y")}
                </>
              ) : (
                format(value.from, "MMM d, y")
              )
            ) : (
              <span>{placeholder}</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align={align}>
          <div className="flex flex-col gap-2 border-b p-2">
            <p className="px-1 text-xs font-medium text-muted-foreground">
              Quick ranges
            </p>
            <div className="flex flex-wrap gap-1">
              {presets.map((p) => (
                <Button
                  key={p.label}
                  type="button"
                  variant="secondary"
                  size="xs"
                  className="rounded-md"
                  onClick={() => onValueChange(p.range())}
                >
                  {p.label}
                </Button>
              ))}
            </div>
          </div>
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={value?.from ?? referenceDate}
            selected={value}
            onSelect={onValueChange}
            numberOfMonths={isMobile ? 1 : 2}
            disabled={{ after: referenceDate }}
          />
        </PopoverContent>
      </Popover>
    </div>
  )
}
