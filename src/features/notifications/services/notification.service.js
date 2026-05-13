import api from "@/services/apiClient"
import { endpoints } from "@/services/endpoints"

export const notificationService = {
  getNotifications(params = {}) {
    return api
      .get(endpoints.notifications.list, { params })
      .then((response) => response.data)
  },

  markAllAsRead() {
    return api
      .patch(endpoints.notifications.markAllRead)
      .then((response) => response.data)
  },

  markAsRead(id) {
    return api
      .patch(endpoints.notifications.markRead(id))
      .then((response) => response.data)
  },

  deleteNotification(id) {
    return api
      .delete(endpoints.notifications.delete(id))
      .then((response) => response.data)
  },

  deleteAllNotifications() {
    return api
      .delete(endpoints.notifications.deleteAll)
      .then((response) => response.data)
  },
}
