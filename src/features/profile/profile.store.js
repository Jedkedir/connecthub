import { create } from "zustand"

const storedUser = localStorage.getItem("user")
const storedAccessToken = localStorage.getItem("accessToken")

export const useProfileStore = create((set) => ({
  user: storedUser ? JSON.parse(storedUser) : null,
  accessToken: storedAccessToken || null,
  userPosts: [],

  setUserPosts: (posts) => set({ userPosts: posts }),
}))
