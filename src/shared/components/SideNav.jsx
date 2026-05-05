import { FaBell } from "react-icons/fa6"
import { FaUser } from "react-icons/fa"
import { GiHamburgerMenu } from "react-icons/gi"
import { GoHomeFill } from "react-icons/go"
import { IoSearch } from "react-icons/io5"
import { NavLink } from "react-router-dom"
import { useState } from "react"

import { Button } from "@/components/ui/button"
import { cn } from "@/shared/utils"

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
      <Button
        className={cn("m-4 md:hidden", navVisible && "hidden")}
        onClick={() => setNavVisible(true)}
        size="icon"
        type="button"
        variant="ghost"
      >
        <GiHamburgerMenu />
      </Button>
      <aside
        className={cn(
          "min-h-screen w-40 flex-col border-r border-border bg-sidebar text-sidebar-foreground md:flex",
          !navVisible && "hidden"
        )}
      >
        <nav className="mt-6 flex flex-col gap-2 px-2 md:mt-8">
          {navItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.to}
              className={({ isActive }) =>
                cn(
                  "flex w-full flex-row items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                  isActive &&
                    "bg-sidebar-accent font-medium text-sidebar-accent-foreground"
                )
              }
              onClick={() => setNavVisible(false)}
            >
              {item.icon}
              <span>{item.name}</span>
            </NavLink>
          ))}
        </nav>
      </aside>
    </>
  )
}
