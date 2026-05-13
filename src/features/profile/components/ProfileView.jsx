import { useEffect, useState } from "react"
import { FaHeart, FaShareAlt } from "react-icons/fa"
import { FaBookmark } from "react-icons/fa6"
import { PiSquaresFourFill } from "react-icons/pi"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import Likes from "@/features/posts/components/Likes"
import Posts from "@/features/posts/components/Posts"
import Saved from "@/features/posts/components/Saved"
import Follower from "@/features/follows/components/Follower"
import Following from "@/features/follows/components/Following"
import EditProfile from "./EditProfile"
import { useProfileTabs } from "@/features/profile/hooks/useProfileTabs"

import { useAuthStore } from "@/features/auth"
import { useProfile } from "../hooks/useProfile"
import { useFollows } from "../../follows/hooks/useFollows"
import { cn } from "@/shared/utils"

export default function ProfileView({ userId }) {
  const {
    displayLikes,
    displayPosts,
    displaySaved,
    isActive,
    showLikes,
    showPosts,
    showSaved,
    displayFollowers,
    displayFollowing,
    displayEditProfile,
    showFollowers,
    showFollowing,
    showEditProfile,
  } = useProfileTabs()

  const currentUser = useAuthStore((state) => state.user)
  const [profile, setProfile] = useState(null)
  const [postCount, setPostCount] = useState(0)
  const [isFollowing, setIsFollowing] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  const authenticatedUserProfile = currentUser?._id === userId

  const { getUserById, getCurrentUser } = useProfile()
  const { sendFollowRequest, unfollowUser } = useFollows()

  const getProfile = async (id) => {
    if (!id) return null
    if (authenticatedUserProfile) {
      // if current user, prefer currentUser from store
      //if (currentUser) return { user: currentUser, isFollowing: false }
      const response = await getCurrentUser()
      return response
    }
    return await getUserById(id)
  }

  const handleFollow = async () => {
    if (!profile?._id) return

    try {
      await sendFollowRequest(profile._id)
      setIsFollowing(true)
      setProfile((p) => ({
        ...p,
        followerCount: (Number(p?.followerCount) || 0) + 1,
      }))
    } catch (err) {
      console.error("Error sending follow request:", err)
    }
  }

  const handleUnfollow = async () => {
    if (!profile?._id) return
    try {
      await unfollowUser(profile._id)
      setIsFollowing(false)
      setProfile((p) => ({
        ...p,
        followerCount: Math.max(0, (Number(p?.followerCount) || 1) - 1),
      }))
    } catch (err) {
      console.error("Error unfollowing user:", err)
    }
  }

  const handleShare = () => {
    // Implement share functionality
    if (navigator.share) {
      navigator.share({
        title: profile?.username,
        text: `Check out ${profile?.username}'s profile`,
        url: window.location.href,
      })
    }
  }

  useEffect(() => {
    const fetchProfile = async () => {
      setIsLoading(true)
      try {
        const response = await getProfile(userId)

        // Handle different response structures
        let userData = null
        let isFollowed = false

        // Check if response has a data property (axios response)
        if (response?.data) {
          const responseData = response.data
          if (responseData.user) {
            userData = responseData.user
            isFollowed = responseData.isFollowing || false
          } else if (responseData._id) {
            userData = responseData
            isFollowed = responseData.isFollowing || false
          }
        }
        // Check if response directly has user property
        else if (response?.user) {
          userData = response.user
          isFollowed = response.isFollowing || false
        }
        // Check if response itself is the user object
        else if (response?._id) {
          userData = response
          isFollowed = response.isFollowing || false
        }

        console.log("Response", response)
        if (userData) {
          setProfile(userData)
          setIsFollowing(userData.isFollowing || isFollowed)
        } else {
          console.error("No user data found in response:", response)
          setProfile(null)
        }
      } catch (err) {
        console.error("Error fetching profile:", err)
        setProfile(null)
      } finally {
        setIsLoading(false)
      }
    }

    if (userId) {
      fetchProfile()
    }
  }, [userId, authenticatedUserProfile, currentUser])

  // Loading state
  if (isLoading) {
    return (
      <div className="flex flex-1 flex-col gap-8">
        <Card className="overflow-hidden">
          <CardContent className="p-0">
            <div className="h-40 w-full animate-pulse bg-muted md:h-80" />
            <div className="flex flex-row items-center justify-between p-6">
              <div className="-mt-20 size-24 animate-pulse rounded-xl bg-muted md:size-40" />
              <div className="flex flex-row gap-2">
                <div className="h-10 w-24 animate-pulse rounded-md bg-muted" />
                <div className="h-10 w-10 animate-pulse rounded-md bg-muted" />
              </div>
            </div>
          </CardContent>
        </Card>
        <div className="flex flex-col gap-4">
          <div className="h-8 w-48 animate-pulse rounded bg-muted" />
          <div className="h-4 w-64 animate-pulse rounded bg-muted" />
          <div className="h-20 w-full animate-pulse rounded bg-muted" />
        </div>
      </div>
    )
  }

  if (!profile) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <p className="text-muted-foreground">User not found</p>
        </CardContent>
      </Card>
    )
  }
  console.log("Profile data loaded:", profile) // Debug log
  return (
    <div className="flex flex-1 flex-col gap-8">
      <Card className="overflow-hidden">
        <CardContent className="p-0">
          <img
            src="https://i.ytimg.com/vi/_YRZAF4Ni9k/maxresdefault.jpg"
            alt="Profile cover"
            className="h-40 w-full object-cover md:h-80"
          />
          <div className="flex flex-row items-center justify-between p-6">
            <Avatar className="-mt-20 size-24 rounded-xl border-4 border-background md:size-40">
              <AvatarImage
                src={
                  profile?.profilePic ??
                  "https://api.dicebear.com/9.x/adventurer-neutral/svg"
                }
                alt={profile?.username ?? "User"}
              />
              <AvatarFallback className="bg-primary/10 text-sm text-primary sm:text-base">
                {profile?.username
                  ? profile.username.charAt(0).toUpperCase()
                  : "U"}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-row gap-2">
              {authenticatedUserProfile && (
                <Button
                  className={cn(isActive === "editProfile" && "bg-accent")}
                  type="button"
                  variant="outline"
                  onClick={displayEditProfile}
                >
                  Edit Profile
                </Button>
              )}
              {!authenticatedUserProfile && isFollowing && (
                <Button size="sm" variant="outline" onClick={handleUnfollow}>
                  Unfollow
                </Button>
              )}
              {!authenticatedUserProfile && !isFollowing && (
                <Button
                  size="sm"
                  variant="default"
                  onClick={handleFollow}
                  disabled={profile?.isPending}
                >
                  {profile?.isPending ? "Requested" : "Follow"}
                </Button>
              )}

              {profile && (
                <Button
                  size="icon"
                  type="button"
                  variant="outline"
                  onClick={handleShare}
                >
                  <FaShareAlt />
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <section className="flex flex-col items-start gap-6">
        <div className="flex flex-col gap-1">
          <h2 className="text-2xl font-semibold tracking-normal text-foreground">
            {profile?.username ?? "User Name"}
          </h2>
          <p className="text-sm text-muted-foreground">
            {profile?.email ?? ""}
          </p>
        </div>
        <p className="max-w-2xl text-sm leading-6 text-muted-foreground md:text-base">
          {profile?.bio ??
            "Tech enthusiast, digital artist, and coffee lover. Sharing my journey through code and creativity."}
        </p>
        <div className="flex flex-row items-center gap-8">
          {[
            [profile?.followerCount ?? "0", "Followers", displayFollowers],
            [profile?.followingCount ?? "0", "Following", displayFollowing],
            [profile?.postCount ?? "0", "Posts", displayPosts],
          ].map(([value, label, fn]) => (
            <Button
              key={label}
              className={cn(isActive === label.toLowerCase() && "bg-accent")}
              onClick={fn}
              variant="outline"
              size="sm"
            >
              <p className="text-xl font-semibold">{value}</p>
              <p className="text-sm text-muted-foreground">{label}</p>
            </Button>
          ))}
        </div>
      </section>

      <section className="flex flex-col gap-6">
        <div className="flex w-full flex-row items-center justify-between">
          <Button
            className={cn(isActive === "posts" && "bg-accent")}
            onClick={displayPosts}
            size="icon"
            type="button"
            variant="ghost"
          >
            <PiSquaresFourFill />
          </Button>
          <Button
            className={cn(isActive === "likes" && "bg-accent")}
            onClick={displayLikes}
            size="icon"
            type="button"
            variant="ghost"
          >
            <FaHeart />
          </Button>
          <Button
            className={cn(isActive === "saved" && "bg-accent")}
            onClick={displaySaved}
            size="icon"
            type="button"
            variant="ghost"
          >
            <FaBookmark />
          </Button>
        </div>
        <Separator />

        {showPosts && <Posts user={profile} setPostCount={setPostCount} />}
        {authenticatedUserProfile && showLikes && <Likes user={profile} />}
        {authenticatedUserProfile && showSaved && <Saved user={profile} />}
        {authenticatedUserProfile && showEditProfile && (
          <EditProfile user={profile} />
        )}
        {showFollowers && <Follower userId={userId} />}
        {showFollowing && <Following userId={userId} />}
      </section>
    </div>
  )
}
