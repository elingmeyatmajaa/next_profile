"use client"

import type React from "react"

import { flexRender, getCoreRowModel, getSortedRowModel, useReactTable, type SortingState } from "@tanstack/react-table"
import { useState, useCallback, useMemo } from "react"
import { useDebounce } from "@/hooks/use-debounce"
import { useDataTable } from "@/hooks/use-datatable"
import { useColumnVisibility } from "@/hooks/use-column-visibility"
import type { DataTableProps } from "@/types/datatable"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ColumnVisibilityToggle } from "@/components/column-visibility-toggle"

import { Search, ArrowUpDown, ArrowUp, ArrowDown, Loader2, RefreshCw, AlertCircle, Database } from "lucide-react"
import { ParameterControls } from "./parameter-controls"
import { useDataTableParameters } from "@/hooks/use-datatable-parameters"

export function DataTable<T = any>({
  config,
  className = "",
  onRowClick,
  searchPlaceholder = "Search...",
  emptyMessage = "No data available",
}: DataTableProps<T>) {
  const [sorting, setSorting] = useState<SortingState>([])
  const [globalFilter, setGlobalFilter] = useState("")
  const debouncedGlobalFilter = useDebounce(globalFilter, 300)

  // Generate unique table ID for localStorage
  const tableId = useMemo(() => {
    return config.columnVisibility?.tableId || `table-${config.endpoint.replace(/[^a-zA-Z0-9]/g, "-")}`
  }, [config.columnVisibility?.tableId, config.endpoint])

  // Use column visibility hook with localStorage persistence
  const { columnVisibility, setColumnVisibility, isLoaded, resetToDefault, clearSavedSettings, getSavedSettingsInfo } =
    useColumnVisibility({
      tableId,
      defaultHidden: config.columnVisibility?.defaultHidden || [],
      enabled: config.columnVisibility?.enabled !== false && config.columnVisibility?.persistSettings !== false,
    })

  // Use parameters hook
  const {
    parameterValues,
    updateParameter,
    resetParameters,
    clearSavedParameters,
    isLoaded: parametersLoaded,
  } = useDataTableParameters({
    parameters: config.parameters || [],
    tableId,
    persistSettings: true,
  })

  const savedSettingsInfo = getSavedSettingsInfo()

  const { data, totalCount, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading, isError, error, refetch } =
    useDataTable<T>({
      endpoint: config.endpoint,
      pageSize: config.pageSize || 20,
      sorting,
      globalFilter: debouncedGlobalFilter,
      parameters: parameterValues,
    })

  const table = useReactTable({
    data,
    columns: config.columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onSortingChange: setSorting,
    onColumnVisibilityChange: setColumnVisibility,
    state: {
      sorting,
      globalFilter: debouncedGlobalFilter,
      columnVisibility,
    },
    manualSorting: true,
    manualFiltering: true,
  })

  // Infinite scroll handler
  const handleScroll = useCallback(
    (e: React.UIEvent<HTMLDivElement>) => {
      const { scrollTop, scrollHeight, clientHeight } = e.currentTarget
      const isNearBottom = scrollTop + clientHeight >= scrollHeight - 100

      if (isNearBottom && hasNextPage && !isFetchingNextPage) {
        fetchNextPage()
      }
    },
    [fetchNextPage, hasNextPage, isFetchingNextPage],
  )

  const LoadingSkeleton = () => (
    <div className="space-y-3">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="flex space-x-4">
          {table.getVisibleLeafColumns().map((_, j) => (
            <Skeleton key={j} className="h-12 flex-1" />
          ))}
        </div>
      ))}
    </div>
  )

  const getSortIcon = (column: any) => {
    const sorted = column.getIsSorted()
    if (sorted === "asc") return <ArrowUp className="w-4 h-4" />
    if (sorted === "desc") return <ArrowDown className="w-4 h-4" />
    return <ArrowUpDown className="w-4 h-4" />
  }

  // Calculate visible columns count for display
  const visibleColumnsCount = table.getVisibleLeafColumns().length
  const totalColumnsCount = config.columns.length
  const hiddenColumnsCount = totalColumnsCount - visibleColumnsCount

  // Don't render until both column visibility and parameters are loaded
  if ((!isLoaded && config.columnVisibility?.enabled !== false) || (!parametersLoaded && config.parameters?.length)) {
    return (
      <Card className={className}>
        <CardContent className="pt-6">
          <div className="flex items-center justify-center h-32">
            <Loader2 className="w-6 h-6 animate-spin" />
          </div>
        </CardContent>
      </Card>
    )
  }

  if (isError) {
    return (
      <Card className={className}>
        <CardContent className="pt-6">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Failed to load data. {error?.message}
              <Button variant="outline" size="sm" onClick={() => refetch()} className="ml-2">
                <RefreshCw className="w-4 h-4 mr-2" />
                Retry
              </Button>
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Parameter Controls */}
      {config.parameters && config.parameters.length > 0 && (
        <ParameterControls
          parameters={config.parameters}
          values={parameterValues}
          onValueChange={updateParameter}
          onReset={resetParameters}
          onClearSaved={clearSavedParameters}
        />
      )}

      {/* Main Data Table */}
      <Card>
        <CardHeader className="pb-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-2">
              <Database className="w-5 h-5 text-muted-foreground" />
              <CardTitle className="text-lg">Data Table</CardTitle>
              <Badge variant="secondary" className="ml-2">
                {totalCount.toLocaleString()} records
              </Badge>
              {hiddenColumnsCount > 0 && (
                <Badge variant="outline" className="ml-1">
                  {hiddenColumnsCount} hidden
                </Badge>
              )}
              {savedSettingsInfo.hasSavedSettings && (
                <Badge variant="outline" className="ml-1 text-blue-600 border-blue-200">
                  Settings saved
                </Badge>
              )}
            </div>

            <div className="flex items-center gap-2">
              {config.searchable !== false && (
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder={searchPlaceholder}
                    value={globalFilter}
                    onChange={(e) => setGlobalFilter(e.target.value)}
                    className="pl-10 w-64"
                  />
                </div>
              )}

              {config.columnVisibility?.enabled !== false && (
                <ColumnVisibilityToggle
                  table={table}
                  hideableColumns={config.columnVisibility?.hideable}
                  onResetToDefault={resetToDefault}
                  onClearSavedSettings={clearSavedSettings}
                  savedSettingsInfo={savedSettingsInfo}
                />
              )}

              <Button variant="outline" size="sm" onClick={() => refetch()}>
                <RefreshCw className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <div className="rounded-md border">
            <div className="max-h-[600px] overflow-auto" onScroll={handleScroll}>
              <Table>
                <TableHeader className="sticky top-0 bg-background z-10">
                  {table.getHeaderGroups().map((headerGroup) => (
                    <TableRow key={headerGroup.id}>
                      {headerGroup.headers.map((header) => (
                        <TableHead key={header.id} className="font-semibold">
                          {header.isPlaceholder ? null : (
                            <div
                              className={`flex items-center gap-2 ${
                                header.column.getCanSort() && config.sortable !== false
                                  ? "cursor-pointer select-none hover:text-foreground"
                                  : ""
                              }`}
                              onClick={
                                header.column.getCanSort() && config.sortable !== false
                                  ? header.column.getToggleSortingHandler()
                                  : undefined
                              }
                            >
                              {flexRender(header.column.columnDef.header, header.getContext())}
                              {header.column.getCanSort() && config.sortable !== false && (
                                <span className="text-muted-foreground">{getSortIcon(header.column)}</span>
                              )}
                            </div>
                          )}
                        </TableHead>
                      ))}
                      {config.actions && config.actions.length > 0 && (
                        <TableHead className="w-[100px]">Actions</TableHead>
                      )}
                    </TableRow>
                  ))}
                </TableHeader>

                <TableBody>
                  {isLoading ? (
                    <TableRow>
                      <TableCell colSpan={visibleColumnsCount + (config.actions ? 1 : 0)}>
                        <LoadingSkeleton />
                      </TableCell>
                    </TableRow>
                  ) : data.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={visibleColumnsCount + (config.actions ? 1 : 0)}
                        className="h-24 text-center text-muted-foreground"
                      >
                        {emptyMessage}
                      </TableCell>
                    </TableRow>
                  ) : (
                    table.getRowModel().rows.map((row) => (
                      <TableRow
                        key={row.id}
                        className={onRowClick ? "cursor-pointer hover:bg-muted/50" : ""}
                        onClick={() => onRowClick?.(row.original)}
                      >
                        {row.getVisibleCells().map((cell) => (
                          <TableCell key={cell.id}>
                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                          </TableCell>
                        ))}
                        {config.actions && config.actions.length > 0 && (
                          <TableCell>
                            <div className="flex items-center gap-1">
                              {config.actions.map((action, index) => (
                                <Button
                                  key={index}
                                  variant={action.variant || "ghost"}
                                  size="sm"
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    action.onClick(row.original, refetch)
                                    
                                  }}
                                  disabled={action.disabled?.(row.original)}
                                  className="h-8 w-8 p-0"
                                >
                                  {action.icon && <action.icon className="w-4 h-4" />}
                                </Button>
                              ))}
                            </div>
                          </TableCell>
                        )}
                      </TableRow>
                    ))
                  )}

                  {/* Loading more indicator */}
                  {isFetchingNextPage && (
                    <TableRow>
                      <TableCell colSpan={visibleColumnsCount + (config.actions ? 1 : 0)} className="h-16 text-center">
                        <div className="flex items-center justify-center gap-2 text-muted-foreground">
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Loading more...
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </div>

          {/* Load more button (alternative to infinite scroll) */}
          {hasNextPage && !isFetchingNextPage && (
            <div className="flex justify-center mt-4">
              <Button variant="outline" onClick={() => fetchNextPage()}>
                Load More
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
