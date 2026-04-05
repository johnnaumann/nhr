"use client"

import { toast } from "sonner"
import {
  ChevronDownIcon,
  Columns3Icon,
  DownloadIcon,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useCoderOverviewTableToolbar } from "@/contexts/coder-overview-table-toolbar-context"
import { coderOverviewColumnMenuLabel } from "@/components/coder-overview-data-table"
import { cn } from "@/lib/utils"

export function CoderOverviewToolbarActions({
  className,
}: {
  className?: string
}) {
  const ctx = useCoderOverviewTableToolbar()
  const table = ctx?.table ?? null
  const disabled = !table

  return (
    <div
      className={cn(
        "flex h-8 shrink-0 items-center gap-2",
        className,
      )}
    >
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="default" className="h-8" disabled={disabled}>
            <Columns3Icon data-icon="inline-start" />
            Columns
            <ChevronDownIcon data-icon="inline-end" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-48">
          {table
            ? table
                .getAllColumns()
                .filter(
                  (column) =>
                    typeof column.accessorFn !== "undefined" &&
                    column.getCanHide(),
                )
                .map((column) => (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) =>
                      column.toggleVisibility(!!value)
                    }
                  >
                    {coderOverviewColumnMenuLabel(column)}
                  </DropdownMenuCheckboxItem>
                ))
            : null}
        </DropdownMenuContent>
      </DropdownMenu>
      <Button
        variant="outline"
        size="default"
        className="h-8"
        disabled={disabled}
        aria-label="Export selection"
        onClick={() => {
          if (!table) return
          const n = table.getFilteredSelectedRowModel().rows.length
          toast.promise(new Promise((resolve) => setTimeout(resolve, 800)), {
            loading: "Preparing export…",
            success:
              n > 0
                ? `Export ready for ${n} selected row(s) (demo).`
                : "Export ready (demo). Select rows to include them.",
            error: "Export failed",
          })
        }}
      >
        <DownloadIcon data-icon="inline-start" />
        <span className="hidden sm:inline">Export</span>
      </Button>
    </div>
  )
}
