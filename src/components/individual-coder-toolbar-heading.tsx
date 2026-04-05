"use client"

import { useDashboardInstitutions } from "@/contexts/dashboard-institutions-context"
import { institutionChartConfig } from "@/lib/dashboard-institutions"
import { cn } from "@/lib/utils"

export function formatCoderSlugForDisplay(slug: string): string {
  const s = slug.trim().replace(/-/g, " ")
  if (!s) return "Coder"
  return s
    .split(/\s+/)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join(" ")
}

export function IndividualCoderToolbarHeading({
  coderDisplayName,
  className,
}: {
  coderDisplayName: string
  className?: string
}) {
  const { visibleInstitutionKeys } = useDashboardInstitutions()
  const siteLabel =
    visibleInstitutionKeys.length === 0
      ? "No sites"
      : visibleInstitutionKeys
          .map((k) => institutionChartConfig[k].label)
          .join(", ")

  return (
    <div className={cn("flex min-w-0 flex-col gap-0.5", className)}>
      <span className="truncate text-sm font-semibold leading-tight text-foreground sm:text-base">
        {coderDisplayName}
      </span>
      <span className="text-xs text-muted-foreground sm:text-sm">
        Site: {siteLabel}
      </span>
    </div>
  )
}
