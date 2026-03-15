"use client"

import { useState, useEffect, useCallback } from "react"
import type { DataTableParameter } from "@/types/datatable"

interface UseDataTableParametersOptions {
  parameters: DataTableParameter[]
  tableId?: string
  persistSettings?: boolean
}

const STORAGE_KEY = "datatable-parameters"

export function useDataTableParameters({ parameters, tableId, persistSettings = true }: UseDataTableParametersOptions) {
  const [parameterValues, setParameterValues] = useState<Record<string, any>>(() => {
    // Initialize with default values
    const initialValues: Record<string, any> = {}
    parameters.forEach((param) => {
      initialValues[param.key] = param.defaultValue
    })
    return initialValues
  })

  const [isLoaded, setIsLoaded] = useState(false)

  // Load from localStorage on mount
  useEffect(() => {
    if (!persistSettings || !tableId) {
      setIsLoaded(true)
      return
    }

    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) {
        const parsedData = JSON.parse(stored)
        const tableData = parsedData[tableId]

        if (tableData) {
          // Merge with default values to handle new parameters
          const mergedValues = { ...parameterValues, ...tableData }
          setParameterValues(mergedValues)
        }
      }
    } catch (error) {
      console.warn("Failed to load parameters from localStorage:", error)
    } finally {
      setIsLoaded(true)
    }
  }, [tableId, persistSettings])

  // Save to localStorage whenever parameters change
  useEffect(() => {
    if (!persistSettings || !tableId || !isLoaded) return

    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      const existingData = stored ? JSON.parse(stored) : {}

      const updatedData = {
        ...existingData,
        [tableId]: parameterValues,
      }

      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedData))
    } catch (error) {
      console.warn("Failed to save parameters to localStorage:", error)
    }
  }, [parameterValues, tableId, persistSettings, isLoaded])

  const updateParameter = useCallback((key: string, value: any) => {
    setParameterValues((prev) => ({
      ...prev,
      [key]: value,
    }))
  }, [])

  const resetParameters = useCallback(() => {
    const defaultValues: Record<string, any> = {}
    parameters.forEach((param) => {
      defaultValues[param.key] = param.defaultValue
    })
    setParameterValues(defaultValues)
  }, [parameters])

  const clearSavedParameters = useCallback(() => {
    if (!tableId) return

    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) {
        const parsedData = JSON.parse(stored)
        delete parsedData[tableId]
        localStorage.setItem(STORAGE_KEY, JSON.stringify(parsedData))
      }
      resetParameters()
    } catch (error) {
      console.warn("Failed to clear saved parameters:", error)
    }
  }, [tableId, resetParameters])

  return {
    parameterValues,
    updateParameter,
    resetParameters,
    clearSavedParameters,
    isLoaded,
  }
}
