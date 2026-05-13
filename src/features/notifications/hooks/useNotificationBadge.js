import { useNotifications } from "@/features/notifications/hooks/useNotifications"

export function useNotificationBadge() {
  const { unreadCount } = useNotifications()
  return { unreadCount }
}
