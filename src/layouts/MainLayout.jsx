import { Outlet } from "react-router-dom"

import Header from "@/components/layout/Header"
import Sidebar from "@/components/layout/Sidebar"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"

export default function MainLayout() {
  return (
    <SidebarProvider>
      <Sidebar />
      <SidebarInset>
        <Header />
        <main className="min-w-0 flex-1 p-4 md:p-6 lg:p-8">
          <Outlet />
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}
