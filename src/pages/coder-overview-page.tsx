import type { CSSProperties } from "react"

import { AppSidebar } from "@/components/app-sidebar"
import { CoderOverviewTables } from "@/components/coder-overview-tables"
import { SiteHeader } from "@/components/site-header"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"

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
        <div
          className="flex flex-1 flex-col px-4 py-4 md:px-6 md:py-6"
          aria-label="Coder overview"
        >
          <CoderOverviewTables />
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
