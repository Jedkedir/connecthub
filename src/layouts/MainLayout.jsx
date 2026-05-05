import { Outlet } from "react-router-dom"

import Footer from "@/shared/components/Footer"
import SideNav from "@/shared/components/SideNav"
import TopNav from "@/shared/components/TopNav"

export default function MainLayout() {
  return (
    <>
      <TopNav />
      <div className="flex flex-row items-stretch">
        <SideNav />
        <main className="flex-1 p-4 md:p-8">
          <Outlet />
        </main>
      </div>
      <Footer />
    </>
  )
}
