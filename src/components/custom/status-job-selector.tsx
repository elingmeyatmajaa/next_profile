"use client"
import { CheckCircle, Clock, RotateCcw, XCircle } from "lucide-react"

import { cn } from "@/lib/utils"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { StatusJobBadge, type StatusJobType } from "./status-job-badge"

interface StatusJobSelectorProps {
  value: StatusJobType
  onChange: (value: StatusJobType) => void
  className?: string
  disabled?: boolean
}

export function StatusJobSelector({ value, onChange, className, disabled }: StatusJobSelectorProps) {
  return (
    <Select value={value} onValueChange={(value: StatusJobType) => onChange(value)} disabled={disabled}>
      <SelectTrigger className={cn("w-[180px]", className)}>
        <SelectValue placeholder="Select status">
          <StatusJobBadge status={value} />
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="pending">
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-amber-500" />
            <span>Pending</span>
          </div>
        </SelectItem>
        <SelectItem value="in_progress">
          <div className="flex items-center gap-2">
            <RotateCcw className="h-4 w-4 text-blue-500" />
            <span>In Progress</span>
          </div>
        </SelectItem>
        <SelectItem value="done">
          <div className="flex items-center gap-2">
            <CheckCircle className="h-4 w-4 text-green-500" />
            <span>Done</span>
          </div>
        </SelectItem>
        <SelectItem value="cancelled">
          <div className="flex items-center gap-2">
            <XCircle className="h-4 w-4 text-red-500" />
            <span>Cancelled</span>
          </div>
        </SelectItem>
      </SelectContent>
    </Select>
  )
}
