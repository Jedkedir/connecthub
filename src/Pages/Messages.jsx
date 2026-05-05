import TopNav from "../components/ui/TopNav"
import SideNav from "../components/ui/SideNav"
import Footer from "../components/ui/Footer"

export default function Messages() {
  return (
    <>
      <TopNav />
      <div className="flex flex-row items-start space-x-7">
        <SideNav />
        <p className="mr-10">Messages View</p>
      </div>
      <Footer />
    </>
  )
}