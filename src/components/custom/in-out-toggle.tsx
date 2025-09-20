"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

interface InOutToggleProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "onToggle"> {
  defaultValue?: "IN" | "OUT"
  onToggle?: (value: "IN" | "OUT") => void
  size?: "sm" | "md" | "lg"
}

export function InOutToggle({ defaultValue = "IN", onToggle, size = "md", className, ...props }: InOutToggleProps) {
  const [value, setValue] = React.useState<"IN" | "OUT">(defaultValue)

  const handleToggle = () => {
    const newValue = value === "IN" ? "OUT" : "IN"
    setValue(newValue)
    onToggle?.(newValue)
  }

  const sizes = {
    sm: {
      container: "w-32 h-10",
      button: "text-xs",
    },
    md: {
      container: "w-40 h-12",
      button: "text-sm",
    },
    lg: {
      container: "w-48 h-14",
      button: "text-base",
    },
  }

  return (
    <div className={cn("relative rounded-full border p-1 shadow-sm", sizes[size].container, className)} {...props}>
      <div className="relative h-full w-full">
        {/* Background indicator */}
        <motion.div
          className="absolute inset-0 z-0 h-full w-1/2 rounded-full bg-green-500"
          animate={{
            x: value === "IN" ? 0 : "100%",
            backgroundColor: value === "IN" ? "#22c55e" : "#ef4444",
          }}
          transition={{ type: "spring", stiffness: 500, damping: 30 }}
        />

        {/* Buttons */}
        <div className="relative z-10 flex h-full">
          <button
            type="button"
            onClick={() => value !== "IN" && handleToggle()}
            className={cn(
              "flex w-1/2 items-center justify-center rounded-full font-medium transition-colors",
              sizes[size].button,
              value === "IN" ? "text-white" : "text-gray-700 hover:text-gray-900",
            )}
          >
            IN
          </button>
          <button
            type="button"
            onClick={() => value !== "OUT" && handleToggle()}
            className={cn(
              "flex w-1/2 items-center justify-center rounded-full font-medium transition-colors",
              sizes[size].button,
              value === "OUT" ? "text-white" : "text-gray-700 hover:text-gray-900",
            )}
          >
            OUT
          </button>
        </div>
      </div>
    </div>
  )
}
