import { apiFetch } from "./api"
import { PaginatedResponse } from "./types"

// ---------------- Actions ----------------
export interface Action {
  id: string
  name: string
  slug: string
  createdAt: string
}

export async function fetchActions({
  page = 1,
  limit = 10,
  search = "",
  token,
}: {
  page?: number
  limit?: number
  search?: string
  token?: string | null
}): Promise<PaginatedResponse<Action>> {
  const query = new URLSearchParams({
    page: String(page),
    limit: String(limit),
    ...(search ? { search } : {}),
  })
  return apiFetch(`/api/actions?${query}`, { token })
}

// ---------------- Users ----------------
export interface User {
  id: string
  name: string
  email: string
  createdAt: string
}

export async function fetchUsers({
  page = 1,
  limit = 10,
  search = "",
  token,
}: {
  page?: number
  limit?: number
  search?: string
  token?: string | null
}): Promise<PaginatedResponse<User>> {
  const query = new URLSearchParams({
    page: String(page),
    limit: String(limit),
    ...(search ? { search } : {}),
  })
  return apiFetch(`/api/users?${query}`, { token })
}

// ---------------- Roles ----------------
export interface Role {
  id: string
  name: string
  createdAt: string
}

export async function fetchRoles({
  page = 1,
  limit = 10,
  search = "",
  token,
}: {
  page?: number
  limit?: number
  search?: string
  token?: string | null
}): Promise<PaginatedResponse<Role>> {
  const query = new URLSearchParams({
    page: String(page),
    limit: String(limit),
    ...(search ? { search } : {}),
  })
  return apiFetch(`/api/roles?${query}`, { token })
}

// ---------------- Modules ----------------
export interface Module {
  id: string
  name: string
  createdAt: string
}

export async function fetchModules({
  page = 1,
  limit = 10,
  search = "",
  token,
}: {
  page?: number
  limit?: number
  search?: string
  token?: string | null
}): Promise<PaginatedResponse<Module>> {
  const query = new URLSearchParams({
    page: String(page),
    limit: String(limit),
    ...(search ? { search } : {}),
  })
  return apiFetch(`/api/modules?${query}`, { token })
}

// ---------------- Permissions ----------------
export interface Permission {
  id: string
  name: string
  createdAt: string
}

export async function fetchPermissions({
  page = 1,
  limit = 10,
  search = "",
  token,
}: {
  page?: number
  limit?: number
  search?: string
  token?: string | null
}): Promise<PaginatedResponse<Permission>> {
  const query = new URLSearchParams({
    page: String(page),
    limit: String(limit),
    ...(search ? { search } : {}),
  })
  return apiFetch(`/api/permissions?${query}`, { token })
}
