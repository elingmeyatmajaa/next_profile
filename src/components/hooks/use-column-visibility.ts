"use client"

import { useState, useEffect, useCallback } from "react"
import type { VisibilityState } from "@tanstack/react-table"

interface UseColumnVisibilityOptions {
  tableId: string // Unique identifier for the table
  defaultHidden?: string[]
  enabled?: boolean
}

interface ColumnVisibilityStorage {
  [tableId: string]: {
    visibility: VisibilityState
    timestamp: number
    version: string
  }
}

const STORAGE_KEY = "datatable-column-visibility"
const STORAGE_VERSION = "1.0"
const STORAGE_EXPIRY = 30 * 24 * 60 * 60 * 1000 // 30 days in milliseconds

export function useColumnVisibility({ tableId, defaultHidden = [], enabled = true }: UseColumnVisibilityOptions) {
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>(() => {
    if (!enabled) return {}

    // Initialize with default hidden columns
    const initialState: VisibilityState = {}
    defaultHidden.forEach((columnId) => {
      initialState[columnId] = false
    })

    return initialState
  })

  const [isLoaded, setIsLoaded] = useState(false)

  // Load from localStorage on mount
  useEffect(() => {
    if (!enabled) {
      setIsLoaded(true)
      return
    }

    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) {
        const parsedData: ColumnVisibilityStorage = JSON.parse(stored)
        const tableData = parsedData[tableId]

        if (tableData) {
          // Check if data is not expired and version matches
          const isExpired = Date.now() - tableData.timestamp > STORAGE_EXPIRY
          const isValidVersion = tableData.version === STORAGE_VERSION

          if (!isExpired && isValidVersion && tableData.visibility) {
            setColumnVisibility(tableData.visibility)
          } else {
            // Clean up expired or invalid data
            cleanupExpiredData()
          }
        }
      }
    } catch (error) {
      console.warn("Failed to load column visibility from localStorage:", error)
      // Fallback to default state
      const initialState: VisibilityState = {}
      defaultHidden.forEach((columnId) => {
        initialState[columnId] = false
      })
      setColumnVisibility(initialState)
    } finally {
      setIsLoaded(true)
    }
  }, [tableId, enabled, defaultHidden])

  // Save to localStorage whenever columnVisibility changes
  useEffect(() => {
    if (!enabled || !isLoaded) return

    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      const existingData: ColumnVisibilityStorage = stored ? JSON.parse(stored) : {}

      const updatedData: ColumnVisibilityStorage = {
        ...existingData,
        [tableId]: {
          visibility: columnVisibility,
          timestamp: Date.now(),
          version: STORAGE_VERSION,
        },
      }

      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedData))
    } catch (error) {
      console.warn("Failed to save column visibility to localStorage:", error)
    }
  }, [columnVisibility, tableId, enabled, isLoaded])

  // Clean up expired data
  const cleanupExpiredData = useCallback(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (!stored) return

      const parsedData: ColumnVisibilityStorage = JSON.parse(stored)
      const cleanedData: ColumnVisibilityStorage = {}

      Object.entries(parsedData).forEach(([key, value]) => {
        const isExpired = Date.now() - value.timestamp > STORAGE_EXPIRY
        const isValidVersion = value.version === STORAGE_VERSION

        if (!isExpired && isValidVersion) {
          cleanedData[key] = value
        }
      })

      localStorage.setItem(STORAGE_KEY, JSON.stringify(cleanedData))
    } catch (error) {
      console.warn("Failed to cleanup expired data:", error)
    }
  }, [])

  // Reset to default settings
  const resetToDefault = useCallback(() => {
    const defaultState: VisibilityState = {}
    defaultHidden.forEach((columnId) => {
      defaultState[columnId] = false
    })
    setColumnVisibility(defaultState)
  }, [defaultHidden])

  // Clear all saved data for this table
  const clearSavedSettings = useCallback(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) {
        const parsedData: ColumnVisibilityStorage = JSON.parse(stored)
        delete parsedData[tableId]
        localStorage.setItem(STORAGE_KEY, JSON.stringify(parsedData))
      }
      resetToDefault()
    } catch (error) {
      console.warn("Failed to clear saved settings:", error)
    }
  }, [tableId, resetToDefault])

  // Get saved settings info
  const getSavedSettingsInfo = useCallback(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) {
        const parsedData: ColumnVisibilityStorage = JSON.parse(stored)
        const tableData = parsedData[tableId]

        if (tableData) {
          return {
            hasSavedSettings: true,
            lastSaved: new Date(tableData.timestamp),
            version: tableData.version,
          }
        }
      }
    } catch (error) {
      console.warn("Failed to get saved settings info:", error)
    }

    return {
      hasSavedSettings: false,
      lastSaved: null,
      version: null,
    }
  }, [tableId])

  return {
    columnVisibility,
    setColumnVisibility,
    isLoaded,
    resetToDefault,
    clearSavedSettings,
    getSavedSettingsInfo,
    cleanupExpiredData,
  }
}
