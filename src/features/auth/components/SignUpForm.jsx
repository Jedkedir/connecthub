import { FaApple, FaGoogle, FaMicrosoft } from "react-icons/fa"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"

export default function SignupForm() {
  return (
    <div className="mt-4 flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <Label htmlFor="signup-name" className="text-muted-foreground">
          Fullname
        </Label>
        <Input id="signup-name" placeholder="John Doe" type="text" />
      </div>
      <div className="flex flex-col gap-2">
        <Label htmlFor="signup-identifier" className="text-muted-foreground">
          Email or Username
        </Label>
        <Input
          id="signup-identifier"
          placeholder="@name@atelier.com"
          type="text"
        />
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="signup-password" className="text-muted-foreground">
          Password
        </Label>
        <Input id="signup-password" placeholder="•••••••••••" type="password" />
      </div>

      <Button className="w-full" size="lg">
        Register
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
    </div>
  )
}
