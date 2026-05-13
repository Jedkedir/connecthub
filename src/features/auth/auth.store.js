import { create } from "zustand"
import { disconnectSocket, initSocket } from "@/sockets/socket"

// Changed from localStorage to sessionStorage
const storedUser = sessionStorage.getItem("user")
const storedAccessToken = sessionStorage.getItem("accessToken")
const storedRefreshToken = sessionStorage.getItem("refreshToken")

export const useAuthStore = create((set) => ({
  user: storedUser ? JSON.parse(storedUser) : null,
  accessToken: storedAccessToken || null,
  refreshToken: storedRefreshToken || null,

  login: ({ user, accessToken, refreshToken }) => {
    // Changed to sessionStorage
    sessionStorage.setItem("user", JSON.stringify(user))
    sessionStorage.setItem("accessToken", accessToken)
    sessionStorage.setItem("refreshToken", refreshToken)

    if (user?._id || user?.id) {
      initSocket(user._id || user.id)
    }

    set({
      user,
      accessToken,
      refreshToken,
    })
  },

  logout: () => {
    sessionStorage.clear() // Changed to sessionStorage
    disconnectSocket()

    set({
      user: null,
      accessToken: null,
      refreshToken: null,
    })
  },

  updateUser: (updatedUser) => {
    sessionStorage.setItem("user", JSON.stringify(updatedUser)) // Changed to sessionStorage

    set({
      user: updatedUser,
    })
  },
}))

// Initialize socket on app load if user is already logged in
const storedUserFromInit = sessionStorage.getItem("user") // Changed to sessionStorage
if (storedUserFromInit) {
  const user = JSON.parse(storedUserFromInit)
  if (user?._id || user?.id) {
    initSocket(user._id || user.id)
  }
}

/*
import { create } from "zustand"
import { disconnectSocket, initSocket } from "@/sockets/socket"

const storedUser = localStorage.getItem("user")
const storedAccessToken = localStorage.getItem("accessToken")
const storedRefreshToken = localStorage.getItem("refreshToken")

export const useAuthStore = create((set) => ({
  user: storedUser ? JSON.parse(storedUser) : null,
  accessToken: storedAccessToken || null,
  refreshToken: storedRefreshToken || null,

  login: ({ user, accessToken, refreshToken }) => {
    localStorage.setItem("user", JSON.stringify(user))
    localStorage.setItem("accessToken", accessToken)
    localStorage.setItem("refreshToken", refreshToken)

    // Initialize socket connection
    if (user?._id || user?.id) {
      initSocket(user._id || user.id)
    }

    set({
      user,
      accessToken,
      refreshToken,
    })
  },

  logout: () => {
    localStorage.clear()
    disconnectSocket()

    set({
      user: null,
      accessToken: null,
      refreshToken: null,
    })
  },

  updateUser: (updatedUser) => {
    localStorage.setItem("user", JSON.stringify(updatedUser))

    set({
      user: updatedUser,
    })
  },
}))

// Initialize socket on app load if user is already logged in
const storedUserFromInit = localStorage.getItem("user")
if (storedUserFromInit) {
  const user = JSON.parse(storedUserFromInit)
  if (user?._id || user?.id) {
    initSocket(user._id || user.id)
  }
}
*/
