"use client"

import { useState } from "react"
import type { Table } from "@tanstack/react-table"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { Columns3, Eye, EyeOff, RotateCcw, Trash2, Save, Clock } from "lucide-react"

interface ColumnVisibilityToggleProps<T> {
  table: Table<T>
  hideableColumns?: string[]
  onResetToDefault?: () => void
  onClearSavedSettings?: () => void
  savedSettingsInfo?: {
    hasSavedSettings: boolean
    lastSaved: Date | null
    version: string | null
  }
}

export function ColumnVisibilityToggle<T>({
  table,
  hideableColumns,
  onResetToDefault,
  onClearSavedSettings,
  savedSettingsInfo,
}: ColumnVisibilityToggleProps<T>) {
  const [isOpen, setIsOpen] = useState(false)

  const allColumns = table.getAllColumns().filter((column) => column.getCanHide())

  // Filter columns based on hideable configuration
  const toggleableColumns = hideableColumns
    ? allColumns.filter((column) => hideableColumns.includes(column.id))
    : allColumns

  const hiddenCount = toggleableColumns.filter((column) => !column.getIsVisible()).length
  const visibleCount = toggleableColumns.length - hiddenCount

  const handleToggleAll = (checked: boolean) => {
    toggleableColumns.forEach((column) => {
      column.toggleVisibility(checked)
    })
  }

  const formatLastSaved = (date: Date | null) => {
    if (!date) return ""
    const now = new Date()
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60))

    if (diffInMinutes < 1) return "Just now"
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`
    return date.toLocaleDateString()
  }

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="ml-auto bg-transparent relative">
          <Columns3 className="w-4 h-4 mr-2" />
          Columns
          {hiddenCount > 0 && (
            <Badge variant="secondary" className="ml-2 h-5 px-1.5 text-xs">
              {visibleCount}/{toggleableColumns.length}
            </Badge>
          )}
          {savedSettingsInfo?.hasSavedSettings && (
            <div className="absolute -top-1 -right-1 w-2 h-2 bg-blue-500 rounded-full" />
          )}
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-64">
        <DropdownMenuLabel className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span>Toggle Columns</span>
            {savedSettingsInfo?.hasSavedSettings && <Save className="w-3 h-3 text-blue-500"  />}
          </div>
          <div className="flex items-center gap-1">
            <Button variant="ghost" size="sm" className="h-6 px-2 text-xs" onClick={() => handleToggleAll(true)}>
              <Eye className="w-3 h-3 mr-1" />
              All
            </Button>
            <Button variant="ghost" size="sm" className="h-6 px-2 text-xs" onClick={() => handleToggleAll(false)}>
              <EyeOff className="w-3 h-3 mr-1" />
              None
            </Button>
          </div>
        </DropdownMenuLabel>

        {savedSettingsInfo?.hasSavedSettings && savedSettingsInfo.lastSaved && (
          <>
            <div className="px-2 py-1">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Clock className="w-3 h-3" />
                <span>Saved {formatLastSaved(savedSettingsInfo.lastSaved)}</span>
              </div>
            </div>
            <DropdownMenuSeparator />
          </>
        )}

        <div className="max-h-64 overflow-y-auto">
          {toggleableColumns.map((column) => {
            const columnName = typeof column.columnDef.header === "string" ? column.columnDef.header : column.id

            return (
              <DropdownMenuCheckboxItem
                key={column.id}
                className="capitalize"
                checked={column.getIsVisible()}
                onCheckedChange={(value) => column.toggleVisibility(!!value)}
              >
                <div className="flex items-center justify-between w-full">
                  <span>{columnName}</span>
                  {!column.getIsVisible() && <EyeOff className="w-3 h-3 text-muted-foreground" />}
                </div>
              </DropdownMenuCheckboxItem>
            )
          })}
        </div>

        <DropdownMenuSeparator />

        <div className="p-2 space-y-1">
          {onResetToDefault && (
            <Button
              variant="ghost"
              size="sm"
              className="w-full justify-start text-xs"
              onClick={() => {
                onResetToDefault()
                setIsOpen(false)
              }}
            >
              <RotateCcw className="w-3 h-3 mr-2" />
              Reset to Default
            </Button>
          )}

          {onClearSavedSettings && savedSettingsInfo?.hasSavedSettings && (
            <Button
              variant="ghost"
              size="sm"
              className="w-full justify-start text-xs text-destructive hover:text-destructive"
              onClick={() => {
                if (confirm("Are you sure you want to clear all saved column settings?")) {
                  onClearSavedSettings()
                  setIsOpen(false)
                }
              }}
            >
              <Trash2 className="w-3 h-3 mr-2" />
              Clear Saved Settings
            </Button>
          )}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
