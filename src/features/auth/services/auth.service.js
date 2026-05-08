import api from "@/services/apiClient"
import { endpoints } from "@/services/endpoints"
//TODO: Find a more secure way to store tokens, such as HttpOnly cookies, to mitigate XSS risks. LocalStorage is used here for simplicity and demonstration purposes only.
function extractAuthData(payload) {
  return payload?.data ?? payload ?? {}
}

function persistAuthTokens(payload) {
  const { accessToken, refreshToken } = extractAuthData(payload)

  if (accessToken) {
    localStorage.setItem("accessToken", accessToken)
  }

  if (refreshToken) {
    localStorage.setItem("refreshToken", refreshToken)
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
