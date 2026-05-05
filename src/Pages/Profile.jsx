import SideNav from "../components/ui/SideNav"
import TopNav from "../components/ui/TopNav"
import Footer from "../components/ui/Footer"
import Posts from "../components/ui/Posts"
import Likes from "../components/ui/Likes"
import Saved from "../components/ui/Saved"
import { FaShareAlt } from "react-icons/fa"
import { PiSquaresFourFill } from "react-icons/pi"
import { FaHeart } from "react-icons/fa"
import { FaBookmark } from "react-icons/fa6"
import { useState } from "react"

export default function Profile() {
  const [showPosts, setShowPosts] = useState(true)
  const [showLikes, setShowLikes] = useState(false)
  const [showSaved, setShowSaved] = useState(false)
  const [isActive, setIsActive] = useState("posts")

  function displayPosts() {
    setIsActive("posts")
    setShowPosts(true)
    setShowLikes(false)
    setShowSaved(false)
  }

  function displayLikes() {
    setIsActive("likes")
    setShowPosts(false)
    setShowLikes(true)
    setShowSaved(false)
  }

  function displaySaved() {
    setIsActive("saved")
    setShowPosts(false)
    setShowLikes(false)
    setShowSaved(true)
  }

  return (
    <>
      <TopNav />
      <div className="flex flex-row items-stretch space-x-7">
        <SideNav />
        {/* Profile Page View */}
        <div className="flex flex-1 flex-col space-y-5 md:mr-0">
          <div className="flex w-full flex-col">
            <img
              src="https://i.ytimg.com/vi/_YRZAF4Ni9k/maxresdefault.jpg"
              alt="Profile picture"
              className="h-35 md:h-80 w-full rounded-bl-lg border-b border-l border-primary/20 object-cover"
            />
            <div className="flex flex-row items-center justify-between">
              <img
                src="https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTV8fHByb2ZpbGUlMjBwaWN0dXJlfGVufDB8fDB8fHww"
                alt="Profile Picture"
                className="-m-20  ml-7 size-22 rounded-xl border-3 border-white/10 object-cover md:h-40 md:w-40"
              />
              <div className="mt-3 mr-4 md:mr-15 flex flex-row gap-1 md:ap-3">
                <button className="transition-color rounded-full border-white/10 bg-primary/10 px-3 py-1 md:px-4 md:py-2 tracking-wide md:tracking-wider text-primary duration-200 hover:bg-primary/15 text-xs md:text-sm">
                  Edit Profile
                </button>
                <button className="transition-color rounded-full border-white/10 bg-primary/10 px-3 py-0.5 md:px-4 md:py-2 tracking-wider text-primary/80 duration-200 hover:bg-primary/15 text-[10px] md:text-sm">
                  <FaShareAlt />
                </button>
              </div>
            </div>
          </div>

          {/*Second section */}
          <div className="mt-8 md:mt-15 ml-7 flex flex-col items-start space-y-5 md:space-y-8">
            <p className="text-xl md:text-2xl font-semibold text-primary">Elena Vance</p>
            <p className="text-sm md:text-md -mt-6 md:-mt-8 text-blue-600">@elana_vance</p>
            <p className="text-primary/75 text-sm mr-3 md:text-md md:w-full lg:w-1/3">
              Visual storyteller and digital architect. Crafting immersive
              experiences at the intersection of light, code, and emotion.
              Translating abstract ideas into tactile interfaces, where design
              breathes and systems feel human. Driven by precision, guided by
              curiosity—building worlds that don’t just function, but resonate.
            </p>
            <div className="flex flex-row items-center gap-8 md:gap-10">
              <div className="flex flex-col items-center gap-0.5">
                <p className="text-lg md:text-xl font-semibold">12.4K</p>
                <p className="text-[12px] md:text-sm font-light text-primary/60">Followers</p>
              </div>
              <div className="flex flex-col items-center gap-0.5">
                <p className="text-lg md:text-xl font-semibold">842</p>
                <p className="text-[12px] md:text-sm font-light text-primary/60">Following</p>
              </div>
              <div className="flex flex-col items-center gap-0.5">
                <p className="text-lg md:text-xl font-semibold">156</p>
                <p className="text-[12px] md:text-sm font-light text-primary/60">Posts</p>
              </div>
            </div>
          </div>

          {/*Button to select what to display */}
          <div className="spacing-y-5 mt-8 md:mt-15 ml-7 flex flex-col items-start">
            <div className="flex flex-row w-full items-center justify-between lg:pr-50 text-primary/90 pr-3">
              <button
                className={`pb-2 text-xl transition-all duration-100 ${isActive === "posts" && "border-b border-primary"}`}
                onClick={() => displayPosts()}
              >
                <div className="gap-1 md:gap-2 flex flex-row items-center">
                  <PiSquaresFourFill />
                </div>
              </button>
              <button
                className={`pb-2 text-lg transition-all duration-100 ${isActive === "likes" && "text-red-700"}`}
                onClick={() => displayLikes()}
              >
                <div className="gap-1 md:gap-2 flex flex-row items-center">
                  <FaHeart />
                </div>
              </button>
              <button
                className={`pb-2 text-md transition-all duration-100 ${isActive === "saved" && "text-yellow-600"}`}
                onClick={() => displaySaved()}
              >
                <div className="gap-1 md:gap-2 flex flex-row items-center">
                  <FaBookmark />
                </div>
              </button>
            </div>

            {/* POSTS, LIKES AND SAVED DISPLAY GRID */}

            {showPosts && <Posts />}

            {showLikes && <Likes />}

            {showSaved && <Saved />}
          </div>
        </div>
      </div>
      <Footer />
    </>
  )
}
