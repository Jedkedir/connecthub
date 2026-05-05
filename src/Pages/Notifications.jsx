import TopNav from "../components/ui/TopNav"
import SideNav from "../components/ui/SideNav"
import Footer from "../components/ui/Footer"

export default function Notifications() {
  return (
    <>
      <TopNav />
      <div className="flex flex-row items-start space-x-7">
        <SideNav />
        <p className="mr-10">Notifications View</p>
      </div>
      <Footer />
    </>
  )
}