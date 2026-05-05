import { Settings } from "lucide-react"
import { Link, useLocation } from "react-router-dom"

import { Button } from "@/components/ui/button"
import { SidebarTrigger } from "@/components/ui/sidebar"

const getTitle = (pathname) => {
  if (pathname === "/") return "Home"
  if (pathname.includes("explore") || pathname.includes("search")) {
    return "Explore"
  }
  if (pathname.includes("notifications")) return "Notifications"
  if (pathname.includes("bookmarks")) return "Saved"
  return "ConnectHub"
}

export default function Header() {
  const { pathname } = useLocation()

  return (
    <header className="sticky top-0 z-30 border-b border-border bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/80">
      <div className="grid h-16 grid-cols-[auto_1fr_auto] items-center gap-4 px-4 md:px-6">
        <SidebarTrigger aria-label="Toggle sidebar" />

        <h1 className="text-center text-lg font-semibold tracking-normal text-foreground md:text-left">
          {getTitle(pathname)}
        </h1>

        <Button asChild aria-label="Open settings" size="icon" variant="ghost">
          <Link to="/settings">
            <Settings aria-hidden="true" />
          </Link>
        </Button>
      </div>
    </header>
  )
}
