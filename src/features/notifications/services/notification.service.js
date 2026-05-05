import api from "@/services/apiClient"
import { endpoints } from "@/services/endpoints"

export const notificationService = {
  getNotifications(params) {
    return api.get(endpoints.notifications, { params })
  },
}
