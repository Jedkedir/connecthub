import * as React from "react"

import { cn } from "@/shared/utils"

function Label({ className, ...props }) {
  return (
    <label
      className={cn(
        "text-sm leading-none font-medium text-foreground peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
        className
      )}
      data-slot="label"
      {...props}
    />
  )
}

export { Label }
