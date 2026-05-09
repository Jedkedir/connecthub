import api from "@/services/apiClient"
import { endpoints } from "@/services/endpoints"
import { useAuthStore } from "../auth.store"

//TODO: Find a more secure way to store tokens, such as HttpOnly cookies, to mitigate XSS risks. LocalStorage is used here for simplicity and demonstration purposes only.
function extractAuthData(payload) {
  return payload?.data ?? payload ?? {}
}

function persistAuthTokens(payload) {
  const { accessToken, refreshToken, user } = extractAuthData(payload)

  if (accessToken || refreshToken || user) {
    useAuthStore.getState().login({
      user: user || null,
      accessToken: accessToken || null,
      refreshToken: refreshToken || null,
    })
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
  refresh(refreshToken = localStorage.getItem("refreshToken")) {
    return authRequest(() => api.post(endpoints.auth.refresh, { refreshToken }))
  },
  register(payload) {
    return authRequest(() => api.post(endpoints.auth.register, payload))
  },
}
