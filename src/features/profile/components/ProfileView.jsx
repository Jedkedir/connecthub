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

import {useAuthStore} from "@/features/auth"
//import { useProfileStore } from "@/features/profile"
import { cn } from "@/shared/utils"

export default function ProfileView() {
  const {
    displayLikes,
    displayPosts,
    displaySaved,
    isActive,
    showLikes,
    showPosts,
    showSaved,
  } = useProfileTabs()

  const user = useAuthStore((state) => state.user)
  //const userPosts = useProfileStore((state) => state.userPosts)


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
                src="https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTV8fHByb2ZpbGUlMjBwaWN0dXJlfGVufDB8fDB8fHww"
                alt="Profile"
              />
            </Avatar>
            <div className="flex flex-row gap-2">
              <Button type="button" variant="outline">
                Edit Profile
              </Button>
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
            {user?.username ?? "User Name"}
          </h2>
          <p className="text-sm text-muted-foreground">@{user?.email ?? ""}</p>
        </div>
        <p className="max-w-2xl text-sm leading-6 text-muted-foreground md:text-base">
          {user?.bio ?? "Tech enthusiast, digital artist, and coffee lover. Sharing my journey through code and creativity."}
        </p>
        <div className="flex flex-row items-center gap-8">
          {[
            [user?.followerCount ?? "0", "Followers"],
            [user?.followingCount ?? "0", "Following"],
            [user?.postCount ?? "0", "Posts"],
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

        {showPosts && <Posts />}
        {showLikes && <Likes />}
        {showSaved && <Saved />}
      </section>
    </div>
  )
}
