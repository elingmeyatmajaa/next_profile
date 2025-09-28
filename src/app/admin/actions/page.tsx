"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import toast from "react-hot-toast"

interface Action {
  id: string
  name: string
  slug: string
  createdAt: string
}

export default function ActionsTable() {
  const [actions, setActions] = useState<Action[]>([])
  const [loading, setLoading] = useState(false)
  const [page, setPage] = useState(1)
  const [limit] = useState(10)
  const [totalPages, setTotalPages] = useState(1)

  const accessToken =
    typeof window !== "undefined" ? localStorage.getItem("accessToken") : null

  const fetchActions = async () => {
    setLoading(true)
    try {
      const query = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
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
  }, [page])

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Actions Data</CardTitle>
        </CardHeader>
        <CardContent>
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
                    <TableCell>
                      {new Date(action.createdAt).toLocaleString()}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>

          {/* Pagination */}
          <div className="flex gap-2 justify-end mt-4">
            <Button disabled={page <= 1} onClick={() => setPage(page - 1)}>
              Prev
            </Button>
            <span className="px-2 py-1">{page}</span>
            <Button
              disabled={page >= totalPages}
              onClick={() => setPage(page + 1)}
            >
              Next
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
