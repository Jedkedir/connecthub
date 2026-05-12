import api from "@/services/apiClient"
import { endpoints } from "@/services/endpoints"

export const postService = {
  addComment(id, payload) {
    return api
      .post(endpoints.posts.comments(id), payload)
      .then((response) => response.data)
  },
  bookmarkPost(id) {
    return api
      .post(endpoints.posts.bookmark(id))
      .then((response) => response.data)
  },
  createPost(payload) {
    return api
      .post(endpoints.posts.create, payload)
      .then((response) => response.data)
  },
  deletePost(id) {
    return api
      .delete(endpoints.posts.byId(id))
      .then((response) => response.data)
  },
  getBookmarkedPosts(params) {
    return api
      .get(endpoints.posts.bookmarks, { params })
      .then((response) => response.data)
  },
  getLikedPosts(params) {
    return api
      .get(endpoints.posts.liked, { params })
      .then((response) => response.data)
  },
  getComments(id, params) {
    return api
      .get(endpoints.posts.comments(id), { params })
      .then((response) => response.data)
  },
  getPostById(id) {
    return api.get(endpoints.posts.byId(id)).then((response) => response.data)
  },
  getUserPosts(userId, params) {
    return api
      .get(endpoints.posts.byUser(userId), { params })
      .then((response) => response.data)
  },
  likePost(id) {
    return api.post(endpoints.posts.like(id)).then((response) => response.data)
  },
  removeBookmark(id) {
    return api
      .delete(endpoints.posts.bookmark(id))
      .then((response) => response.data)
  },
  unlikePost(id) {
    return api
      .post(endpoints.posts.unlike(id))
      .then((response) => response.data)
  },
  addReply(postId, payload) {
    return api
      .post(endpoints.posts.comments(postId), payload)
      .then((response) => response.data)
  },
  likeComment(commentId) {
    return api
      .post(endpoints.posts.comment.like(commentId))
      .then((response) => response.data)
  },
  unlikeComment(commentId) {
    return api
      .post(endpoints.posts.comment.unlike(commentId))
      .then((response) => response.data)
  },
  updateComment(commentId, payload) {
    return api
      .put(endpoints.posts.comment.update(commentId), payload)
      .then((response) => response.data)
  },
  deleteComment(commentId) {
    return api
      .delete(endpoints.posts.comment.delete(commentId))
      .then((response) => response.data)
  },
  getCommentReplies(commentId, params) {
    return api
      .get(endpoints.posts.comment.replies(commentId), { params })
      .then((response) => response.data)
  },
}
