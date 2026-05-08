import { Bell, Bookmark, Compass, Home, Settings, User } from "lucide-react"
import { Link, useLocation } from "react-router-dom"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Sidebar as ShadcnSidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
  useSidebar,
} from "@/components/ui/sidebar"
import SidebarItem from "@/components/layout/SidebarItem"
import { SidebarTrigger } from "@/components/ui/sidebar"

const navItems = [
  { icon: Home, label: "Home", to: "/" },
  { icon: Compass, label: "Explore", to: "/explore" },
  { icon: Bell, label: "Notifications", to: "/notifications" },
  { icon: Bookmark, label: "Bookmarks", to: "/bookmarks" },
]

function isRouteActive(pathname, to) {
  if (to === "/") return pathname === "/"
  if (to === "/explore") {
    return pathname.includes("explore") || pathname.includes("search")
  }
  return pathname.startsWith(to)
}

export default function Sidebar() {
  const { pathname } = useLocation()
  const { setOpenMobile } = useSidebar()

  return (
    <ShadcnSidebar collapsible="icon">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild size="lg">
              <SidebarTrigger aria-label="Toggle sidebar"></SidebarTrigger>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarSeparator />

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => (
                <SidebarItem
                  key={item.to}
                  icon={item.icon}
                  isActive={isRouteActive(pathname, item.to)}
                  label={item.label}
                  to={item.to}
                />
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarItem
                icon={User}
                isActive={pathname.startsWith("/profile")}
                label="Profile"
                to="/profile"
              />
              <SidebarItem
                icon={Settings}
                isActive={pathname.startsWith("/settings")}
                label="Settings"
                to="/settings"
              />
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild size="lg">
              <Link onClick={() => setOpenMobile(false)} to="/profile">
                <Avatar className="size-8">
                  <AvatarImage
                    alt="Elena Vance"
                    src="https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTV8fHByb2ZpbGUlMjBwaWN0dXJlfGVufDB8fDB8fHww"
                  />
                  <AvatarFallback>EV</AvatarFallback>
                </Avatar>
                <span className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">Elena Vance</span>
                  <span className="truncate text-xs text-muted-foreground">
                    @elana_vance
                  </span>
                </span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </ShadcnSidebar>
  )
}
