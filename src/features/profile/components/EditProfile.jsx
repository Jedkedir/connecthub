import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { useProfile } from "../hooks/useProfile"
export default function EditProfile({profile}) {
  return (
    <Card>
      <CardContent className="p-6 text-sm text-muted-foreground">
        Nothing here.
      </CardContent>
    </Card>
  )
}
