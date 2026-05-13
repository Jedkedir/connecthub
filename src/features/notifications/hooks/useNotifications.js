import { useCallback, useEffect, useMemo } from "react"
import { notificationService } from "@/features/notifications/services/notification.service"
import { useNotificationStore } from "@/features/notifications/notification.store"
import { useAsyncAction } from "@/shared/hooks"
import { useAuthStore } from "@/features/auth/auth.store"
import { getSocket } from "@/sockets/socket"

export function useNotifications() {
  const getNotificationsAction = useAsyncAction(
    notificationService.getNotifications
  )
  const markAllAsReadAction = useAsyncAction(notificationService.markAllAsRead)
  const markAsReadAction = useAsyncAction(notificationService.markAsRead)
  const deleteNotificationAction = useAsyncAction(
    notificationService.deleteNotification
  )

  const notifications = useNotificationStore((state) => state.notifications)
  const unreadCount = useNotificationStore((state) => state.unreadCount)
  const addNotification = useNotificationStore((state) => state.addNotification)
  const markAsReadStore = useNotificationStore((state) => state.markAsRead)
  const markAllAsReadStore = useNotificationStore((state) => state.markAllAsRead)
  const removeNotification = useNotificationStore(
    (state) => state.removeNotification
  )
  const clearAllNotifications = useNotificationStore(
    (state) => state.clearAllNotifications
  )
  const setNotifications = useNotificationStore((state) => state.setNotifications)
  const user = useAuthStore((state) => state.user)

  const getNotifications = getNotificationsAction.execute
  const markAsRead = markAsReadAction.execute
  const markAllAsRead = markAllAsReadAction.execute
  const deleteNotification = deleteNotificationAction.execute
  // Load notifications on mount
  useEffect(() => {
    if (!user?._id) return

    getNotifications()
      .then(({data}) => {
        console.log("Fetched notifications:", data)
        if (data) {
          setNotifications(data)
        }
      })
      .catch(() => {
        // Surface errors through getNotificationsState.error.
      })
  }, [user?._id, getNotifications, setNotifications])

  // Listen for real-time notifications via socket
  useEffect(() => {
    const socket = getSocket(user?._id)
    console.log("Setting up notification socket listener:", socket) // Debug log
    if (!socket) return

    const handleNotification = (notification) => {
      addNotification(notification)
    }

    socket.on("notification", handleNotification)

    return () => {
      socket.off("notification", handleNotification)
    }
  }, [addNotification])

  const handleMarkAsRead = useCallback(async (id) => {
    markAsReadStore(id)
    try {
      await markAsRead(id)
    } catch (error) {
      console.error("Error marking notification as read:", error)
    }
  }, [markAsReadStore, markAsRead])

  const handleMarkAllAsRead = useCallback(async () => {
    markAllAsReadStore()
    try {
      await markAllAsRead()
    } catch (error) {
      console.error("Error marking all notifications as read:", error)
    }
  }, [markAllAsReadStore, markAllAsRead])

  const handleDeleteNotification = useCallback(async (id) => {
    removeNotification(id)
    try {
      await deleteNotification(id)
    } catch (error) {
      console.error("Error deleting notification:", error)
    }
  }, [removeNotification, deleteNotification])

  return useMemo(
    () => ({
      notifications,
      unreadCount,
      getNotifications,
      getNotificationsState: getNotificationsAction,
      markAsRead: handleMarkAsRead,
      markAsReadState: markAsReadAction,
      markAllAsRead: handleMarkAllAsRead,
      markAllAsReadState: markAllAsReadAction,
      deleteNotification: handleDeleteNotification,
      deleteNotificationState: deleteNotificationAction,
      clearAllNotifications,
      addNotification,
    }),
    [
      notifications,
      unreadCount,
      addNotification,
      clearAllNotifications,
      getNotifications,
      getNotificationsAction,
      markAsReadAction,
      markAllAsReadAction,
      deleteNotificationAction,
      handleMarkAsRead,
      handleMarkAllAsRead,
      handleDeleteNotification,
    ]
  )
}
