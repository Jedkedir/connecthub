import { create } from "zustand"

const storedUser = sessionStorage.getItem("user")
const storedAccessToken = sessionStorage.getItem("accessToken")

export const useProfileStore = create((set) => ({
  user: storedUser ? JSON.parse(storedUser) : null,
  accessToken: storedAccessToken || null,
  userPosts: [],

  setUserPosts: (posts) => set({ userPosts: posts }),
}))
