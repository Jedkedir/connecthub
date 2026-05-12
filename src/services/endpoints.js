export const endpoints = {
  auth: {
    changePassword: "/auth/change-password",
    login: "/auth/login",
    refresh: "/auth/refresh",
    register: "/auth/register",
  },
  feed: {
    explore: "/feed/explore",
    global: "/feed/global",
    personalized: "/feed/personalized",
  },
  follow: {
    accept: "/follow/accept",
    reject: "/follow/reject",
    request: "/follow/request",
    unfollow: "/follow/unfollow",
    followers: (userId) => `/follow/${userId}/followers`,
    following: (userId) => `/follow/${userId}/following`,
  },
  health: "/health",
  notifications: {
    list: "/notifications",
    markAllRead: "/notifications/read-all",
    markRead: (id) => `/notifications/${id}/read`,
  },
  posts: {
    bookmarks: "/posts/bookmarks/me",
    liked: "/posts/liked/me",
    byId: (id) => `/posts/${id}`,
    byUser: (userId) => `/posts/user/${userId}`,
    comments: (id) => `/posts/${id}/comments`,
    create: "/posts",
    like: (id) => `/posts/${id}/like`,
    bookmark: (id) => `/posts/${id}/bookmark`,
    unlike: (id) => `/posts/${id}/unlike`,
  },
  users: {
    byId: (id) => `/users/${id}`,
    me: "/users/me",
    update: "/users/update",
  },
}
