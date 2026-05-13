import { useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "@/features/auth/hooks/useAuth"

export function ProtectedAuthRoute({ children }) {
  const { user } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    // If user is already authenticated, redirect to home
    if (user) {
      navigate("/", { replace: true })
    }
  }, [user, navigate])

  // If user is authenticated, don't render the login page
  if (user) {
    return null
  }

  return children
}
