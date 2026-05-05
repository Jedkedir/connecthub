import { Link } from "react-router-dom"

import {
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"

export default function SidebarItem({ icon: Icon, isActive, label, to }) {
  const { setOpenMobile, state } = useSidebar()

  return (
    <SidebarMenuItem>
      <SidebarMenuButton
        asChild
        isActive={isActive}
        tooltip={state === "collapsed" ? label : undefined}
      >
        <Link
          aria-current={isActive ? "page" : undefined}
          onClick={() => setOpenMobile(false)}
          to={to}
        >
          <Icon aria-hidden="true" />
          <span>{label}</span>
        </Link>
      </SidebarMenuButton>
    </SidebarMenuItem>
  )
}
