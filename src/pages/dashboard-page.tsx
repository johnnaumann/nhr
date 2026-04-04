import type { CSSProperties } from 'react'

import data from '@/app/dashboard/data.json'
import { AppSidebar } from '@/components/app-sidebar'
import { ChartAreaInteractive } from '@/components/chart-area-interactive'
import { ChartCoderPerformance } from '@/components/chart-coder-performance'
import { ChartRequiredChanges } from '@/components/chart-required-changes'
import { ChartSection } from '@/components/chart-section'
import { DashboardDateRangeToolbar } from '@/components/dashboard-date-range-toolbar'
import { DataTable } from '@/components/data-table'
import { SectionCards } from '@/components/section-cards'
import { SiteHeader } from '@/components/site-header'
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar'
import { DashboardDateRangeProvider } from '@/contexts/dashboard-date-range-context'
import { DashboardInstitutionsProvider } from '@/contexts/dashboard-institutions-context'

export function DashboardPage() {
  return (
    <SidebarProvider
      style={
        {
          '--sidebar-width': 'calc(var(--spacing) * 72)',
          '--header-height': 'calc(var(--spacing) * 12)',
        } as CSSProperties
      }
    >
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader />
        <div className="flex flex-1 flex-col">
          <DashboardDateRangeProvider>
            <DashboardInstitutionsProvider>
            <div className="@container/main flex flex-1 flex-col gap-2">
              <div className="flex flex-col gap-4 pt-0 pb-4 md:gap-6 md:pb-6">
                <DashboardDateRangeToolbar />
                <SectionCards />
                <div className="px-4 lg:px-6">
                  <ChartAreaInteractive />
                </div>
                <div className="px-4 lg:px-6">
                  <ChartSection />
                </div>
                <div className="px-4 lg:px-6">
                  <ChartRequiredChanges />
                </div>
                <div className="px-4 lg:px-6">
                  <ChartCoderPerformance />
                </div>
                <DataTable data={data} />
              </div>
            </div>
            </DashboardInstitutionsProvider>
          </DashboardDateRangeProvider>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
