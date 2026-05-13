import { useMemo } from "react"
import { LogOut, MonitorCog, Moon, Palette,  Sun } from "lucide-react"
import { useNavigate } from "react-router-dom"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import EditProfile from "@/features/profile/components/EditProfile"
import { useAuth } from "@/features/auth/hooks/useAuth"
import { useTheme } from "@/shared/components"



export default function Setting() {
  const navigate = useNavigate()
  const { logout } = useAuth()
  const { theme, setTheme } = useTheme()

  const isSystemTheme = theme === "system"

  const activeThemeLabel = useMemo(() => {
    if (theme === "dark") {
      return "Dark"
    }

    if (theme === "light") {
      return "Light"
    }

    return "System"
  }, [theme])

  

  const handleLogout = () => {
    logout()
    navigate("/auth")
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6 py-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="mt-2 text-muted-foreground">
          Manage your account settings and preferences
        </p>
      </div>

      <EditProfile />

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Palette className="h-5 w-5" />
            Appearance
          </CardTitle>
          <CardDescription>
            Choose the app theme. Current theme: {activeThemeLabel}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid gap-2 sm:grid-cols-3">
            <Button
              variant={theme === "light" ? "default" : "outline"}
              className="w-full"
              onClick={() => setTheme("light")}
              type="button"
            >
              <Sun className="h-4 w-4" />
              Light
            </Button>
            <Button
              variant={theme === "dark" ? "default" : "outline"}
              className="w-full"
              onClick={() => setTheme("dark")}
              type="button"
            >
              <Moon className="h-4 w-4" />
              Dark
            </Button>
            <Button
              variant={isSystemTheme ? "default" : "outline"}
              className="w-full"
              onClick={() => setTheme("system")}
              type="button"
            >
              <MonitorCog className="h-4 w-4" />
              System
            </Button>
          </div>
        </CardContent>
      </Card>

      
      <Card>
        <CardHeader>
          <CardTitle>Account</CardTitle>
          <CardDescription>Sign out from your current session.</CardDescription>
        </CardHeader>
        <CardContent>
          <Separator className="mb-4" />
          <Button
            type="button"
            variant="destructive"
            onClick={handleLogout}
            className="w-full sm:w-auto"
          >
            <LogOut className="h-4 w-4" />
            Logout
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
