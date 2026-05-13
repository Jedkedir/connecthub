import { create } from "zustand"

export const useNotificationStore = create((set, get) => ({
  notifications: [],
  unreadCount: 0,

  setNotifications: (notifications) => {
    set({
      notifications,
      unreadCount: notifications.filter((n) => !n.isRead).length,
    })
  },

  addNotification: (notification) => {
    set((state) => ({
      notifications: [notification, ...state.notifications],
      unreadCount: !notification.isRead ? state.unreadCount + 1 : state.unreadCount,
    }))
  },

  markAsRead: (notificationId) => {
    set((state) => {
      const notifications = state.notifications.map((n) =>
        n._id === notificationId ? { ...n, isRead: true } : n
      )
      return {
        notifications,
        unreadCount: notifications.filter((n) => !n.isRead).length,
      }
    })
  },

  markAllAsRead: () => {
    set((state) => ({
      notifications: state.notifications.map((n) => ({ ...n, isRead: true })),
      unreadCount: 0,
    }))
  },

  removeNotification: (notificationId) => {
    set((state) => {
      const notification = state.notifications.find((n) => n._id === notificationId)
      const notifications = state.notifications.filter((n) => n._id !== notificationId)
      return {
        notifications,
        unreadCount: !notification?.isRead ? Math.max(0, state.unreadCount - 1) : state.unreadCount,
      }
    })
  },

  clearAllNotifications: () => {
    set({ notifications: [], unreadCount: 0 })
  },

  getUnreadCount: () => get().unreadCount,
}))
