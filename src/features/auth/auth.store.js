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
    if (user?.id) {
      initSocket(user.id)
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
  if (user?.id) {
    initSocket(user.id)
  }
}
