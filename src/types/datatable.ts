import type React from "react"
import type { ColumnDef, SortingState } from "@tanstack/react-table"

export type ParameterType = "boolean" | "string" | "number" | "select" | "multiselect" | "date" | "daterange"

export interface DataTableParameter {
  key: string
  label: string
  type: ParameterType
  defaultValue?: any
  options?: { label: string; value: any }[] // For select/multiselect
  placeholder?: string
  description?: string
  required?: boolean
  hidden?: boolean // Hide from UI but still send to server
}

export interface DataTableConfig<T = any> {
  endpoint: string
  columns: ColumnDef<T>[]
  pageSize?: number
  searchable?: boolean
  sortable?: boolean
  selectable?: boolean
  actions?: DataTableAction<T>[]
  parameters?: DataTableParameter[] // Dynamic parameters
  columnVisibility?: {
    enabled?: boolean
    defaultHidden?: string[]
    hideable?: string[]
    tableId?: string
    persistSettings?: boolean
  }
}

export interface DataTableAction<T = any> {
  label: string
  icon?: React.ComponentType<{ className?: string }>
  onClick: (row: T, refetch : () => void) => void
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link"
  disabled?: (row: T) => boolean
}

export interface ApiResponse<T = any> {
  data: T[]
  total: number
  current_page: number
  pageSize: number
  next_page_url: string | null
}

export interface DataTableProps<T = any> {
  config: DataTableConfig<T>
  className?: string
  onRowClick?: (row: T) => void
  searchPlaceholder?: string
  emptyMessage?: string
}

export interface UseDataTableOptions {
  endpoint: string
  pageSize: number
  sorting: SortingState
  globalFilter: string
  parameters: Record<string, any>
}
