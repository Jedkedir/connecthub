import { useState } from "react"
import { FaApple, FaGoogle, FaMicrosoft } from "react-icons/fa"
import { EyeOffIcon, EyeIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Field, FieldLabel } from "@/components/ui/field"
import {
  InputGroup,
  InputGroupInput,
  InputGroupButton,
} from "@/components/ui/input-group"

import { Separator } from "@/components/ui/separator"
import { loginSchema } from "@/validators/authValidator"
import { validateSchema } from "@/validators/validation"

export default function LoginForm({ error, isLoading, onSubmit }) {
  const [identifier, setIdentifier] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [validationError, setValidationError] = useState("")

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev)
  }
  const handleSubmit = async (event) => {
    event.preventDefault()

    const { error: schemaError, value } = validateSchema(loginSchema, {
      email: identifier,
      password,
    })

    if (schemaError) {
      setValidationError(schemaError)
      return
    }

    setValidationError("")

    try {
      await onSubmit(value)

      setPassword("")
    } catch {
      // The parent hook already exposes the error state.
    }
  }

  return (
    <form className="mt-4 flex flex-col gap-6" onSubmit={handleSubmit}>
      <Field className="flex flex-col gap-2">
        <FieldLabel
          htmlFor="login-identifier"
          className="text-muted-foreground"
        >
          Email
        </FieldLabel>
        <InputGroup>
          <InputGroupInput
            autoComplete="username"
            id="login-identifier"
            onChange={(event) => setIdentifier(event.target.value)}
            placeholder="name@connecthub.com"
            required
            type="text"
            value={identifier}
          />
        </InputGroup>
      </Field>
      <Field className="flex flex-col gap-2">
        <FieldLabel htmlFor="login-password" className="text-muted-foreground">
          Password
        </FieldLabel>
        <InputGroup>
          <InputGroupInput
            id="login-password"
            onChange={(event) => setPassword(event.target.value)}
            required
            type={showPassword ? "text" : "password"}
            value={password}
            placeholder="Enter password"
          />
          <InputGroupButton
            align="inline-end"
            onClick={togglePasswordVisibility}
            className="cursor-pointer"
          >
            {showPassword ? <EyeIcon /> : <EyeOffIcon />}
          </InputGroupButton>
        </InputGroup>
      </Field>

      {validationError || error ? (
        <p className="text-sm text-destructive" role="alert">
          {validationError || error}
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
