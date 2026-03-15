"use client"

import { useInfiniteQuery } from "@tanstack/react-query"
import { useState, useMemo } from "react"
import type { ApiResponse, UseDataTableOptions } from "@/types/datatable"
import HttpClient from "@/lib/http_client"

export function useDataTable<T = any>({ endpoint, pageSize, sorting, globalFilter, parameters }: UseDataTableOptions) {
  const [data, setData] = useState<T[]>([])

  const queryKey = useMemo(
    () => [endpoint, pageSize, sorting, globalFilter, parameters],
    [endpoint, pageSize, sorting, globalFilter, parameters],
  )

  const {
    data: queryData,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
    error,
    refetch,
  } = useInfiniteQuery({
    queryKey,
    queryFn: async ({ pageParam = 1 }) => {
      const params = new URLSearchParams({
        page: pageParam.toString(),
        limit: pageSize.toString(),
      })

      // Add sorting parameters
      if (sorting.length > 0) {
        const sortBy = sorting.map((s) => s.id).join(",")
        const sortOrder = sorting.map((s) => (s.desc ? "desc" : "asc")).join(",")
        params.append("sort_column", sortBy)
        params.append("sort_order", sortOrder)
      }

      // Add search parameter
      if (globalFilter) {
        params.append("search", globalFilter)
      }

      // Add dynamic parameters
      Object.entries(parameters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== "") {
          if (Array.isArray(value)) {
            // Handle array values (multiselect)
            value.forEach((v) => params.append(`${key}[]`, v.toString()))
          } else if (typeof value === "object" && value.start && value.end) {
            // Handle date range
            params.append(`${key}_start`, value.start)
            params.append(`${key}_end`, value.end)
          } else if(typeof value == "boolean") {
            if(value){
              params.append(key, "1")
            }
          }else {
            params.append(key, value.toString())
          }
        }
      })

      const response = await HttpClient.GET(`${endpoint}?${params.toString()}`)
      return response.data as ApiResponse<T>
    },
    getNextPageParam: (lastPage) => {
      return lastPage.next_page_url != null ? lastPage.current_page + 1 : undefined
    },
    initialPageParam: 1,
  })

  // Flatten all pages data
  const flatData = useMemo(() => {
    return queryData?.pages?.flatMap((page) => page.data) ?? []
  }, [queryData])

  const totalCount = queryData?.pages?.[0]?.total ?? 0

  return {
    data: flatData,
    totalCount,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
    error,
    refetch,
  }
}
