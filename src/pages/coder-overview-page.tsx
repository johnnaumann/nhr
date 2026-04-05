import type { CSSProperties } from "react"

import { AppSidebar } from "@/components/app-sidebar"
import { CoderOverviewDimensionNav } from "@/components/coder-overview-dimension-nav"
import { CoderOverviewTables } from "@/components/coder-overview-tables"
import { CoderOverviewToolbarActions } from "@/components/coder-overview-toolbar-actions"
import { DashboardDateRangeToolbar } from "@/components/dashboard-date-range-toolbar"
import { SiteHeader } from "@/components/site-header"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { CoderOverviewDimensionProvider } from "@/contexts/coder-overview-dimension-context"
import { CoderOverviewTableToolbarProvider } from "@/contexts/coder-overview-table-toolbar-context"
import { DashboardDateRangeProvider } from "@/contexts/dashboard-date-range-context"
import { DashboardInstitutionsProvider } from "@/contexts/dashboard-institutions-context"
import {
  dashboardMainGutterClass,
  dashboardSectionStackClass,
} from "@/lib/dashboard-layout"
import { cn } from "@/lib/utils"

export function CoderOverviewPage() {
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
              <CoderOverviewDimensionProvider>
                <CoderOverviewTableToolbarProvider>
                  <div
                    className="@container/main flex flex-1 flex-col gap-2"
                    aria-label="Coder overview"
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
                        extension={<CoderOverviewDimensionNav />}
                        trailing={<CoderOverviewToolbarActions />}
                      />
                      <div className={dashboardMainGutterClass}>
                        <CoderOverviewTables />
                      </div>
                    </div>
                  </div>
                </CoderOverviewTableToolbarProvider>
              </CoderOverviewDimensionProvider>
            </DashboardInstitutionsProvider>
          </DashboardDateRangeProvider>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
