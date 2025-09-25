import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"
import { AppSidebar } from "@/components/admin/app-sidebar"
import {
  SidebarProvider,
  SidebarInset,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { ModeToggle } from "@/components/mode-toggle"
import { authOptions } from "../api/auth/[...nextauth]/route"
import { LogoutMenu } from "@/components/admin/logout-menu"

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // ✅ Server-side auth check
  const session = await getServerSession(authOptions)
  if (!session) redirect("/login")

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        {/* Header / Navbar */}
        <header className="flex h-16 shrink-0 items-center border-b px-4">
          {/* Left side */}
          <div className="flex items-center gap-2 flex-1">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="h-4" />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href="#">Dashboard</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbPage>Overview</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>

          {/* Right side */}
          <div className="flex items-center gap-2">
            <ModeToggle />
            <LogoutMenu username={session.user?.name ?? "User"} />
          </div>
        </header>

        {/* Content */}
        <main className="flex flex-1 flex-col gap-4 p-6">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  )
}
