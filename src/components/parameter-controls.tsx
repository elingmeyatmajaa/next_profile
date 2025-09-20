"use client"
import { useState } from "react"
import type { DataTableParameter } from "@/types/datatable"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { Checkbox } from "@/components/ui/checkbox"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { format } from "date-fns"
import { Filter, ChevronDown, ChevronUp, RotateCcw, Trash2, CalendarIcon, X } from "lucide-react"

interface ParameterControlsProps {
  parameters: DataTableParameter[]
  values: Record<string, any>
  onValueChange: (key: string, value: any) => void
  onReset?: () => void
  onClearSaved?: () => void
  className?: string
}

export function ParameterControls({
  parameters,
  values,
  onValueChange,
  onReset,
  onClearSaved,
  className,
}: ParameterControlsProps) {
  const [isOpen, setIsOpen] = useState(false)

  // Filter out hidden parameters for UI
  const visibleParameters = parameters.filter((param) => !param.hidden)

  // Count active filters (non-default values)
  const activeFiltersCount = parameters.filter((param) => {
    const value = values[param.key]
    const defaultValue = param.defaultValue

    if (Array.isArray(value)) {
      return value.length > 0
    }
    if (typeof value === "object" && value !== null) {
      return value.start || value.end
    }
    return value !== defaultValue && value !== undefined && value !== null && value !== ""
  }).length

  const renderParameterControl = (parameter: DataTableParameter) => {
    const value = values[parameter.key]

    switch (parameter.type) {
      case "boolean":
        return (
          <div className="flex items-center space-x-2">
            <Switch
              id={parameter.key}
              checked={value || false}
              onCheckedChange={(checked) => onValueChange(parameter.key, checked)}
            />
            <Label htmlFor={parameter.key} className="text-sm font-medium">
              {parameter.label}
            </Label>
          </div>
        )

      case "string":
      case "number":
        return (
          <div className="space-y-2">
            <Label htmlFor={parameter.key} className="text-sm font-medium">
              {parameter.label}
            </Label>
            <Input
              id={parameter.key}
              type={parameter.type === "number" ? "number" : "text"}
              placeholder={parameter.placeholder}
              value={value || ""}
              onChange={(e) =>
                onValueChange(
                  parameter.key,
                  parameter.type === "number" ? Number(e.target.value) || undefined : e.target.value,
                )
              }
            />
          </div>
        )

      case "select":
        return (
          <div className="space-y-2">
            <Label className="text-sm font-medium">{parameter.label}</Label>
            <Select value={value || ""} onValueChange={(newValue) => onValueChange(parameter.key, newValue)}>
              <SelectTrigger>
                <SelectValue placeholder={parameter.placeholder || "Select option"} />
              </SelectTrigger>
              <SelectContent>
                {parameter.options?.map((option) => (
                  <SelectItem key={option.value} value={`${option.value.toString()}`}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )

      case "multiselect":
        const selectedValues = Array.isArray(value) ? value : []
        return (
          <div className="space-y-2">
            <Label className="text-sm font-medium">{parameter.label}</Label>
            <div className="space-y-2">
              {parameter.options?.map((option) => (
                <div key={option.value} className="flex items-center space-x-2">
                  <Checkbox
                    id={`${parameter.key}-${option.value}`}
                    checked={selectedValues.includes(option.value)}
                    onCheckedChange={(checked) => {
                      const newValues = checked
                        ? [...selectedValues, option.value]
                        : selectedValues.filter((v) => v !== option.value)
                      onValueChange(parameter.key, newValues)
                    }}
                  />
                  <Label htmlFor={`${parameter.key}-${option.value}`} className="text-sm">
                    {option.label}
                  </Label>
                </div>
              ))}
            </div>
            {selectedValues.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-2">
                {selectedValues.map((val) => {
                  const option = parameter.options?.find((opt) => opt.value === val)
                  return (
                    <Badge key={val} variant="secondary" className="text-xs">
                      {option?.label || val}
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-4 w-4 p-0 ml-1 hover:bg-transparent"
                        onClick={() => {
                          const newValues = selectedValues.filter((v) => v !== val)
                          onValueChange(parameter.key, newValues)
                        }}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </Badge>
                  )
                })}
              </div>
            )}
          </div>
        )

      case "date":
        return (
          <div className="space-y-2">
            <Label className="text-sm font-medium">{parameter.label}</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn("w-full justify-start text-left font-normal", !value && "text-muted-foreground")}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {value ? format(new Date(value), "PPP") : parameter.placeholder || "Pick a date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={value ? new Date(value) : undefined}
                  onSelect={(date) => onValueChange(parameter.key, date?.toISOString().split("T")[0])}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
        )

      case "daterange":
        const dateRange = value || {}
        return (
          <div className="space-y-2">
            <Label className="text-sm font-medium">{parameter.label}</Label>
            <div className="grid grid-cols-2 gap-2">
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn("justify-start text-left font-normal", !dateRange.start && "text-muted-foreground")}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {dateRange.start ? format(new Date(dateRange.start), "PP") : "Start date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={dateRange.start ? new Date(dateRange.start) : undefined}
                    onSelect={(date) =>
                      onValueChange(parameter.key, {
                        ...dateRange,
                        start: date?.toISOString().split("T")[0],
                      })
                    }
                    initialFocus
                  />
                </PopoverContent>
              </Popover>

              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn("justify-start text-left font-normal", !dateRange.end && "text-muted-foreground")}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {dateRange.end ? format(new Date(dateRange.end), "PP") : "End date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={dateRange.end ? new Date(dateRange.end) : undefined}
                    onSelect={(date) =>
                      onValueChange(parameter.key, {
                        ...dateRange,
                        end: date?.toISOString().split("T")[0],
                      })
                    }
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>
        )

      default:
        return null
    }
  }

  if (visibleParameters.length === 0) {
    return null
  }

  return (
    <Card className={className}>
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CollapsibleTrigger asChild>
          <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4" />
                <CardTitle className="text-sm">Filters</CardTitle>
                {activeFiltersCount > 0 && (
                  <Badge variant="secondary" className="h-5 px-2 text-xs">
                    {activeFiltersCount}
                  </Badge>
                )}
              </div>
              <div className="flex items-center gap-2">
                {activeFiltersCount > 0 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation()
                      onReset?.()
                    }}
                  >
                    <RotateCcw className="w-3 h-3" />
                  </Button>
                )}
                {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </div>
            </div>
          </CardHeader>
        </CollapsibleTrigger>

        <CollapsibleContent>
          <CardContent className="pt-0">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {visibleParameters.map((parameter) => (
                <div key={parameter.key} className="space-y-1">
                  {renderParameterControl(parameter)}
                  {parameter.description && <p className="text-xs text-muted-foreground">{parameter.description}</p>}
                </div>
              ))}
            </div>

            {(onReset || onClearSaved) && (
              <div className="flex justify-end gap-2 mt-4 pt-4 border-t">
                {onReset && (
                  <Button variant="outline" size="sm" onClick={onReset}>
                    <RotateCcw className="w-4 h-4 mr-2" />
                    Reset Filters
                  </Button>
                )}
                {onClearSaved && (
                  <Button variant="outline" size="sm" onClick={onClearSaved}>
                    <Trash2 className="w-4 h-4 mr-2" />
                    Clear Saved
                  </Button>
                )}
              </div>
            )}
          </CardContent>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  )
}
