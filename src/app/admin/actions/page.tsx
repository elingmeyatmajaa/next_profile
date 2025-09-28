"use client"

import { useState, useEffect } from "react"
import { prisma } from "@/lib/prisma" // optional, mostly for types
import { slugify } from "@/lib/slugify"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import toast from "react-hot-toast"

interface Action {
  id: string
  name: string
  slug: string
  createdAt: string
}

export default function ActionsAdminPage() {
  const [actions, setActions] = useState<Action[]>([])
  const [loading, setLoading] = useState(false)
  const [page, setPage] = useState(1)
  const [limit] = useState(10)
  const [totalPages, setTotalPages] = useState(1)
  const [search, setSearch] = useState("")
  const [nameInput, setNameInput] = useState("")

  const accessToken = typeof window !== "undefined" ? localStorage.getItem("accessToken") : null

  const fetchActions = async () => {
    setLoading(true)
    try {
      const query = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        search,
      })
      const res = await fetch(`/api/actions?${query.toString()}`, {
        headers: { authorization: `Bearer ${accessToken}` || "" },
      })
      const data = await res.json()
      if (data.status === "success") {
        setActions(data.data)
        setTotalPages(data.pagination.totalPages)
      } else {
        toast.error(data.message)
      }
    } catch (err) {
      console.error(err)
      toast.error("Failed to fetch actions")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchActions()
  }, [page, search])

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!nameInput) return toast.error("Name is required")
    try {
      const res = await fetch("/api/actions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${accessToken}` || "",
        },
        body: JSON.stringify({ name: nameInput, slug: slugify(nameInput) }),
      })
      const data = await res.json()
      if (data.status === "success") {
        toast.success("Action created")
        setNameInput("")
        fetchActions()
      } else {
        toast.error(data.message)
      }
    } catch (err) {
      console.error(err)
      toast.error("Failed to create action")
    }
  }

  return (
    <div className="space-y-6">
      {/* Search + Add */}
      <Card>
        <CardHeader>
          <CardTitle>Manage Actions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col md:flex-row gap-2 items-start md:items-center">
            <Input
              placeholder="Search actions..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <form onSubmit={handleCreate} className="flex gap-2 flex-1 md:flex-auto">
              <Input
                placeholder="New action name"
                value={nameInput}
                onChange={(e) => setNameInput(e.target.value)}
              />
              <Button type="submit" className="whitespace-nowrap">
                Add
              </Button>
            </form>
          </div>

          {/* Table */}
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Slug</TableHead>
                <TableHead>Created At</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={3} className="text-center py-4">
                    Loading...
                  </TableCell>
                </TableRow>
              ) : actions.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={3} className="text-center py-4">
                    No actions found
                  </TableCell>
                </TableRow>
              ) : (
                actions.map((action) => (
                  <TableRow key={action.id}>
                    <TableCell>{action.name}</TableCell>
                    <TableCell>{action.slug}</TableCell>
                    <TableCell>{new Date(action.createdAt).toLocaleString()}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>

          {/* Pagination */}
          <div className="flex gap-2 justify-end mt-2">
            <Button disabled={page <= 1} onClick={() => setPage(page - 1)}>
              Prev
            </Button>
            <span className="px-2 py-1">{page}</span>
            <Button disabled={page >= totalPages} onClick={() => setPage(page + 1)}>
              Next
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
