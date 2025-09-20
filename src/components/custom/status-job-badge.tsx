import type React from "react"
import { CheckCircle, Clock, RotateCcw, XCircle } from "lucide-react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const statusVariants = cva(
  "inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset",
  {
    variants: {
      variant: {
        pending: "bg-amber-50 text-amber-700 ring-amber-600/20",
        in_progress: "bg-blue-50 text-blue-700 ring-blue-600/20",
        done: "bg-green-50 text-green-700 ring-green-600/20",
        cancelled: "bg-red-50 text-red-700 ring-red-600/20",
      },
      size: {
        sm: "px-2 py-0.5 text-xs",
        md: "px-2.5 py-0.5 text-xs",
        lg: "px-3 py-1 text-sm",
      },
    },
    defaultVariants: {
      variant: "pending",
      size: "md",
    },
  },
)

export type StatusJobType = "pending" | "in_progress" | "done" | "cancelled"

const statusIcons = {
  pending: Clock,
  in_progress: RotateCcw,
  done: CheckCircle,
  cancelled: XCircle,
}

const statusLabels = {
  pending: "Pending",
  in_progress: "In Progress",
  done: "Done",
  cancelled: "Cancelled",
}

export interface StatusBadgeProps extends React.HTMLAttributes<HTMLSpanElement>, VariantProps<typeof statusVariants> {
  status: StatusJobType
  showIcon?: boolean
  showLabel?: boolean
}

export function StatusJobBadge({
  className,
  variant,
  size,
  status,
  showIcon = true,
  showLabel = true,
  ...props
}: StatusBadgeProps) {
  const Icon = statusIcons[status]
  const label = statusLabels[status]

  return (
    <span className={cn(statusVariants({ variant: status, size }), className)} {...props}>
      {showIcon && <Icon className="h-3.5 w-3.5" />}
      {showLabel && <span>{label}</span>}
    </span>
  )
}
