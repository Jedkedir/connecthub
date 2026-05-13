import { useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "@/features/auth/hooks/useAuth"

export function ProtectedRoute({ children }) {
  const { user } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    // If user is NOT authenticated, redirect to auth
    if (!user) {
      navigate("/auth", { replace: true })
    }
  }, [user, navigate])

  // Only render content if user is authenticated
  if (!user) {
    return null
  }

  return children
}
