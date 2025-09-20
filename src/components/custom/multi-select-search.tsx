"use client"

import { useState, useEffect, useRef } from "react"
import { Check, ChevronsUpDown, X, Loader2 } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"

interface Item {
    uuid: string
    name: string
}

export default function MultiSelectSearch({
    apiUrl = "/api/item",
    placeholder = "Pilih item...",
    emptyMessage = "Tidak ada item ditemukan.",
    searchPlaceholder = "Cari item...",
    onChange
}: {
    apiUrl?: string
    placeholder?: string
    emptyMessage?: string
    searchPlaceholder?: string
    onChange?: (items: Item[]) => void
}) {
    const [open, setOpen] = useState(false)
    const [items, setItems] = useState<Item[]>([])
    const [selectedItems, setSelectedItems] = useState<Item[]>([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [searchQuery, setSearchQuery] = useState("")
    const dropdownRef = useRef<HTMLDivElement>(null)

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setOpen(false)
            }
        }

        document.addEventListener("mousedown", handleClickOutside)
        return () => {
            document.removeEventListener("mousedown", handleClickOutside)
        }
    }, [])

    useEffect(() => {
        const fetchItems = async () => {
            setLoading(true)
            setError(null)
            try {
                // Add search query as URL parameter
                const url = new URL(apiUrl, window.location.origin)
                if (searchQuery) {
                    url.searchParams.append("search", searchQuery)
                }

                const response = await fetch(url)
                if (!response.ok) {
                    throw new Error("Gagal mengambil data")
                }
                const data = await response.json()
                setItems(data.data)
            } catch (err) {
                setError(err instanceof Error ? err.message : "Terjadi kesalahan")
                console.error("Error fetching items:", err)
            } finally {
                setLoading(false)
            }
        }

        // Add debounce to prevent too many API calls
        const debounceTimer = setTimeout(() => {
            fetchItems()
        }, 300)

        return () => clearTimeout(debounceTimer)
    }, [apiUrl, searchQuery])

    useEffect(() => {
        onChange?.(selectedItems)
    }, [selectedItems])
    const handleSelect = (item: Item) => {
        setSelectedItems((current) => {
            if (current.some((i) => i.uuid === item.uuid)) {
                return current.filter((i) => i.uuid !== item.uuid)
            } else {
                return [...current, item]
            }
        })
    }

    const removeItem = (item: Item) => {
        setSelectedItems((current) => current.filter((i) => i.uuid !== item.uuid))
    }

    const isSelected = (item: Item) => {
        return selectedItems.some((i) => i.uuid === item.uuid)
    }

    return (
        <div className="space-y-2 relative" ref={dropdownRef}>
            <Button
                variant="outline"
                role="combobox"
                aria-expanded={open}
                className="w-full justify-between"
                onClick={() => setOpen(!open)}
            >
                {selectedItems.length > 0 ? `${selectedItems.length} item dipilih` : placeholder}
                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>

            {open && (
                <div className="absolute z-10 w-full bg-background rounded-md border border-input shadow-md mt-1 overflow-hidden">
                    <div className="p-2">
                        <Input
                            placeholder={searchPlaceholder}
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="h-9"
                        />
                    </div>

                    <div className="max-h-60 overflow-y-auto">
                        {loading ? (
                            <div className="py-6 text-center text-sm flex items-center justify-center">
                                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                Memuat data...
                            </div>
                        ) : error ? (
                            <div className="py-6 text-center text-sm text-destructive">{error}</div>
                        ) : items.length === 0 ? (
                            <div className="py-6 text-center text-sm text-muted-foreground">{emptyMessage}</div>
                        ) : (
                            <div className="py-1">
                                {items.map((item) => (
                                    <div
                                        key={item.uuid}
                                        className={cn(
                                            "flex items-center px-2 py-2 cursor-pointer hover:bg-accent hover:text-accent-foreground",
                                            isSelected(item) && "bg-accent/50",
                                        )}
                                        onClick={() => handleSelect(item)}
                                    >
                                        <div className="flex items-center justify-center w-5 h-5 rounded-sm border mr-2">
                                            {isSelected(item) && <Check className="h-4 w-4" />}
                                        </div>
                                        <span>{item.name}</span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            )}

            {selectedItems.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-2">
                    {selectedItems.map((item) => (
                        <Badge key={item.uuid} variant="secondary" className="flex items-center gap-1">
                            {item.name}
                            <X className="h-3 w-3 cursor-pointer" onClick={() => removeItem(item)} />
                        </Badge>
                    ))}
                </div>
            )}
        </div>
    )
}
