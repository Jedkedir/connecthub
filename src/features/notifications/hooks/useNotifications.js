import { useMemo } from "react"

import { notificationService } from "@/features/notifications/services/notification.service"
import { useAsyncAction } from "@/shared/hooks"

export function useNotifications() {
  const getNotificationsAction = useAsyncAction(
    notificationService.getNotifications
  )
  const markAllAsReadAction = useAsyncAction(notificationService.markAllAsRead)
  const markAsReadAction = useAsyncAction(notificationService.markAsRead)

  return useMemo(
    () => ({
      getNotifications: getNotificationsAction.execute,
      getNotificationsState: getNotificationsAction,
      markAllAsRead: markAllAsReadAction.execute,
      markAllAsReadState: markAllAsReadAction,
      markAsRead: markAsReadAction.execute,
      markAsReadState: markAsReadAction,
    }),
    [getNotificationsAction, markAllAsReadAction, markAsReadAction]
  )
}
