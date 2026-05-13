import { Route, Routes } from "react-router-dom"
import { useEffect } from "react"
import { useNavigate } from "react-router-dom"

import AuthLayout from "@/layouts/AuthLayout"
import MainLayout from "@/layouts/MainLayout"
import Bookmarks from "@/pages/Bookmarks"
import Explore from "@/pages/Explore"
import Home from "@/pages/Home"
import Login from "@/pages/Login"
import Messages from "@/pages/Messages" // TODO: on later version, this page is not ready yet 
import Notifications from "@/pages/Notifications"
import Profile from "@/pages/Profile"
import PostDetail from "@/pages/PostDetail"
import Setting from "@/pages/Setting"
import NotFound from "@/app/404-Not-Found"
import { ProtectedAuthRoute } from "@/app/ProtectedAuthRoute"
import { useAuth } from "@/features/auth/hooks/useAuth"

function ProtectedMainLayout() {
  const { user } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    // If user is NOT authenticated, redirect to auth
    if (!user) {
      navigate("/auth", { replace: true })
    }
  }, [user, navigate])

  // Only render if user is authenticated
  if (!user) {
    return null
  }

  return <MainLayout />
}

export default function AppRoutes() {
  return (
    <Routes>
      <Route element={<ProtectedMainLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/explore" element={<Explore />} />
        <Route path="/search" element={<Explore />} />
        <Route path="/notifications" element={<Notifications />} />
        <Route path="/bookmarks" element={<Bookmarks />} />
        <Route path="/messages" element={<Messages />} />
        <Route path="/profile/:id" element={<Profile />} />
        <Route path="/posts/:id" element={<PostDetail />} />
        <Route path="/settings" element={<Setting />} />
      </Route>
      <Route element={<AuthLayout />}>
        <Route
          path="/auth"
          element={
            <ProtectedAuthRoute>
              <Login />
            </ProtectedAuthRoute>
          }
        />
      </Route>
      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}
