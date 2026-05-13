import { useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { useAuth } from "@/features/auth/hooks/useAuth"

export default function NotFound() {
  const navigate = useNavigate()
  const { user } = useAuth()

  useEffect(() => {
    // Redirect to auth if not authenticated
    if (!user) {
      navigate("/auth", { replace: true })
    }
  }, [user, navigate])

  // Don't render 404 if not authenticated
  if (!user) {
    return null
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardContent className="flex flex-col items-center gap-6 p-8 text-center">
          <div className="space-y-2">
            <h1 className="text-6xl font-bold text-primary">404</h1>
            <h2 className="text-2xl font-semibold">Page Not Found</h2>
            <p className="text-muted-foreground">
              Sorry, the page you&apos;re looking for doesn&apos;t exist or has
              been moved.
            </p>
          </div>

          <div className="flex w-full flex-col gap-2">
            <Button onClick={() => navigate("/")} className="w-full">
              Go to Home
            </Button>
            <Button
              onClick={() => navigate(-1)}
              variant="outline"
              className="w-full"
            >
              Go Back
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
