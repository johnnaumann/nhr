import type { CSSProperties } from "react"

import { AppSidebar } from "@/components/app-sidebar"
import { CoderTrendsDimensionNav } from "@/components/coder-trends-dimension-nav"
import { CoderTrendsTables } from "@/components/coder-trends-tables"
import { DashboardDateRangeToolbar } from "@/components/dashboard-date-range-toolbar"
import { SiteHeader } from "@/components/site-header"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { DashboardDateRangeProvider } from "@/contexts/dashboard-date-range-context"
import { DashboardInstitutionsProvider } from "@/contexts/dashboard-institutions-context"

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
                <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
                  <DashboardDateRangeToolbar
                    description="Choose the reporting window and which sites to include. Coder trend cohorts use the same controls as the dashboard and coder overview (demo data is static)."
                    extension={<CoderTrendsDimensionNav />}
                  />
                  <div className="px-4 lg:px-6">
                    <CoderTrendsTables />
                  </div>
                </div>
              </div>
            </DashboardInstitutionsProvider>
          </DashboardDateRangeProvider>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
