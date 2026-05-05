import { Route, Routes } from "react-router-dom"

import AuthLayout from "@/layouts/AuthLayout"
import MainLayout from "@/layouts/MainLayout"
import Explore from "@/pages/Explore"
import Home from "@/pages/Home"
import Login from "@/pages/Login"
import Messages from "@/pages/Messages" // TODO: on later version, this page is not ready yet
import Notifications from "@/pages/Notifications"
import Profile from "@/pages/Profile"
import Setting from "@/pages/Setting"

export default function AppRoutes() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/search" element={<Explore />} />
        <Route path="/notifications" element={<Notifications />} />
        <Route path="/messages" element={<Messages />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/settings" element={<Setting />} />
      </Route>
      <Route element={<AuthLayout />}>
        <Route path="/auth" element={<Login />} />
      </Route>
    </Routes>
  )
}
