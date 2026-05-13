import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { useFollows } from "../hooks/useFollows"
import Follow, { FollowSkeleton } from "./Follow"
import { useAuthStore } from "@/features/auth"

export default function Follower({ userId }) {
  const { getFollowers } = useFollows()
  const currentUser = useAuthStore((state) => state.user)
  const [followers, setFollowers] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchFollowers = async () => {
      try {
        setIsLoading(true)
        const { data } = await getFollowers(userId)
        setFollowers(data.followers || [])
      } catch (error) {
        console.error("Error fetching followers:", error)
      } finally {
        setIsLoading(false)
      }
    }

    if (userId) {
      fetchFollowers()
    }
  }, [getFollowers, userId])

  if (isLoading) {
    return (
      <div className="mx-auto flex w-full max-w-4xl flex-col gap-4">
        {[1, 2, 3].map((i) => (
          <FollowSkeleton key={i} />
        ))}
      </div>
    )
  }

  if (followers.length === 0) {
    return (
      <Card>
        <CardContent className="p-8 text-center text-sm text-muted-foreground">
          No followers yet.
        </CardContent>
      </Card>
    )
  }
  console.log("Followers loaded:", followers) // Debug log
  return (
    <div className="mx-auto flex w-full max-w-4xl flex-col gap-4">
      {followers.map((follower) => (
        <Follow
          key={follower._id}
          user={follower}
          currentUser={currentUser}
          showActions={currentUser._id === userId}
        />
      ))}
    </div>
  )
}
