import { useState } from "react"

export function useProfileTabs() {
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

  return {
    displayLikes,
    displayPosts,
    displaySaved,
    isActive,
    showLikes,
    showPosts,
    showSaved,
  }
}
