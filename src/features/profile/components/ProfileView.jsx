import { FaShareAlt } from "react-icons/fa"
import { FaHeart } from "react-icons/fa"
import { FaBookmark } from "react-icons/fa6"
import { PiSquaresFourFill } from "react-icons/pi"

import Likes from "@/features/posts/components/Likes"
import Posts from "@/features/posts/components/Posts"
import Saved from "@/features/posts/components/Saved"
import { useProfileTabs } from "@/features/profile/hooks/useProfileTabs"

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

  return (
    <div className="flex flex-1 flex-col space-y-5 md:mr-0">
      <div className="flex w-full flex-col">
        <img
          src="https://i.ytimg.com/vi/_YRZAF4Ni9k/maxresdefault.jpg"
          alt="Profile picture"
          className="h-35 w-full rounded-bl-lg border-b border-l border-primary/20 object-cover md:h-80"
        />
        <div className="flex flex-row items-center justify-between">
          <img
            src="https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTV8fHByb2ZpbGUlMjBwaWN0dXJlfGVufDB8fDB8fHww"
            alt="Profile Picture"
            className="-m-20 ml-7 size-22 rounded-xl border-3 border-white/10 object-cover md:h-40 md:w-40"
          />
          <div className="md:ap-3 mt-3 mr-4 flex flex-row gap-1 md:mr-15">
            <button className="transition-color rounded-full border-white/10 bg-primary/10 px-3 py-1 text-xs tracking-wide text-primary duration-200 hover:bg-primary/15 md:px-4 md:py-2 md:text-sm md:tracking-wider">
              Edit Profile
            </button>
            <button className="transition-color rounded-full border-white/10 bg-primary/10 px-3 py-0.5 text-[10px] tracking-wider text-primary/80 duration-200 hover:bg-primary/15 md:px-4 md:py-2 md:text-sm">
              <FaShareAlt />
            </button>
          </div>
        </div>
      </div>

      <div className="mt-8 ml-7 flex flex-col items-start space-y-5 md:mt-15 md:space-y-8">
        <p className="text-xl font-semibold text-primary md:text-2xl">
          Elena Vance
        </p>
        <p className="md:text-md -mt-6 text-sm text-blue-600 md:-mt-8">
          @elana_vance
        </p>
        <p className="md:text-md mr-3 text-sm text-primary/75 md:w-full lg:w-1/3">
          Visual storyteller and digital architect. Crafting immersive
          experiences at the intersection of light, code, and emotion.
          Translating abstract ideas into tactile interfaces, where design
          breathes and systems feel human. Driven by precision, guided by
          curiosityâ€”building worlds that donâ€™t just function, but resonate.
        </p>
        <div className="flex flex-row items-center gap-8 md:gap-10">
          <div className="flex flex-col items-center gap-0.5">
            <p className="text-lg font-semibold md:text-xl">12.4K</p>
            <p className="text-[12px] font-light text-primary/60 md:text-sm">
              Followers
            </p>
          </div>
          <div className="flex flex-col items-center gap-0.5">
            <p className="text-lg font-semibold md:text-xl">842</p>
            <p className="text-[12px] font-light text-primary/60 md:text-sm">
              Following
            </p>
          </div>
          <div className="flex flex-col items-center gap-0.5">
            <p className="text-lg font-semibold md:text-xl">156</p>
            <p className="text-[12px] font-light text-primary/60 md:text-sm">
              Posts
            </p>
          </div>
        </div>
      </div>

      <div className="spacing-y-5 mt-8 ml-7 flex flex-col items-start md:mt-15">
        <div className="flex w-full flex-row items-center justify-between pr-3 text-primary/90 lg:pr-50">
          <button
            className={`pb-2 text-xl transition-all duration-100 ${isActive === "posts" && "border-b border-primary"}`}
            onClick={displayPosts}
          >
            <div className="flex flex-row items-center gap-1 md:gap-2">
              <PiSquaresFourFill />
            </div>
          </button>
          <button
            className={`pb-2 text-lg transition-all duration-100 ${isActive === "likes" && "text-red-700"}`}
            onClick={displayLikes}
          >
            <div className="flex flex-row items-center gap-1 md:gap-2">
              <FaHeart />
            </div>
          </button>
          <button
            className={`text-md pb-2 transition-all duration-100 ${isActive === "saved" && "text-yellow-600"}`}
            onClick={displaySaved}
          >
            <div className="flex flex-row items-center gap-1 md:gap-2">
              <FaBookmark />
            </div>
          </button>
        </div>

        {showPosts && <Posts />}
        {showLikes && <Likes />}
        {showSaved && <Saved />}
      </div>
    </div>
  )
}
