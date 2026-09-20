import { cookies } from "next/headers"

import { AppSidebar } from "@/components/app-sidebar"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { TooltipProvider } from "@/components/ui/tooltip"

export default async function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const cookieStore = await cookies()
  const defaultOpen = cookieStore.get("sidebar_state")?.value !== "false"

  return (
    <SidebarProvider defaultOpen={defaultOpen} className="h-svh">
      <TooltipProvider>
        <AppSidebar />
        <SidebarInset className="min-h-0 overflow-hidden border shadow-none!">{children}</SidebarInset>
      </TooltipProvider>
    </SidebarProvider>
  )
}
