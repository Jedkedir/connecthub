import { useState } from "react"
import { FaApple, FaGoogle, FaMicrosoft } from "react-icons/fa"

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"

export default function LoginForm({ error, isLoading, onSubmit }) {
  const [identifier, setIdentifier] = useState("")
  const [password, setPassword] = useState("")
  const [rememberMe, setRememberMe] = useState(true)

  const handleSubmit = async (event) => {
    event.preventDefault()

    try {
      await onSubmit({
        email: identifier,
        password,
        rememberMe,
      })

      setPassword("")
    } catch {
      // The parent hook already exposes the error state.
    }
  }

  return (
    <form className="mt-4 flex flex-col gap-6" onSubmit={handleSubmit}>
      <div className="flex flex-col gap-2">
        <Label htmlFor="login-identifier" className="text-muted-foreground">
          Email or Username
        </Label>
        <Input
          autoComplete="username"
          id="login-identifier"
          onChange={(event) => setIdentifier(event.target.value)}
          placeholder="name@atelier.com"
          required
          type="text"
          value={identifier}
        />
      </div>
      <div className="flex flex-col gap-2">
        <Label htmlFor="login-password" className="text-muted-foreground">
          Password
        </Label>
        <Input
          autoComplete="current-password"
          id="login-password"
          onChange={(event) => setPassword(event.target.value)}
          placeholder="••••••••••"
          required
          type="password"
          value={password}
        />
      </div>

      <div className="flex flex-row items-center justify-between gap-6">
        <div className="flex flex-row items-center gap-2">
          <Checkbox
            checked={rememberMe}
            id="remember"
            onChange={(event) => setRememberMe(event.target.checked)}
          />
          <Label htmlFor="remember" className="text-muted-foreground">
            Remember me
          </Label>
        </div>
        <Button type="button" variant="link" className="h-auto p-0">
          Forgot Password?
        </Button>
      </div>

      {error ? (
        <p className="text-sm text-destructive" role="alert">
          {error}
        </p>
      ) : null}

      <Button className="w-full" size="lg" type="submit" disabled={isLoading}>
        {isLoading ? "Signing In..." : "Sign In"}
      </Button>

      <div className="flex items-center gap-4">
        <Separator className="flex-1" />
        <span className="text-xs text-muted-foreground">OR CONTINUE WITH</span>
        <Separator className="flex-1" />
      </div>

      <div className="flex flex-row gap-4">
        <Button className="flex-1" size="lg" type="button" variant="outline">
          <FaGoogle
            aria-hidden="true"
            className="h-5 w-5 text-muted-foreground"
          />
        </Button>
        <Button className="flex-1" size="lg" type="button" variant="outline">
          <FaApple
            aria-hidden="true"
            className="h-5 w-5 text-muted-foreground"
          />
        </Button>
        <Button className="flex-1" size="lg" type="button" variant="outline">
          <FaMicrosoft
            aria-hidden="true"
            className="h-5 w-5 text-muted-foreground"
          />
        </Button>
      </div>
    </form>
  )
}
