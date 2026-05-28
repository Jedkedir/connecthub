import api from "@/services/apiClient"
import { endpoints } from "@/services/endpoints"


export const feedService = {
  createPost(payload) {
    return api.post(endpoints.posts.create, payload).then((response) => response.data)
  },
  getExploreFeed(params) {
    return api
      .get(endpoints.feed.explore, { params })
      .then((response) => response.data)
  },
  getGlobalFeed(params) {
    return api
      .get(endpoints.feed.global, { params })
      .then((response) => response.data)
  },
  getPersonalizedFeed(params) {
    return api
      .get(endpoints.feed.personalized, { params })
      .then((response) => response.data)
  },
}
