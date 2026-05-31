import { useState } from "react"
import { Link } from "react-router-dom"
import { useFollows } from "../hooks/useFollows"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { UserPlus, UserMinus } from "lucide-react"

export default function Follow({ user, currentUser, showActions = true }) {
  const userData = user || {}
  const { unfollowUser, sendFollowRequest } = useFollows()
  const [isFollowing, setIsFollowing] = useState(userData.isFollowing || false)
  const [isLoading, setIsLoading] = useState(false)

  // Check if this is the current user's own profile
  const isOwnProfile = userData._id === currentUser?._id

  const handleUnfollow = async () => {
    setIsLoading(true)
    try {
      await unfollowUser(userData._id)
      setIsFollowing(false)
    } catch (error) {
      console.error("Error unfollowing user:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleFollow = async () => {
    setIsLoading(true)
    try {
      await sendFollowRequest(userData._id)
      setIsFollowing(true)
    } catch (error) {
      console.error("Error following user:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const getInitials = (fullname) => {
    return fullname?.slice(0, 2).toUpperCase() || "??"
  }

  // Determine button text and action based on state
  const renderButton = () => {
    // Don't show button if it's the current user's own profile
    if (isOwnProfile) return null

    // Don't show button if showActions is false
    if (!showActions) return null
    if (userData.isPending) {
      return (
        <Button
          size="sm"
          variant="outline"
          disabled
          className="w-full sm:w-auto"
        >
          <UserPlus className="mr-2 h-4 w-4" />
          Pending
        </Button>
      )
    }
    if (isFollowing) {
      return (
        <Button
          size="sm"
          variant="outline"
          onClick={handleUnfollow}
          disabled={isLoading}
          className="w-full sm:w-auto"
        >
          <UserMinus className="mr-2 h-4 w-4" />
          {isLoading ? "Unfollowing..." : "Unfollow"}
        </Button>
      )
    }

    return (
      <Button
        size="sm"
        variant="default"
        onClick={handleFollow}
        disabled={isLoading}
        className="w-full sm:w-auto"
      >
        <UserPlus className="mr-2 h-4 w-4" />
        {isLoading ? "Following..." : "Follow"}
      </Button>
    )
  }

  return (
    <Card className="w-full transition-all duration-200 hover:shadow-md">
      <CardContent className="p-4 sm:p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          {/* User Info Section - Clickable Link */}
          <Link
            to={`/profile/${userData._id}`}
            className="group flex min-w-0 flex-1 cursor-pointer items-center gap-3 sm:gap-4"
          >
            <Avatar className="h-12 w-12 flex-shrink-0 transition-transform group-hover:scale-105 sm:h-14 sm:w-14">
              {userData.profilePic ? (
                <AvatarImage
                  src={
                    userData.profilePic ||
                    "https://api.dicebear.com/9.x/adventurer-neutral/svg"
                  }
                  alt={userData.fullname}
                />
              ) : null}
              <AvatarFallback className="bg-primary/10 text-sm text-primary sm:text-base">
                {getInitials(userData.fullname)}
              </AvatarFallback>
            </Avatar>

            <div className="min-w-0 flex-1">
              <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:gap-3">
                <h3 className="truncate text-base font-semibold transition-colors group-hover:text-primary sm:text-lg">
                  {userData.fullname}
                </h3>
                {userData.username && (
                  <span className="truncate text-xs text-muted-foreground sm:text-sm">
                    @{userData.username}
                  </span>
                )}
              </div>

              <div className="mt-1 flex flex-wrap gap-4 sm:mt-2">
                {typeof userData.followersCount === "number" && (
                  <span className="text-xs text-muted-foreground sm:text-sm">
                    <span className="font-semibold text-foreground">
                      {userData.followersCount}
                    </span>{" "}
                    followers
                  </span>
                )}
                {typeof userData.followingCount === "number" && (
                  <span className="text-xs text-muted-foreground sm:text-sm">
                    <span className="font-semibold text-foreground">
                      {userData.followingCount}
                    </span>{" "}
                    following
                  </span>
                )}
              </div>
            </div>
          </Link>

          {/* Action Button Section */}
          {renderButton() && (
            <div className="w-full flex-shrink-0 sm:w-auto">
              {renderButton()}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

// Loading skeleton component
export function FollowSkeleton() {
  return (
    <Card className="w-full">
      <CardContent className="p-4 sm:p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-1 items-center gap-3 sm:gap-4">
            <Skeleton className="h-12 w-12 rounded-full sm:h-14 sm:w-14" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-5 w-32 sm:w-40" />
              <Skeleton className="h-3 w-24 sm:w-32" />
              <div className="mt-1 flex gap-4">
                <Skeleton className="h-3 w-16 sm:w-20" />
                <Skeleton className="h-3 w-16 sm:w-20" />
              </div>
            </div>
          </div>
          <Skeleton className="h-9 w-full sm:w-24" />
        </div>
      </CardContent>
    </Card>
  )
}
