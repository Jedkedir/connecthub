import api from "@/services/apiClient"
import { endpoints } from "@/services/endpoints"

export const feedService = {
  getFeed(params) {
    return api.get(endpoints.feed, { params })
  },
}
