import TopNav from "../components/ui/TopNav"
import SideNav from "../components/ui/SideNav"
import Footer from "../components/ui/Footer"

export default function Search() {
  return (
    <>
      <TopNav />
      <div className="flex flex-row items-start space-x-7">
        <SideNav />
        <p className="mr-10">Search View</p>
      </div>
      <Footer />
    </>
  )
}