"use client"

import * as React from "react"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"

interface DialogOptions {
  title?: string
  description?: string
  content?: React.ReactNode
  actions? : React.ReactNode
  size?: "sm" | "md" | "lg" | "xl" | "full"
}

interface DialogContextType {
  showDialog: (options: DialogOptions) => void
  hideDialog: () => void
  isOpen: boolean
}

const DialogContext = React.createContext<DialogContextType | undefined>(undefined)

export function DialogProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = React.useState(false)
  const [dialogOptions, setDialogOptions] = React.useState<DialogOptions>({})

  const showDialog = React.useCallback((options: DialogOptions) => {
    setDialogOptions(options)
    setIsOpen(true)
  }, [])

  const hideDialog = React.useCallback(() => {
    setIsOpen(false)
    // Reset options after animation completes
    setTimeout(() => setDialogOptions({}), 200)
  }, [])

  const getSizeClass = (size?: string) => {
    switch (size) {
      case "sm":
        return "sm:max-w-sm"
      case "md":
        return "sm:max-w-md"
      case "lg":
        return "sm:max-w-lg"
      case "xl":
        return "sm:max-w-xl"
      case "full":
        return "sm:max-w-[95vw]"
      default:
        return "sm:max-w-md"
    }
  }

  return (
    <DialogContext.Provider value={{ showDialog, hideDialog, isOpen }}>
      {children}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent
          className={`${getSizeClass(dialogOptions.size)} h-auto max-h-[85vh] p-0 flex flex-col`}
          style={{ maxHeight: "85vh" }}
        >
          {(dialogOptions.title || dialogOptions.description) && (
            <DialogHeader className="flex-shrink-0 px-6 pt-6 pb-4">
              {dialogOptions.title && <DialogTitle>{dialogOptions.title}</DialogTitle>}
              {dialogOptions.description && <DialogDescription>{dialogOptions.description}</DialogDescription>}
            </DialogHeader>
          )}
          <div
            className="flex-1 overflow-y-auto px-6 pb-6"
            style={{
              maxHeight: dialogOptions.title || dialogOptions.description ? "calc(85vh - 120px)" : "calc(85vh - 48px)",
              overflowY: "auto",
            }}
          >
            {dialogOptions.content}
          </div>
          {dialogOptions.actions && (
            <DialogFooter>
              {dialogOptions.actions}
            </DialogFooter>
          )}
        </DialogContent>
      </Dialog>
    </DialogContext.Provider>
  )
}

export function useDialog() {
  const context = React.useContext(DialogContext)
  if (context === undefined) {
    throw new Error("useDialog must be used within a DialogProvider")
  }
  return context
}
