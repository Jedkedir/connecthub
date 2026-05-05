import { FaGear } from "react-icons/fa6"
import { NavLink } from "react-router-dom"

import { Button } from "@/components/ui/button"

export default function TopNav() {
  return (
    <header className="border-b border-border bg-background">
      <div className="mx-auto flex h-16 max-w-screen-2xl flex-row items-center justify-between px-4 md:px-8">
        <NavLink to="/" className="text-xl font-semibold tracking-normal">
          ConnectHub
        </NavLink>
        <Button asChild size="icon" variant="ghost">
          <NavLink to="/settings" aria-label="Open settings">
            <FaGear className="transition-transform duration-300 hover:rotate-45" />
          </NavLink>
        </Button>
      </div>
    </header>
  )
}
