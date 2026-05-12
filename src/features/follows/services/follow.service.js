import api from "@/services/apiClient"
import { endpoints } from "@/services/endpoints"

export const followService = {
  acceptFollowRequest(requesterId) {
    return api
      .post(endpoints.follow.accept, { requesterId })
      .then((response) => response.data)
  },
  rejectFollowRequest(requesterId) {
    return api
      .post(endpoints.follow.reject, { requesterId })
      .then((response) => response.data)
  },
  sendFollowRequest(targetUserId) {
    return api
      .post(endpoints.follow.request, { targetUserId })
      .then((response) => response.data)
  },
  unfollowUser(targetUserId) {
    return api
      .post(endpoints.follow.unfollow, { targetUserId })
      .then((response) => response.data)
  },
  getFollowers(userId) {
    return api
      .get(endpoints.follow.followers(userId))
      .then((response) => response.data)
  },
  getFollowing(userId) {
    return api
      .get(endpoints.follow.following(userId))
      .then((response) => response.data)
  },
}
