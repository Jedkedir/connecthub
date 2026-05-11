import * as React from "react"

import { cn } from "@/shared/utils"

function Avatar({ className, ...props }) {
  return (
    <div
      className={cn(
        "relative flex size-10 shrink-0 overflow-hidden rounded-full",
        className
      )}
      data-slot="avatar"
      {...props}
    />
  )
}

function AvatarImage({ className, ...props }) {
  return (
    <img
      className={cn("aspect-square size-full object-cover", className)}
      data-slot="avatar-image"
      {...props}
    />
  )
}

function AvatarFallback({ className, ...props }) {
  return (
    <div
      className={cn(
        "flex size-full items-center justify-center rounded-full bg-muted text-muted-foreground",
        className
      )}
      data-slot="avatar-fallback"
      {...props}
    />
  )
}

export { Avatar, AvatarFallback, AvatarImage }
