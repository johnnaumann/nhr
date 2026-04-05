import type { CSSProperties } from "react"

import { AppSidebar } from "@/components/app-sidebar"
import { CoderOverviewToolbarActions } from "@/components/coder-overview-toolbar-actions"
import { CoderTrendsDimensionNav } from "@/components/coder-trends-dimension-nav"
import { CoderTrendsTables } from "@/components/coder-trends-tables"
import { DashboardDateRangeToolbar } from "@/components/dashboard-date-range-toolbar"
import { SiteHeader } from "@/components/site-header"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { CoderOverviewTableToolbarProvider } from "@/contexts/coder-overview-table-toolbar-context"
import { CoderTrendsDimensionProvider } from "@/contexts/coder-trends-dimension-context"
import { DashboardDateRangeProvider } from "@/contexts/dashboard-date-range-context"
import { DashboardInstitutionsProvider } from "@/contexts/dashboard-institutions-context"
import {
  dashboardMainGutterClass,
  dashboardSectionStackClass,
} from "@/lib/dashboard-layout"
import { cn } from "@/lib/utils"

export function CoderTrendsPage() {
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
              <CoderTrendsDimensionProvider>
                <CoderOverviewTableToolbarProvider>
                  <div
                    className="@container/main flex flex-1 flex-col gap-2"
                    aria-label="Coder trends"
                    style={
                      {
                        "--stacked-section-scroll-margin":
                          "calc(var(--header-height) + 13rem)",
                      } as CSSProperties
                    }
                  >
                    <div
                      className={cn(
                        "flex flex-col pt-0 pb-4 md:pb-6",
                        dashboardSectionStackClass,
                      )}
                    >
                      <DashboardDateRangeToolbar
                        extension={<CoderTrendsDimensionNav />}
                        trailing={<CoderOverviewToolbarActions />}
                      />
                      <div className={dashboardMainGutterClass}>
                        <CoderTrendsTables />
                      </div>
                    </div>
                  </div>
                </CoderOverviewTableToolbarProvider>
              </CoderTrendsDimensionProvider>
            </DashboardInstitutionsProvider>
          </DashboardDateRangeProvider>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
