export interface Pagination {
  total: number
  page: number
  limit: number
  totalPages: number
  hasNextPage: boolean
  hasPrevPage: boolean
  nextPage: number | null
  prevPage: number | null
}

export interface PaginatedResponse<T> {
  status: string
  code: number
  message: string
  data: T[]
  pagination: Pagination
}
