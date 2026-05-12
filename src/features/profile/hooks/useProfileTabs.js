import { useState } from "react"

export function useProfileTabs() {
  const [showPosts, setShowPosts] = useState(true)
  const [showLikes, setShowLikes] = useState(false)
  const [showSaved, setShowSaved] = useState(false)
  const [isActive, setIsActive] = useState("posts")
  const [showFollowers, setShowFollowers] = useState(false)
  const [showFollowing, setShowFollowing] = useState(false)
  const [showEditProfile, setShowEditProfile] = useState(false)

  function displayPosts() {
    setIsActive("posts")
    setShowPosts(true)
    setShowLikes(false)
    setShowSaved(false)
    setShowFollowers(false)
    setShowFollowing(false)
    setShowEditProfile(false)
  }

  function displayLikes() {
    setIsActive("likes")
    setShowPosts(false)
    setShowLikes(true)
    setShowSaved(false)
    setShowFollowers(false)
    setShowFollowing(false)
    setShowEditProfile(false)
  }

  function displaySaved() {
    setIsActive("saved")
    setShowPosts(false)
    setShowLikes(false)
    setShowSaved(true)
    setShowFollowers(false)
    setShowFollowing(false)
    setShowEditProfile(false)
  }
  function displayFollowers() {
    setIsActive("followers")
    setShowPosts(false)
    setShowLikes(false)
    setShowSaved(false)
    setShowFollowers(true)
    setShowFollowing(false)
    setShowEditProfile(false)
  }
  function displayFollowing() {
    setIsActive("following")
    setShowPosts(false)
    setShowLikes(false)
    setShowSaved(false)
    setShowFollowers(false)
    setShowFollowing(true)
    setShowEditProfile(false)
  }
  function displayEditProfile() {
    setIsActive("editProfile")
    setShowPosts(false)
    setShowLikes(false)
    setShowSaved(false)
    setShowFollowers(false)
    setShowFollowing(false)
    setShowEditProfile(true)
  }

  return {
    displayLikes,
    displayPosts,
    displaySaved,
    displayFollowers,
    displayFollowing,
    displayEditProfile,
    isActive,
    showLikes,
    showPosts,
    showSaved,
    showFollowers,
    showFollowing,
    showEditProfile,
  }
}
