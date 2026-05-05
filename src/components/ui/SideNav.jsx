import { GoHomeFill } from "react-icons/go"
import { IoSearch } from "react-icons/io5"
import { FaBell } from "react-icons/fa6"
import { FaUser } from "react-icons/fa"
import { GiHamburgerMenu } from "react-icons/gi"
import { NavLink } from "react-router-dom"
import { useState } from "react"

export default function SideNav() {
  const navItems = [
    { name: "Home", to: "/", icon: <GoHomeFill /> },
    { name: "Explore", to: "/search", icon: <IoSearch /> },
    { name: "Notifications", to: "/notifications", icon: <FaBell /> },
    { name: "Profile", to: "/profile", icon: <FaUser /> },
  ]

  const [navVisible, setNavVisible] = useState(false)

  return (
    <>
    <button onClick={() => setNavVisible(true)} className={`flex flex-col items-start m-3 primary md:hidden ${navVisible && "hidden"}`}>
        <GiHamburgerMenu />
    </button>
      <div
        className={`${!navVisible && "hidden"} w-1/3 min-h-screen flex-col items-stretch bg-primary/5 border-r border-primary/30 md:flex md:w-42`}
      >
        <div className="mt-5 mb-10 flex flex-col items-start space-y-4 text-xs text-primary md:mt-10 md:space-y-7 md:text-[17px]">
          {navItems.map((item) => {
            return (
              <NavLink
                key={item.name}
                to={item.to}
                className={({ isActive }) =>
                  `flex font-light w-full cursor-pointer flex-row items-center space-x-3 px-2 py-3 transition-colors duration-300 ease-out hover:text-primary/60 md:space-x-5 md:px-4 md:py-3 ${
                    isActive
                      ? " border-l-5 border-primary bg-primary/15 text-primary"
                      : ""
                  }`
                }
                onClick={() => setNavVisible(false)}
              >
                {item.icon}
                <p>{item.name}</p>
              </NavLink>
            )
          })}
        </div>
      </div>
    </>
  )
}
