import api from "@/services/apiClient"
import { endpoints } from "@/services/endpoints"

export const profileService = {
  getProfile(username) {
    return api.get(
      username ? `${endpoints.profile}/${username}` : endpoints.profile
    )
  },
  updateProfile(payload) {
    return api.patch(endpoints.profile, payload)
  },
}
