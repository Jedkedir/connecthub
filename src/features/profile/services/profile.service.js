import api from "@/services/apiClient"
import { endpoints } from "@/services/endpoints"

export const profileService = {
  getCurrentUser() {
    return api.get(endpoints.users.me).then((response) => response.data)
  },
  getUserById(id) {
    return api.get(endpoints.users.byId(id)).then((response) => response.data)
  },
  updateProfile(payload) {
    return api
      .put(endpoints.users.update, payload)
      .then((response) => response.data)
  },
  getUserPosts(userId, params) {
    return api
      .get(endpoints.posts.byUser(userId), { params })
      .then((response) => response.data)
  },
}
