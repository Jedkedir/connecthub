import axios from "axios"
import { endpoints } from "@/services/endpoints"
import { useAuthStore } from "@/features/auth/auth.store"
import { initSocket } from "@/sockets/socket"

const API_ORIGIN = import.meta.env.VITE_API_ORIGIN ?? "http://localhost:5000"
const API_BASE_PATH = import.meta.env.VITE_API_BASE_PATH ?? "/api/v1"

const api = axios.create({
  baseURL: `${API_ORIGIN}${API_BASE_PATH}`,
})

const authApi = axios.create({
  baseURL: `${API_ORIGIN}${API_BASE_PATH}`,
})

function extractAuthData(payload) {
  return payload?.data ?? payload ?? {}
}

function persistAuthTokens(payload) {
  const { accessToken, refreshToken, user } = extractAuthData(payload)
  const currentState = useAuthStore.getState()
  const nextUser = user || currentState.user
  const nextAccessToken = accessToken || currentState.accessToken
  const nextRefreshToken = refreshToken || currentState.refreshToken

  if (nextUser) {
    sessionStorage.setItem("user", JSON.stringify(nextUser))
  }

  if (nextAccessToken) {
    sessionStorage.setItem("accessToken", nextAccessToken)
  }

  if (nextRefreshToken) {
    sessionStorage.setItem("refreshToken", nextRefreshToken)
  }

  useAuthStore.setState({
    user: nextUser,
    accessToken: nextAccessToken,
    refreshToken: nextRefreshToken,
  })

  if (nextUser?._id || nextUser?.id) {
    initSocket(nextUser._id || nextUser.id)
  }

  return {
    user: nextUser,
    accessToken: nextAccessToken,
    refreshToken: nextRefreshToken,
  }
}

function redirectToAuth() {
  const currentPath = window.location.pathname

  useAuthStore.getState().logout()

  if (currentPath !== "/auth") {
    window.location.replace("/auth")
  }
}

let refreshPromise = null

async function refreshAccessToken() {
  const refreshToken = sessionStorage.getItem("refreshToken")

  if (!refreshToken) {
    throw new Error("Missing refresh token")
  }

  if (!refreshPromise) {
    refreshPromise = authApi
      .post(endpoints.auth.refresh, { refreshToken })
      .then((response) => persistAuthTokens(response.data))
      .finally(() => {
        refreshPromise = null
      })
  }

  return refreshPromise
}

api.interceptors.request.use((config) => {
  const token = sessionStorage.getItem("accessToken")
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }

  return config
})

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const status = error.response?.status
    const originalRequest = error.config

    if (status !== 401 || !originalRequest) {
      return Promise.reject(error)
    }

    const skippedAuthRoutes = [
      endpoints.auth.login,
      endpoints.auth.refresh,
      endpoints.auth.register,
    ]

    if (
      skippedAuthRoutes.includes(originalRequest.url) ||
      originalRequest._retry
    ) {
      if (originalRequest.url === endpoints.auth.refresh) {
        redirectToAuth()
      }

      return Promise.reject(error)
    }

    originalRequest._retry = true

    try {
      const { accessToken } = await refreshAccessToken()

      originalRequest.headers = originalRequest.headers ?? {}
      originalRequest.headers.Authorization = `Bearer ${accessToken}`

      return api(originalRequest)
    } catch (refreshError) {
      redirectToAuth()
      return Promise.reject(refreshError)
    }
  }
)

export default api
export { authApi, API_BASE_PATH, API_ORIGIN }
