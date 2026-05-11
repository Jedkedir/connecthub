import { useEffect, useState } from "react"
import { FaHeart, FaShareAlt } from "react-icons/fa"
import { FaBookmark } from "react-icons/fa6"
import { PiSquaresFourFill } from "react-icons/pi"
import { Avatar, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import Likes from "@/features/posts/components/Likes"
import Posts from "@/features/posts/components/Posts"
import Saved from "@/features/posts/components/Saved"
import { useProfileTabs } from "@/features/profile/hooks/useProfileTabs"

import { useAuthStore } from "@/features/auth"
import { useProfile } from "../hooks/useProfile"
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
  } = useProfileTabs()

  const [profile, setProfile] = useState()
  const currentUser = useAuthStore((state) => state.user)

  const authenticatedUserProfile =
    currentUser?._id === userId ||
    currentUser?.userId === userId ||
    currentUser?.id === userId

  const { getUserById, getCurrentUser } = useProfile()

  const getProfile = async (id) => {
    if (!id) return null
    if (authenticatedUserProfile) {
      // if current user, prefer currentUser from store
      return currentUser || (await getCurrentUser())
    }
    return await getUserById(id)
  }

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await getProfile(userId)
        setProfile(data)
      } catch (err) {
        console.error("Error fetching profile:", err)
      }
    }

    fetchProfile()
  }, [userId, authenticatedUserProfile])
  console.log("PROFILE IN PROFILE VIEW", profile)
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
                src={profile?.profilePic ?? null}
                alt={profile?.username ?? "User"}
              />
            </Avatar>
              <div className="flex flex-row gap-2">
                {authenticatedUserProfile && (
                  <Button type="button" variant="outline">
                    Edit Profile
                  </Button>
                )}
                <Button size="icon" type="button" variant="outline">
                  <FaShareAlt />
                </Button>
              </div>
          </div>
        </CardContent>
      </Card>

      <section className="flex flex-col items-start gap-6">
        <div className="flex flex-col gap-1">
          <h2 className="text-2xl font-semibold tracking-normal text-foreground">
            {profile?.username ?? "User Name"}
          </h2>
          <p className="text-sm text-muted-foreground">@{profile?.email ?? ""}</p>
        </div>
        <p className="max-w-2xl text-sm leading-6 text-muted-foreground md:text-base">
          {profile?.bio ??
            "Tech enthusiast, digital artist, and coffee lover. Sharing my journey through code and creativity."}
        </p>
        <div className="flex flex-row items-center gap-8">
          {[
            [profile?.followerCount ?? "0", "Followers"],
            [profile?.followingCount ?? "0", "Following"],
            [profile?.postCount ?? "0", "Posts"],
          ].map(([value, label]) => (
            <div key={label} className="flex flex-col gap-1">
              <p className="text-xl font-semibold">{value}</p>
              <p className="text-sm text-muted-foreground">{label}</p>
            </div>
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

        {showPosts && <Posts user={profile} />}
        {authenticatedUserProfile && showLikes && <Likes user={profile} />}
        {authenticatedUserProfile && showSaved && <Saved user={profile} />}
      </section>
    </div>
  )
}
