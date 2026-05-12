import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { useFollows } from "../hooks/useFollows"
import { useAuthStore } from "@/features/auth"
import Follow, { FollowSkeleton } from "./Follow"

export default function Following({ userId }) {
  const { getFollowing } = useFollows()
  const currentUser = useAuthStore((state) => state.user)
  const [following, setFollowing] = useState([])
  const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
    const fetchFollowing = async () => {
      try {
        setIsLoading(true)
        const {data} = await getFollowing(userId)
        setFollowing(data.following || [])
      } catch (error) {
        console.error("Error fetching following:", error)
      } finally {
        setIsLoading(false)
      }
    }

    if (userId) {
      fetchFollowing()
    }
  }, [getFollowing, userId])

  if (isLoading) {
    return (
      <div className="mx-auto flex w-full max-w-4xl flex-col gap-4">
        {[1, 2, 3].map((i) => (
          <FollowSkeleton key={i} />
        ))}
      </div>
    )
  }

  if (following.length === 0) {
    return (
      <Card>
        <CardContent className="p-8 text-center text-sm text-muted-foreground">
          Not following anyone yet.
        </CardContent>
      </Card>
    )
  }
 return (
    <div className="mx-auto flex w-full max-w-4xl flex-col gap-4">
      {following.map((followedUser) => (
        <Follow 
          key={followedUser._id} 
          user={followedUser} 
          currentUser={currentUser}
          showActions={currentUser._id === userId}
        />
      ))}
    </div>
  )
}
