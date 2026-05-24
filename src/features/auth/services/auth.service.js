import api, { authApi } from "@/services/apiClient"
import { endpoints } from "@/services/endpoints"
import { useAuthStore } from "../auth.store"
import { initSocket } from "@/sockets/socket"

const avatarUrl = (seed) => {
  const randomVariant = (size) => Math.floor(Math.random() * size) + 1
  const variantString = (n) => {
    const random = randomVariant(n)
    return n < 10 ? `variant0${random}` : `variant${random}`
  } // Randomly select a variant for glasses with 3 options
  const url = new URL(`https://api.dicebear.com/9.x/adventurer-neutral/svg`)
  url.searchParams.set("seed", seed)
  url.searchParams.set("size", "128")
  url.searchParams.set("eyebrows", variantString(15))
  url.searchParams.set("eyes", variantString(25))
  url.searchParams.set("randomizeIds", "true")

  return url.href
}

function createAvatarUrl(fullname) {
  const avatar = avatarUrl(fullname)
  return avatar
}

//TODO: Find a more secure way to store tokens, such as HttpOnly cookies, to mitigate XSS risks. LocalStorage is used here for simplicity and demonstration purposes only.
function extractAuthData(payload) {
  return payload?.data ?? payload ?? {}
}

function persistAuthTokens(payload) {
  const { accessToken, refreshToken, user } = extractAuthData(payload)

  if (!accessToken && !refreshToken && !user) {
    return
  }

  const currentState = useAuthStore.getState()
  const nextUser = user || currentState.user
  const nextAccessToken = accessToken || currentState.accessToken
  const nextRefreshToken = refreshToken || currentState.refreshToken

  useAuthStore.getState().login({
    user: nextUser,
    accessToken: nextAccessToken,
    refreshToken: nextRefreshToken,
  })

  // Initialize socket connection when a user payload is present
  if (nextUser?._id || nextUser?.id) {
    initSocket(nextUser._id || nextUser.id)
  }
}

async function authRequest(request) {
  const response = await request()
  const authData = extractAuthData(response.data)

  persistAuthTokens(response.data)
  return authData
}

export const authService = {
  changePassword(payload) {
    return authRequest(() => api.post(endpoints.auth.changePassword, payload))
  },
  login(payload) {
    return authRequest(() => api.post(endpoints.auth.login, payload))
  },
  refresh(refreshToken = sessionStorage.getItem("refreshToken")) {
    return authRequest(() =>
      authApi.post(endpoints.auth.refresh, { refreshToken })
    )
  },
  register(payload) {
    // Generate a unique avatar URL based on the fullname
    const avatarUrl = createAvatarUrl(payload.fullname)
    payload.profilePic = avatarUrl
    return authRequest(() => api.post(endpoints.auth.register, payload))
  },
}
