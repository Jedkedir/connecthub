import api from "@/services/apiClient"
import { endpoints } from "@/services/endpoints"

export const authService = {
  login(payload) {
    return api.post(`${endpoints.auth}/login`, payload)
  },
  signup(payload) {
    return api.post(`${endpoints.auth}/signup`, payload)
  },
}
