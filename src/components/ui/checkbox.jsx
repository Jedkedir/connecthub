import * as React from "react"

import { cn } from "@/shared/utils"

function Checkbox({ className, ...props }) {
  return (
    <input
      className={cn(
        "size-4 rounded-sm border border-input accent-primary focus-visible:ring-2 focus-visible:ring-ring",
        className
      )}
      data-slot="checkbox"
      type="checkbox"
      {...props}
    />
  )
}

export { Checkbox }
