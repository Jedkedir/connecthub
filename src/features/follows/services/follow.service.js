import api from "@/services/apiClient"
import { endpoints } from "@/services/endpoints"

export const followService = {
  followUser(userId) {
    return api.post(`${endpoints.follows}/${userId}`)
  },
  unfollowUser(userId) {
    return api.delete(`${endpoints.follows}/${userId}`)
  },
}
