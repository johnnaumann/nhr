import type { CSSProperties } from "react"
import { useParams } from "react-router-dom"
import { toast } from "sonner"
import { DownloadIcon } from "lucide-react"

import { AppSidebar } from "@/components/app-sidebar"
import { ChartCoderPerformance } from "@/components/chart-coder-performance"
import { DashboardDateRangeToolbar } from "@/components/dashboard-date-range-toolbar"
import { IndividualCoderAccuracyTable } from "@/components/individual-coder-accuracy-table"
import { IndividualCoderOverviewPanel } from "@/components/individual-coder-overview-panel"
import { IndividualCoderSectionCards } from "@/components/individual-coder-section-cards"
import {
  formatCoderSlugForDisplay,
  IndividualCoderToolbarHeading,
} from "@/components/individual-coder-toolbar-heading"
import { SiteHeader } from "@/components/site-header"
import { Button } from "@/components/ui/button"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { DashboardDateRangeProvider } from "@/contexts/dashboard-date-range-context"
import { DashboardInstitutionsProvider } from "@/contexts/dashboard-institutions-context"
import {
  dashboardMainGutterClass,
  dashboardSectionStackClass,
} from "@/lib/dashboard-layout"
import { cn } from "@/lib/utils"

function IndividualCoderExportButton() {
  return (
    <Button
      variant="outline"
      size="default"
      className="h-8 shrink-0"
      onClick={() => {
        toast.promise(new Promise((resolve) => setTimeout(resolve, 900)), {
          loading: "Preparing report…",
          success: "Export ready (demo).",
          error: "Export failed",
        })
      }}
    >
      <DownloadIcon data-icon="inline-start" />
      <span className="hidden sm:inline">Export report</span>
    </Button>
  )
}

export function IndividualCoderPage() {
  const { coderSlug } = useParams<{ coderSlug: string }>()
  const slug = coderSlug?.trim() || "coder"
  const coderDisplayName = formatCoderSlugForDisplay(slug)

  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as CSSProperties
      }
    >
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader />
        <div className="flex flex-1 flex-col">
          <DashboardDateRangeProvider>
            <DashboardInstitutionsProvider>
              <div
                className="@container/main flex flex-1 flex-col gap-2"
                aria-label={`Individual coder: ${coderDisplayName}`}
              >
                <div
                  className={cn(
                    "flex flex-col pt-0 pb-4 md:pb-6",
                    dashboardSectionStackClass,
                  )}
                >
                  <DashboardDateRangeToolbar
                    extension={
                      <IndividualCoderToolbarHeading
                        coderDisplayName={coderDisplayName}
                      />
                    }
                    trailing={<IndividualCoderExportButton />}
                  />
                  <IndividualCoderSectionCards />
                  <IndividualCoderOverviewPanel
                    coderLabel={coderDisplayName}
                    chartsReviewed={1024}
                  />
                  <div className={dashboardMainGutterClass}>
                    <ChartCoderPerformance hideChartFilters />
                  </div>
                  <IndividualCoderAccuracyTable />
                </div>
              </div>
            </DashboardInstitutionsProvider>
          </DashboardDateRangeProvider>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
