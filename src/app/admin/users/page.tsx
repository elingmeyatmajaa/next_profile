"use client"

import { useState, useEffect } from "react"
import { fetchUsers, User } from "@/lib/resources"
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

export default function UsersTable() {
  const [users, setUsers] = useState<User[]>([])
  const [page, setPage] = useState(1)
  const [limit] = useState(10)
  const [totalPages, setTotalPages] = useState(1)
  const [loading, setLoading] = useState(false)

  const accessToken =
    typeof window !== "undefined" ? localStorage.getItem("accessToken") : null

  const loadData = async () => {
    setLoading(true)
    try {
      const res = await fetchUsers({ page, limit, token: accessToken })
      setUsers(res.data)
      setTotalPages(res.pagination.totalPages)
    } catch (err: any) {
      toast.error(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [page])

  return (
    <Card>
      <CardHeader>
        <CardTitle>Users</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
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
            ) : users.length === 0 ? (
              <TableRow>
                <TableCell colSpan={3} className="text-center py-4">
                  No data
                </TableCell>
              </TableRow>
            ) : (
              users.map((u) => (
                <TableRow key={u.id}>
                  <TableCell>{u.name}</TableCell>
                  <TableCell>{u.email}</TableCell>
                  <TableCell>
                    {new Date(u.createdAt).toLocaleString()}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>

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
  )
}
