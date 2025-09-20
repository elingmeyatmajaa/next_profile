"use client"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Plus, Printer, Download, Archive, MoreHorizontal } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface ActionButtonsProps {
  createHref?: string
  printAction?: () => void
  exportAction?: () => void
  archiveHref?: string
  className?: string
  showLabels?: boolean
  variant?: "default" | "compact" | "dropdown"
  // Tambahkan parameter allow untuk masing-masing button
  allowCreate?: boolean
  allowPrint?: boolean
  allowExport?: boolean
  allowArchive?: boolean
  // Tambahkan parameter disabled untuk masing-masing button
  disableCreate?: boolean
  disablePrint?: boolean
  disableExport?: boolean
  disableArchive?: boolean
  // Tambahkan loading states
  loadingPrint?: boolean
  loadingExport?: boolean
}

export function ActionButtons({
  createHref = "/admin/vendor/create",
  printAction,
  exportAction,
  archiveHref = "/admin/vendor/archive",
  className = "",
  showLabels = true,
  variant = "default",
  allowCreate = true,
  allowPrint = true,
  allowExport = true,
  allowArchive = true,
  disableCreate = false,
  disablePrint = false,
  disableExport = false,
  disableArchive = false,
  loadingPrint = false,
  loadingExport = false,
}: ActionButtonsProps) {
  const handlePrint = () => {
    if (printAction) {
      printAction()
    } else {
      window.print()
    }
  }

  const handleExport = () => {
    if (exportAction) {
      exportAction()
    } else {
      // Default export logic
      console.log("Export functionality not implemented")
    }
  }

  if (variant === "dropdown") {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm" className={className}>
            <MoreHorizontal className="h-4 w-4" />
            {showLabels && <span className="ml-2">Actions</span>}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          {allowCreate && (
            <DropdownMenuItem asChild disabled={disableCreate}>
              <Link href={createHref} className="flex items-center">
                <Plus className="h-4 w-4 mr-2" />
                Tambah
              </Link>
            </DropdownMenuItem>
          )}
          {(allowPrint || allowExport) && allowCreate && <DropdownMenuSeparator />}
          {allowPrint && (
            <DropdownMenuItem onClick={handlePrint} disabled={disablePrint || loadingPrint}>
              <Printer className="h-4 w-4 mr-2" />
              {loadingPrint ? "Printing..." : "Print"}
            </DropdownMenuItem>
          )}
          {allowExport && (
            <DropdownMenuItem onClick={handleExport} disabled={disableExport || loadingExport}>
              <Download className="h-4 w-4 mr-2" />
              {loadingExport ? "Exporting..." : "Export"}
            </DropdownMenuItem>
          )}
          {allowArchive && (allowPrint || allowExport) && <DropdownMenuSeparator />}
          {allowArchive && (
            <DropdownMenuItem asChild disabled={disableArchive}>
              <Link href={archiveHref} className="flex items-center">
                <Archive className="h-4 w-4 mr-2" />
                Lihat Arsip
              </Link>
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    )
  }

  if (variant === "compact") {
    return (
      <div className={`flex items-center gap-1 ${className}`}>
        {allowCreate && (
          <Button asChild size="sm" variant="outline" className="h-8 px-2 bg-transparent" disabled={disableCreate}>
            <Link href={createHref}>
              <Plus className="h-3 w-3" />
            </Link>
          </Button>
        )}
        {allowPrint && (
          <Button
            size="sm"
            variant="outline"
            onClick={handlePrint}
            className="h-8 px-2 bg-transparent"
            disabled={disablePrint || loadingPrint}
          >
            <Printer className="h-3 w-3" />
          </Button>
        )}
        {allowExport && (
          <Button
            size="sm"
            variant="outline"
            onClick={handleExport}
            className="h-8 px-2 bg-transparent"
            disabled={disableExport || loadingExport}
          >
            <Download className="h-3 w-3" />
          </Button>
        )}
        {allowArchive && (
          <Button asChild size="sm" variant="outline" className="h-8 px-2 bg-transparent" disabled={disableArchive}>
            <Link href={archiveHref}>
              <Archive className="h-3 w-3" />
            </Link>
          </Button>
        )}
      </div>
    )
  }

  return (
    <div className={`flex flex-wrap items-center gap-2 ${className}`}>
      {allowCreate && (
        <Button
          asChild
          size="sm"
          variant="outline"
          className="hover:bg-green-50 hover:border-green-300 bg-transparent"
          disabled={disableCreate}
        >
          <Link href={createHref} className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            {showLabels && "Tambah"}
          </Link>
        </Button>
      )}

      {allowPrint && (
        <Button
          size="sm"
          variant="outline"
          onClick={handlePrint}
          className="hover:bg-blue-50 hover:border-blue-300 bg-transparent"
          disabled={disablePrint || loadingPrint}
        >
          <Printer className="h-4 w-4" />
          {showLabels && <span className="ml-2">{loadingPrint ? "Printing..." : "Print"}</span>}
        </Button>
      )}

      {allowExport && (
        <Button
          size="sm"
          variant="outline"
          onClick={handleExport}
          className="hover:bg-purple-50 hover:border-purple-300 bg-transparent"
          disabled={disableExport || loadingExport}
        >
          <Download className="h-4 w-4" />
          {showLabels && <span className="ml-2">{loadingExport ? "Exporting..." : "Export"}</span>}
        </Button>
      )}

      {allowArchive && (
        <Button
          asChild
          size="sm"
          variant="outline"
          className="hover:bg-orange-50 hover:border-orange-300 bg-transparent"
          disabled={disableArchive}
        >
          <Link href={archiveHref} className="flex items-center gap-2">
            <Archive className="h-4 w-4" />
            {showLabels && "Lihat Arsip"}
          </Link>
        </Button>
      )}
    </div>
  )
}
