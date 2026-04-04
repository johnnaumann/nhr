import * as React from "react"
import {
  closestCenter,
  DndContext,
  KeyboardSensor,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
  type UniqueIdentifier,
} from "@dnd-kit/core"
import { restrictToVerticalAxis } from "@dnd-kit/modifiers"
import {
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import {
  flexRender,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnDef,
  type ColumnFiltersState,
  type Row,
  type SortingState,
  type VisibilityState,
} from "@tanstack/react-table"
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts"
import { toast } from "sonner"
import { z } from "zod"

import { useIsMobile } from "@/hooks/use-mobile"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import { GripVerticalIcon, CircleCheckIcon, LoaderIcon, EllipsisVerticalIcon, Columns3Icon, ChevronDownIcon, PlusIcon, ChevronsLeftIcon, ChevronLeftIcon, ChevronRightIcon, ChevronsRightIcon, FileTextIcon, ClockIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

export const schema = z.object({
  id: z.number(),
  header: z.string(),
  type: z.string(),
  status: z.string(),
  target: z.string(),
  limit: z.string(),
  reviewer: z.string(),
})

// Create a separate component for the drag handle
function DragHandle({ id }: { id: number }) {
  const { attributes, listeners } = useSortable({
    id,
  })

  return (
    <Button
      {...attributes}
      {...listeners}
      variant="ghost"
      size="icon"
      className="size-7 text-muted-foreground hover:bg-transparent"
    >
      <GripVerticalIcon className="size-3 text-muted-foreground" />
      <span className="sr-only">Drag to reorder</span>
    </Button>
  )
}

const columns: ColumnDef<z.infer<typeof schema>>[] = [
  {
    id: "drag",
    header: () => null,
    cell: ({ row }) => <DragHandle id={row.original.id} />,
  },
  {
    id: "select",
    header: ({ table }) => (
      <div className="flex items-center justify-center">
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      </div>
    ),
    cell: ({ row }) => (
      <div className="flex items-center justify-center">
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select this document change"
        />
      </div>
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "header",
    header: "Change summary",
    cell: ({ row }) => {
      return <TableCellViewer item={row.original} />
    },
    enableHiding: false,
  },
  {
    accessorKey: "type",
    header: "Section Type",
    cell: ({ row }) => (
      <div className="w-32">
        <Badge variant="outline" className="px-1.5 text-muted-foreground">
          {row.original.type}
        </Badge>
      </div>
    ),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => (
      <Badge variant="outline" className="px-1.5 text-muted-foreground">
        {row.original.status === "Done" ? (
          <CircleCheckIcon className="fill-green-500 dark:fill-green-400" />
        ) : (
          <LoaderIcon
          />
        )}
        {row.original.status}
      </Badge>
    ),
  },
  {
    accessorKey: "target",
    header: () => (
      <div className="w-full text-right">Target days</div>
    ),
    cell: ({ row }) => (
      <form
        onSubmit={(e) => {
          e.preventDefault()
          toast.promise(new Promise((resolve) => setTimeout(resolve, 1000)), {
            loading: `Saving “${row.original.header}”`,
            success: "Done",
            error: "Error",
          })
        }}
      >
        <Label htmlFor={`${row.original.id}-target`} className="sr-only">
          Target days to complete this change
        </Label>
        <Input
          className="h-8 w-16 border-transparent bg-transparent text-right shadow-none hover:bg-input/30 focus-visible:border focus-visible:bg-background dark:bg-transparent dark:hover:bg-input/30 dark:focus-visible:bg-input/30"
          defaultValue={row.original.target}
          id={`${row.original.id}-target`}
        />
      </form>
    ),
  },
  {
    accessorKey: "limit",
    header: () => (
      <div className="w-full text-right">Maximum days</div>
    ),
    cell: ({ row }) => (
      <form
        onSubmit={(e) => {
          e.preventDefault()
          toast.promise(new Promise((resolve) => setTimeout(resolve, 1000)), {
            loading: `Saving “${row.original.header}”`,
            success: "Done",
            error: "Error",
          })
        }}
      >
        <Label htmlFor={`${row.original.id}-limit`} className="sr-only">
          Maximum days allowed for this change
        </Label>
        <Input
          className="h-8 w-16 border-transparent bg-transparent text-right shadow-none hover:bg-input/30 focus-visible:border focus-visible:bg-background dark:bg-transparent dark:hover:bg-input/30 dark:focus-visible:bg-input/30"
          defaultValue={row.original.limit}
          id={`${row.original.id}-limit`}
        />
      </form>
    ),
  },
  {
    accessorKey: "reviewer",
    header: "Reviewer",
    cell: ({ row }) => {
      const isAssigned = row.original.reviewer !== "Assign reviewer"

      if (isAssigned) {
        return row.original.reviewer
      }

      return (
        <>
          <Label htmlFor={`${row.original.id}-reviewer`} className="sr-only">
            Reviewer
          </Label>
          <Select>
            <SelectTrigger
              className="w-38 **:data-[slot=select-value]:block **:data-[slot=select-value]:truncate"
              size="sm"
              id={`${row.original.id}-reviewer`}
            >
              <SelectValue placeholder="Assign reviewer" />
            </SelectTrigger>
            <SelectContent align="end">
              <SelectGroup>
                <SelectItem value="Reviewer 1">Reviewer 1</SelectItem>
                <SelectItem value="Reviewer 2">Reviewer 2</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </>
      )
    },
  },
  {
    id: "actions",
    cell: () => (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="flex size-8 text-muted-foreground data-[state=open]:bg-muted"
            size="icon"
          >
            <EllipsisVerticalIcon
            />
            <span className="sr-only">Open menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-32">
          <DropdownMenuItem>Edit</DropdownMenuItem>
          <DropdownMenuItem>Make a copy</DropdownMenuItem>
          <DropdownMenuItem>Favorite</DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem variant="destructive">Delete</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    ),
  },
]

function DraggableRow({ row }: { row: Row<z.infer<typeof schema>> }) {
  const { transform, transition, setNodeRef, isDragging } = useSortable({
    id: row.original.id,
  })

  return (
    <TableRow
      data-state={row.getIsSelected() && "selected"}
      data-dragging={isDragging}
      ref={setNodeRef}
      className="relative z-0 data-[dragging=true]:z-10 data-[dragging=true]:opacity-80"
      style={{
        transform: CSS.Transform.toString(transform),
        transition: transition,
      }}
    >
      {row.getVisibleCells().map((cell) => (
        <TableCell key={cell.id}>
          {flexRender(cell.column.columnDef.cell, cell.getContext())}
        </TableCell>
      ))}
    </TableRow>
  )
}

export function DataTable({
  data: initialData,
}: {
  data: z.infer<typeof schema>[]
}) {
  const [data, setData] = React.useState(() => initialData)
  const [rowSelection, setRowSelection] = React.useState({})
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({})
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  )
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [pagination, setPagination] = React.useState({
    pageIndex: 0,
    pageSize: 10,
  })
  const sortableId = React.useId()
  const sensors = useSensors(
    useSensor(MouseSensor, {}),
    useSensor(TouchSensor, {}),
    useSensor(KeyboardSensor, {})
  )

  const dataIds = React.useMemo<UniqueIdentifier[]>(
    () => data?.map(({ id }) => id) || [],
    [data]
  )

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      columnVisibility,
      rowSelection,
      columnFilters,
      pagination,
    },
    getRowId: (row) => row.id.toString(),
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
  })

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event
    if (active && over && active.id !== over.id) {
      setData((data) => {
        const oldIndex = dataIds.indexOf(active.id)
        const newIndex = dataIds.indexOf(over.id)
        return arrayMove(data, oldIndex, newIndex)
      })
    }
  }

  return (
    <Tabs
      defaultValue="outline"
      className="w-full flex-col justify-start gap-6"
    >
      <div className="flex items-center justify-between px-4 lg:px-6">
        <Label htmlFor="view-selector" className="sr-only">
          View
        </Label>
        <Select defaultValue="outline">
          <SelectTrigger
            className="flex w-fit @4xl/main:hidden"
            size="sm"
            id="view-selector"
          >
            <SelectValue placeholder="Select a view" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value="outline">Outline</SelectItem>
              <SelectItem value="past-performance">Past Performance</SelectItem>
              <SelectItem value="key-personnel">Key Personnel</SelectItem>
              <SelectItem value="focus-documents">Focus Documents</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
        <TabsList className="hidden **:data-[slot=badge]:size-5 **:data-[slot=badge]:rounded-full **:data-[slot=badge]:bg-muted-foreground/30 **:data-[slot=badge]:px-1 @4xl/main:flex">
          <TabsTrigger value="outline">Outline</TabsTrigger>
          <TabsTrigger value="past-performance">
            Past Performance <Badge variant="secondary">3</Badge>
          </TabsTrigger>
          <TabsTrigger value="key-personnel">
            Key Personnel <Badge variant="secondary">2</Badge>
          </TabsTrigger>
          <TabsTrigger value="focus-documents">Focus Documents</TabsTrigger>
        </TabsList>
        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <Columns3Icon data-icon="inline-start" />
                Columns
                <ChevronDownIcon data-icon="inline-end" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-32">
              {table
                .getAllColumns()
                .filter(
                  (column) =>
                    typeof column.accessorFn !== "undefined" &&
                    column.getCanHide()
                )
                .map((column) => {
                  return (
                    <DropdownMenuCheckboxItem
                      key={column.id}
                      className="capitalize"
                      checked={column.getIsVisible()}
                      onCheckedChange={(value) =>
                        column.toggleVisibility(!!value)
                      }
                    >
                      {column.id}
                    </DropdownMenuCheckboxItem>
                  )
                })}
            </DropdownMenuContent>
          </DropdownMenu>
          <Button variant="outline" size="sm" aria-label="Add document change">
            <PlusIcon
            />
            <span className="hidden lg:inline">Add document change</span>
          </Button>
        </div>
      </div>
      <TabsContent
        value="outline"
        className="relative flex flex-col gap-4 overflow-auto px-4 lg:px-6"
      >
        <div className="overflow-hidden rounded-lg border">
          <DndContext
            collisionDetection={closestCenter}
            modifiers={[restrictToVerticalAxis]}
            onDragEnd={handleDragEnd}
            sensors={sensors}
            id={sortableId}
          >
            <Table>
              <TableHeader className="sticky top-0 z-10 bg-muted">
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map((header) => {
                      return (
                        <TableHead key={header.id} colSpan={header.colSpan}>
                          {header.isPlaceholder
                            ? null
                            : flexRender(
                                header.column.columnDef.header,
                                header.getContext()
                              )}
                        </TableHead>
                      )
                    })}
                  </TableRow>
                ))}
              </TableHeader>
              <TableBody className="**:data-[slot=table-cell]:first:w-8">
                {table.getRowModel().rows?.length ? (
                  <SortableContext
                    items={dataIds}
                    strategy={verticalListSortingStrategy}
                  >
                    {table.getRowModel().rows.map((row) => (
                      <DraggableRow key={row.id} row={row} />
                    ))}
                  </SortableContext>
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={columns.length}
                      className="h-24 text-center"
                    >
                      No results.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </DndContext>
        </div>
        <div className="flex items-center justify-between px-4">
          <div className="hidden flex-1 text-sm text-muted-foreground lg:flex">
            {table.getFilteredSelectedRowModel().rows.length} of{" "}
            {table.getFilteredRowModel().rows.length} row(s) selected.
          </div>
          <div className="flex w-full items-center gap-8 lg:w-fit">
            <div className="hidden items-center gap-2 lg:flex">
              <Label htmlFor="rows-per-page" className="text-sm font-medium">
                Rows per page
              </Label>
              <Select
                value={`${table.getState().pagination.pageSize}`}
                onValueChange={(value) => {
                  table.setPageSize(Number(value))
                }}
              >
                <SelectTrigger size="sm" className="w-20" id="rows-per-page">
                  <SelectValue
                    placeholder={table.getState().pagination.pageSize}
                  />
                </SelectTrigger>
                <SelectContent side="top">
                  <SelectGroup>
                    {[10, 20, 30, 40, 50].map((pageSize) => (
                      <SelectItem key={pageSize} value={`${pageSize}`}>
                        {pageSize}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            <div className="flex w-fit items-center justify-center text-sm font-medium">
              Page {table.getState().pagination.pageIndex + 1} of{" "}
              {table.getPageCount()}
            </div>
            <div className="ml-auto flex items-center gap-2 lg:ml-0">
              <Button
                variant="outline"
                className="hidden h-8 w-8 p-0 lg:flex"
                onClick={() => table.setPageIndex(0)}
                disabled={!table.getCanPreviousPage()}
              >
                <span className="sr-only">Go to first page</span>
                <ChevronsLeftIcon
                />
              </Button>
              <Button
                variant="outline"
                className="size-8"
                size="icon"
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
              >
                <span className="sr-only">Go to previous page</span>
                <ChevronLeftIcon
                />
              </Button>
              <Button
                variant="outline"
                className="size-8"
                size="icon"
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
              >
                <span className="sr-only">Go to next page</span>
                <ChevronRightIcon
                />
              </Button>
              <Button
                variant="outline"
                className="hidden size-8 lg:flex"
                size="icon"
                onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                disabled={!table.getCanNextPage()}
              >
                <span className="sr-only">Go to last page</span>
                <ChevronsRightIcon
                />
              </Button>
            </div>
          </div>
        </div>
      </TabsContent>
      <TabsContent
        value="past-performance"
        className="flex flex-col gap-4 px-4 lg:px-6"
      >
        <div className="overflow-hidden rounded-lg border">
          <Table>
            <TableHeader className="bg-muted">
              <TableRow>
                <TableHead>Contract</TableHead>
                <TableHead>Period</TableHead>
                <TableHead className="text-right">Claims Processed</TableHead>
                <TableHead>Accuracy Rate</TableHead>
                <TableHead className="text-right">Avg. Turnaround</TableHead>
                <TableHead className="text-right">Value</TableHead>
                <TableHead>Rating</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {pastPerformanceData.map((row) => (
                <TableRow key={row.id}>
                  <TableCell>
                    <div className="font-medium">{row.contract}</div>
                    <div className="text-xs text-muted-foreground">
                      {row.client}
                    </div>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {row.period}
                  </TableCell>
                  <TableCell className="text-right font-medium tabular-nums">
                    {row.claimsProcessed}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-24 overflow-hidden rounded-full bg-muted">
                        <div
                          className={cn(
                            "h-full rounded-full",
                            row.accuracyRate >= 98
                              ? "bg-green-500"
                              : row.accuracyRate >= 96
                                ? "bg-yellow-500"
                                : "bg-red-500"
                          )}
                          style={{ width: `${row.accuracyRate}%` }}
                        />
                      </div>
                      <span className="text-sm tabular-nums">
                        {row.accuracyRate}%
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right tabular-nums">
                    {row.avgTurnaround} days
                  </TableCell>
                  <TableCell className="text-right font-medium">
                    {row.dollarValue}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={cn(
                        "px-1.5",
                        row.rating === "Exceptional"
                          ? "border-green-500/30 bg-green-500/10 text-green-700 dark:text-green-400"
                          : "border-yellow-500/30 bg-yellow-500/10 text-yellow-700 dark:text-yellow-400"
                      )}
                    >
                      {row.rating}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-3">
          {pastPerformanceData.map((row) => (
            <div
              key={row.id}
              className="flex flex-col gap-3 rounded-lg border p-4"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-muted-foreground">
                  Claims Mix
                </span>
                <span className="text-xs text-muted-foreground">
                  {row.client}
                </span>
              </div>
              <div className="flex h-2 w-full overflow-hidden rounded-full">
                <div
                  className="bg-[var(--chart-1)]"
                  style={{ width: `${row.categories.medical}%` }}
                />
                <div
                  className="bg-[var(--chart-2)]"
                  style={{ width: `${row.categories.pharmacy}%` }}
                />
                <div
                  className="bg-[var(--chart-3)]"
                  style={{ width: `${row.categories.behavioral}%` }}
                />
              </div>
              <div className="flex justify-between text-xs text-muted-foreground">
                <div className="flex items-center gap-1">
                  <span className="inline-block size-2 rounded-full bg-[var(--chart-1)]" />
                  Medical {row.categories.medical}%
                </div>
                <div className="flex items-center gap-1">
                  <span className="inline-block size-2 rounded-full bg-[var(--chart-2)]" />
                  Pharmacy {row.categories.pharmacy}%
                </div>
                <div className="flex items-center gap-1">
                  <span className="inline-block size-2 rounded-full bg-[var(--chart-3)]" />
                  Behavioral {row.categories.behavioral}%
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="flex flex-wrap items-center gap-4 rounded-lg border bg-muted/50 p-4">
          <div className="flex flex-col">
            <span className="text-sm font-medium">Aggregate Performance</span>
            <span className="text-xs text-muted-foreground">
              Across all 3 contracts
            </span>
          </div>
          <Separator orientation="vertical" className="hidden h-8 sm:block" />
          <div className="flex flex-col">
            <span className="text-sm font-medium tabular-nums">447,810</span>
            <span className="text-xs text-muted-foreground">Total Claims</span>
          </div>
          <Separator orientation="vertical" className="hidden h-8 sm:block" />
          <div className="flex flex-col">
            <span className="text-sm font-medium tabular-nums">97.4%</span>
            <span className="text-xs text-muted-foreground">
              Avg. Accuracy
            </span>
          </div>
          <Separator orientation="vertical" className="hidden h-8 sm:block" />
          <div className="flex flex-col">
            <span className="text-sm font-medium tabular-nums">3.97 days</span>
            <span className="text-xs text-muted-foreground">
              Avg. Turnaround
            </span>
          </div>
          <Separator orientation="vertical" className="hidden h-8 sm:block" />
          <div className="flex flex-col">
            <span className="text-sm font-medium tabular-nums">$13.1M</span>
            <span className="text-xs text-muted-foreground">Total Value</span>
          </div>
        </div>
      </TabsContent>
      <TabsContent
        value="key-personnel"
        className="flex flex-col gap-4 px-4 lg:px-6"
      >
        <div className="grid gap-4 md:grid-cols-2">
          {keyPersonnelData.map((person) => (
            <div
              key={person.id}
              className="flex flex-col gap-4 rounded-lg border p-4"
            >
              <div className="flex items-start gap-4">
                <Avatar size="lg">
                  <AvatarFallback>{person.initials}</AvatarFallback>
                </Avatar>
                <div className="min-w-0 flex-1">
                  <div className="font-medium">{person.name}</div>
                  <div className="text-sm text-muted-foreground">
                    {person.title}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {person.department}
                  </div>
                </div>
                <Badge variant="secondary" className="shrink-0 text-xs">
                  {person.yearsExperience} yrs
                </Badge>
              </div>
              <Separator />
              <div className="space-y-3">
                <div>
                  <div className="mb-1.5 text-xs font-medium text-muted-foreground">
                    Certifications
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {person.certifications.map((cert) => (
                      <Badge
                        key={cert}
                        variant="secondary"
                        className="text-xs"
                      >
                        {cert}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div>
                  <div className="mb-1.5 text-xs font-medium text-muted-foreground">
                    Specialties
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {person.specialties.map((s) => (
                      <Badge key={s} variant="outline" className="text-xs">
                        {s}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
              <Separator />
              <div>
                <div className="mb-2 text-xs font-medium">Recent Projects</div>
                <div className="overflow-hidden rounded-md border">
                  <Table>
                    <TableBody>
                      {person.recentProjects.map((proj) => (
                        <TableRow key={proj.name}>
                          <TableCell className="py-2 text-sm">
                            {proj.name}
                          </TableCell>
                          <TableCell className="py-2 text-right">
                            <Badge
                              variant="outline"
                              className={cn(
                                "px-1.5 text-xs",
                                proj.status === "Completed" &&
                                  "border-green-500/30 bg-green-500/10 text-green-700 dark:text-green-400",
                                proj.status === "In Progress" &&
                                  "border-blue-500/30 bg-blue-500/10 text-blue-700 dark:text-blue-400",
                                proj.status === "Not Started" &&
                                  "text-muted-foreground"
                              )}
                            >
                              {proj.status === "Completed" && (
                                <CircleCheckIcon className="fill-green-500 dark:fill-green-400" />
                              )}
                              {proj.status === "In Progress" && (
                                <LoaderIcon />
                              )}
                              {proj.status === "Not Started" && (
                                <ClockIcon />
                              )}
                              {proj.status}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            </div>
          ))}
        </div>
      </TabsContent>
      <TabsContent
        value="focus-documents"
        className="flex flex-col gap-4 px-4 lg:px-6"
      >
        <div className="overflow-hidden rounded-lg border">
          <Table>
            <TableHeader className="bg-muted">
              <TableRow>
                <TableHead>Document</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Priority</TableHead>
                <TableHead className="text-right">Pages</TableHead>
                <TableHead>Last Reviewed</TableHead>
                <TableHead>Compliance Deadline</TableHead>
                <TableHead>Owner</TableHead>
                <TableHead className="text-right">Version</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {focusDocumentsData.map((doc) => (
                <TableRow key={doc.id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <FileTextIcon className="size-4 shrink-0 text-muted-foreground" />
                      <span className="font-medium">{doc.name}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className="px-1.5 text-muted-foreground"
                    >
                      {doc.category}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={cn(
                        "px-1.5",
                        doc.status === "Approved" &&
                          "border-green-500/30 bg-green-500/10 text-green-700 dark:text-green-400",
                        doc.status === "Under Review" &&
                          "border-yellow-500/30 bg-yellow-500/10 text-yellow-700 dark:text-yellow-400",
                        doc.status === "Pending Update" &&
                          "border-orange-500/30 bg-orange-500/10 text-orange-700 dark:text-orange-400",
                        doc.status === "Draft" && "text-muted-foreground"
                      )}
                    >
                      {doc.status === "Approved" && (
                        <CircleCheckIcon className="fill-green-500 dark:fill-green-400" />
                      )}
                      {(doc.status === "Under Review" ||
                        doc.status === "Pending Update") && <LoaderIcon />}
                      {doc.status === "Draft" && <ClockIcon />}
                      {doc.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        doc.priority === "Critical" ? "destructive" : "outline"
                      }
                      className={cn(
                        "px-1.5",
                        doc.priority === "High" &&
                          "border-orange-500/30 bg-orange-500/10 text-orange-700 dark:text-orange-400",
                        doc.priority === "Medium" && "text-muted-foreground"
                      )}
                    >
                      {doc.priority}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right tabular-nums">
                    {doc.pages}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {doc.lastReviewed}
                  </TableCell>
                  <TableCell>
                    <span
                      className={cn(
                        "text-muted-foreground",
                        doc.complianceDeadline !== "Ongoing" &&
                          new Date(doc.complianceDeadline) <
                            new Date("2026-04-20") &&
                          "font-medium text-red-600 dark:text-red-400"
                      )}
                    >
                      {doc.complianceDeadline}
                    </span>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {doc.owner}
                  </TableCell>
                  <TableCell className="text-right">
                    <Badge variant="secondary" className="text-xs">
                      {doc.version}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        <div className="flex flex-wrap items-center gap-4 rounded-lg border bg-muted/50 p-4">
          <div className="flex flex-col">
            <span className="text-sm font-medium">Document Summary</span>
            <span className="text-xs text-muted-foreground">
              8 focus documents tracked
            </span>
          </div>
          <Separator orientation="vertical" className="hidden h-8 sm:block" />
          <div className="flex items-center gap-2">
            <span className="inline-block size-2 rounded-full bg-green-500" />
            <span className="text-sm">3 Approved</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="inline-block size-2 rounded-full bg-yellow-500" />
            <span className="text-sm">2 Under Review</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="inline-block size-2 rounded-full bg-orange-500" />
            <span className="text-sm">2 Pending Update</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="inline-block size-2 rounded-full bg-muted-foreground" />
            <span className="text-sm">1 Draft</span>
          </div>
        </div>
      </TabsContent>
    </Tabs>
  )
}

const drawerChartData = [
  { week: "Week 1", revisions: 4, reviewComments: 12 },
  { week: "Week 2", revisions: 7, reviewComments: 18 },
  { week: "Week 3", revisions: 5, reviewComments: 9 },
  { week: "Week 4", revisions: 2, reviewComments: 14 },
  { week: "Week 5", revisions: 6, reviewComments: 8 },
  { week: "Week 6", revisions: 3, reviewComments: 5 },
]

const drawerChartConfig = {
  revisions: {
    label: "Revisions",
    color: "var(--chart-1)",
  },
  reviewComments: {
    label: "Review comments",
    color: "var(--chart-5)",
  },
} satisfies ChartConfig

const pastPerformanceData = [
  {
    id: 1,
    contract: "Regional payer – Medicare Advantage (contract 1)",
    client: "Health plan region A",
    period: "Jan 2023 – Dec 2024",
    claimsProcessed: "142,850",
    accuracyRate: 98.7,
    avgTurnaround: "3.2",
    rating: "Exceptional",
    dollarValue: "$4.2M",
    categories: { medical: 62, pharmacy: 24, behavioral: 14 },
  },
  {
    id: 2,
    contract: "Regional payer – Medicaid managed care (contract 2)",
    client: "Health plan region B",
    period: "Mar 2022 – Feb 2024",
    claimsProcessed: "89,340",
    accuracyRate: 96.1,
    avgTurnaround: "4.8",
    rating: "Very Good",
    dollarValue: "$2.8M",
    categories: { medical: 71, pharmacy: 18, behavioral: 11 },
  },
  {
    id: 3,
    contract: "Regional payer – group policy admin (contract 3)",
    client: "Health plan region C",
    period: "Jul 2021 – Jun 2023",
    claimsProcessed: "215,620",
    accuracyRate: 97.4,
    avgTurnaround: "3.9",
    rating: "Exceptional",
    dollarValue: "$6.1M",
    categories: { medical: 58, pharmacy: 28, behavioral: 14 },
  },
]

const keyPersonnelData = [
  {
    id: 1,
    name: "Coder 1",
    initials: "C1",
    title: "Chief Medical Officer",
    department: "Clinical Operations",
    certifications: ["MD", "FACP", "CPHQ"],
    yearsExperience: 18,
    specialties: [
      "Utilization Management",
      "Quality Assurance",
      "Medicare Compliance",
    ],
    recentProjects: [
      { name: "CMS Star Rating Improvement", status: "Completed" },
      { name: "Prior Authorization Automation", status: "In Progress" },
      { name: "Clinical Guidelines Update", status: "In Progress" },
    ],
  },
  {
    id: 2,
    name: "Coder 2",
    initials: "C2",
    title: "VP, Claims & Benefits Administration",
    department: "Operations",
    certifications: ["CEBS", "FLMI", "ACS"],
    yearsExperience: 14,
    specialties: [
      "Claims Adjudication",
      "Benefits Design",
      "Network Management",
    ],
    recentProjects: [
      { name: "Auto-adjudication Expansion", status: "Completed" },
      { name: "Provider Network Reconfiguration", status: "In Progress" },
      { name: "EOB Template Redesign", status: "Not Started" },
    ],
  },
]

const focusDocumentsData = [
  {
    id: 1,
    name: "Summary Plan Description (SPD)",
    category: "Member Comms",
    status: "Under Review",
    priority: "High",
    lastReviewed: "Mar 12, 2026",
    complianceDeadline: "Apr 30, 2026",
    owner: "Legal & Compliance",
    version: "v4.2",
    pages: 48,
  },
  {
    id: 2,
    name: "Evidence of Coverage (EOC)",
    category: "Regulatory",
    status: "Approved",
    priority: "Critical",
    lastReviewed: "Feb 28, 2026",
    complianceDeadline: "Mar 31, 2026",
    owner: "Compliance",
    version: "v3.1",
    pages: 124,
  },
  {
    id: 3,
    name: "Provider Directory & Network Adequacy",
    category: "Network",
    status: "Pending Update",
    priority: "High",
    lastReviewed: "Jan 15, 2026",
    complianceDeadline: "May 15, 2026",
    owner: "Network Ops",
    version: "v2.8",
    pages: 67,
  },
  {
    id: 4,
    name: "Formulary & Drug List",
    category: "Pharmacy",
    status: "Approved",
    priority: "Medium",
    lastReviewed: "Mar 1, 2026",
    complianceDeadline: "Jun 30, 2026",
    owner: "Pharmacy Benefits",
    version: "v5.0",
    pages: 89,
  },
  {
    id: 5,
    name: "Utilization Management Protocols",
    category: "Clinical",
    status: "Draft",
    priority: "High",
    lastReviewed: "Feb 10, 2026",
    complianceDeadline: "Apr 15, 2026",
    owner: "Clinical Ops",
    version: "v1.3",
    pages: 34,
  },
  {
    id: 6,
    name: "Grievance & Appeals Procedures",
    category: "Compliance",
    status: "Under Review",
    priority: "Critical",
    lastReviewed: "Mar 5, 2026",
    complianceDeadline: "Apr 10, 2026",
    owner: "Member Services",
    version: "v3.7",
    pages: 28,
  },
  {
    id: 7,
    name: "HIPAA Privacy & Security Policies",
    category: "Legal",
    status: "Approved",
    priority: "Critical",
    lastReviewed: "Mar 20, 2026",
    complianceDeadline: "Ongoing",
    owner: "InfoSec",
    version: "v6.1",
    pages: 56,
  },
  {
    id: 8,
    name: "Claims Processing Manual",
    category: "Operations",
    status: "Pending Update",
    priority: "Medium",
    lastReviewed: "Dec 18, 2025",
    complianceDeadline: "May 30, 2026",
    owner: "Claims Ops",
    version: "v4.5",
    pages: 112,
  },
]

function TableCellViewer({ item }: { item: z.infer<typeof schema> }) {
  const isMobile = useIsMobile()

  return (
    <Drawer direction={isMobile ? "bottom" : "right"}>
      <DrawerTrigger asChild>
        <Button variant="link" className="w-fit px-0 text-left text-foreground">
          {item.header}
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader className="gap-1">
          <DrawerTitle>{item.header}</DrawerTitle>
          <DrawerDescription>
            Required document change: what needs updating, who is reviewing it,
            and how long it is expected to take versus the allowed window.
          </DrawerDescription>
        </DrawerHeader>
        <div className="flex flex-col gap-4 overflow-y-auto px-4 text-sm">
          {!isMobile && (
            <>
              <ChartContainer config={drawerChartConfig}>
                <AreaChart
                  accessibilityLayer
                  data={drawerChartData}
                  margin={{
                    left: 0,
                    right: 10,
                  }}
                >
                  <CartesianGrid vertical={false} />
                  <XAxis
                    dataKey="week"
                    tickLine={false}
                    axisLine={false}
                    tickMargin={8}
                    tickFormatter={(value) =>
                      (value as string).replace("Week ", "W")
                    }
                  />
                  <ChartTooltip
                    cursor={false}
                    content={
                      <ChartTooltipContent indicator="dot" showTotal />
                    }
                  />
                  <Area
                    dataKey="reviewComments"
                    type="natural"
                    fill="var(--color-reviewComments)"
                    fillOpacity={0.6}
                    stroke="var(--color-reviewComments)"
                    stackId="a"
                  />
                  <Area
                    dataKey="revisions"
                    type="natural"
                    fill="var(--color-revisions)"
                    fillOpacity={0.4}
                    stroke="var(--color-revisions)"
                    stackId="a"
                  />
                </AreaChart>
              </ChartContainer>
              <Separator />
              <div className="grid gap-2">
                <div className="flex gap-2 leading-none font-medium">
                  Review activity over the last 6 weeks
                </div>
                <div className="text-muted-foreground">
                  Tracks document revisions and reviewer comments for this
                  change. Higher comment volume may indicate sections that need
                  additional clarification before sign-off.
                </div>
              </div>
              <Separator />
            </>
          )}
          <form className="flex flex-col gap-4">
            <div className="flex flex-col gap-3">
              <Label htmlFor="header">Change summary</Label>
              <Input id="header" defaultValue={item.header} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-3">
                <Label htmlFor="type">Section type</Label>
                <Select defaultValue={item.type}>
                  <SelectTrigger id="type" className="w-full">
                    <SelectValue placeholder="Select a type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value="Benefits narrative">
                        Benefits narrative
                      </SelectItem>
                      <SelectItem value="Claims">Claims</SelectItem>
                      <SelectItem value="Compliance exhibit">
                        Compliance exhibit
                      </SelectItem>
                      <SelectItem value="Data & systems">Data & systems</SelectItem>
                      <SelectItem value="Exhibit">Exhibit</SelectItem>
                      <SelectItem value="Financial">Financial</SelectItem>
                      <SelectItem value="Legal & compliance">
                        Legal & compliance
                      </SelectItem>
                      <SelectItem value="Member communications">
                        Member communications
                      </SelectItem>
                      <SelectItem value="Member guide">Member guide</SelectItem>
                      <SelectItem value="Network & access">
                        Network & access
                      </SelectItem>
                      <SelectItem value="Operations">Operations</SelectItem>
                      <SelectItem value="Pharmacy">Pharmacy</SelectItem>
                      <SelectItem value="Planning">Planning</SelectItem>
                      <SelectItem value="Policy schedule">Policy schedule</SelectItem>
                      <SelectItem value="Research">Research</SelectItem>
                      <SelectItem value="Summary">Summary</SelectItem>
                      <SelectItem value="Utilization management">
                        Utilization management
                      </SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex flex-col gap-3">
                <Label htmlFor="status">Status</Label>
                <Select defaultValue={item.status}>
                  <SelectTrigger id="status" className="w-full">
                    <SelectValue placeholder="Select a status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value="Done">Done</SelectItem>
                      <SelectItem value="In Process">In Process</SelectItem>
                      <SelectItem value="In Progress">In Progress</SelectItem>
                      <SelectItem value="Not Started">Not Started</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-3">
                <Label htmlFor="target">Target days</Label>
                <Input
                  id="target"
                  defaultValue={item.target}
                  inputMode="numeric"
                  aria-describedby="target-hint"
                />
                <p id="target-hint" className="text-xs text-muted-foreground">
                  Working goal for completing this change (days).
                </p>
              </div>
              <div className="flex flex-col gap-3">
                <Label htmlFor="limit">Maximum days</Label>
                <Input
                  id="limit"
                  defaultValue={item.limit}
                  inputMode="numeric"
                  aria-describedby="limit-hint"
                />
                <p id="limit-hint" className="text-xs text-muted-foreground">
                  Policy or SLA ceiling; change should not exceed this many days.
                </p>
              </div>
            </div>
            <div className="flex flex-col gap-3">
              <Label htmlFor="reviewer">Reviewer</Label>
              <Select defaultValue={item.reviewer}>
                <SelectTrigger id="reviewer" className="w-full">
                  <SelectValue placeholder="Select a reviewer" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="Reviewer 1">Reviewer 1</SelectItem>
                    <SelectItem value="Reviewer 2">Reviewer 2</SelectItem>
                    <SelectItem value="Emily Whalen">Emily Whalen</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          </form>
        </div>
        <DrawerFooter>
          <Button>Submit</Button>
          <DrawerClose asChild>
            <Button variant="outline">Done</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}
