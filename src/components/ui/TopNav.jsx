import { FaGear } from "react-icons/fa6"
import { NavLink } from "react-router-dom"

export default function TopNav() {
  return (
    <div className="backdrop-blue-md mt-3 border-b border-primary/30 pb-3 backdrop-filter">
      <div className="mx-3 flex flex-row items-center justify-between text-lg md:mx-8 md:text-2xl">
        <NavLink to="/">
          <h1 className="hover:cursor-pointer">ConnectHub</h1>
        </NavLink>
        <NavLink to="/settings">
          <FaGear className="transition-transform duration-300 hover:rotate-45"/>
        </NavLink>
      </div>
    </div>
  )
}
