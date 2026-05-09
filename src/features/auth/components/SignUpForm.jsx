import { useState } from "react"
import { FaApple, FaGoogle, FaMicrosoft } from "react-icons/fa"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"

export default function SignupForm({ error, isLoading, onSubmit }) {
  const [fullName, setFullName] = useState("")
  const [identifier, setIdentifier] = useState("")
  const [password, setPassword] = useState("")

  const handleSubmit = async (event) => {
    event.preventDefault()

    try {
      await onSubmit({
        username: fullName,
        email: identifier,
        password,
      })

      setFullName("")
      setIdentifier("")
      setPassword("")
    } catch {
      // The parent hook already exposes the error state.
    }
  }

  return (
    <form className="mt-4 flex flex-col gap-6" onSubmit={handleSubmit}>
      <div className="flex flex-col gap-2">
        <Label htmlFor="signup-name" className="text-muted-foreground">
          Full name
        </Label>
        <Input
          autoComplete="name"
          id="signup-name"
          onChange={(event) => setFullName(event.target.value)}
          placeholder="John Doe"
          required
          type="text"
          value={fullName}
        />
      </div>
      <div className="flex flex-col gap-2">
        <Label htmlFor="signup-identifier" className="text-muted-foreground">
          Email or Username
        </Label>
        <Input
          autoComplete="email"
          id="signup-identifier"
          onChange={(event) => setIdentifier(event.target.value)}
          placeholder="name@atelier.com"
          required
          type="text"
          value={identifier}
        />
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="signup-password" className="text-muted-foreground">
          Password
        </Label>
        <Input
          autoComplete="new-password"
          id="signup-password"
          onChange={(event) => setPassword(event.target.value)}
          placeholder="•••••••••••"
          required
          type="password"
          value={password}
        />
      </div>

      {error ? (
        <p className="text-sm text-destructive" role="alert">
          {error}
        </p>
      ) : null}

      <Button className="w-full" size="lg" type="submit" disabled={isLoading}>
        {isLoading ? "Creating Account..." : "Register"}
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
