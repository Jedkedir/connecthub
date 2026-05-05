import api from "@/services/apiClient"
import { endpoints } from "@/services/endpoints"

export const postService = {
  createPost(payload) {
    return api.post(endpoints.posts, payload)
  },
  getPosts(params) {
    return api.get(endpoints.posts, { params })
  },
}
