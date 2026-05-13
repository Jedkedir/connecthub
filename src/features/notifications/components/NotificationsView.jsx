import { useMemo, useState } from "react"
import { Archive, CheckCheck } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import MessagesView from "@/features/notifications/components/MessagesView"
import { useFollows } from "@/features/follows/hooks/useFollows"
import { useNotifications } from "@/features/notifications/hooks/useNotifications"

const NOTIFICATION_TYPE_LABELS = {
  LIKE: "Like",
  COMMENT: "Comment",
  FOLLOW_REQUEST: "Follow Request",
  FOLLOW_ACCEPTED: "Follow Accepted",
  MENTION: "Mention",
}

export default function NotificationsView() {
  const {
    notifications,
    unreadCount,
    getNotificationsState,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    clearAllNotifications,
  } = useNotifications()

  const { acceptFollowRequest, rejectFollowRequest } = useFollows()
  const [filterType, setFilterType] = useState("all")
  const [pendingRequestIds, setPendingRequestIds] = useState({})

  const filteredNotifications = useMemo(() => {
    if (filterType === "all") return notifications
    if (filterType === "unread") return notifications.filter((n) => !n.isRead)
    return notifications.filter((n) => n.type === filterType)
  }, [notifications, filterType])

  const isEmpty = filteredNotifications.length === 0
  const isLoading = getNotificationsState.isLoading

  const handleNotificationClick = (notification) => {
    if (!notification.isRead) {
      markAsRead(notification._id)
    }
  }

  const withPending = async (notificationId, action) => {
    setPendingRequestIds((prev) => ({ ...prev, [notificationId]: true }))
    try {
      await action()
    } finally {
      setPendingRequestIds((prev) => ({ ...prev, [notificationId]: false }))
    }
  }

  const handleAcceptRequest = (notification) => {
    const requesterId = notification?.senderId?._id
    if (!requesterId) return

    withPending(notification._id, async () => {
      await acceptFollowRequest(requesterId)
      await markAsRead(notification._id)
    })
  }

  const handleRejectRequest = (notification) => {
    const requesterId = notification?.senderId?._id
    if (!requesterId) return

    withPending(notification._id, async () => {
      await rejectFollowRequest(requesterId)
      await markAsRead(notification._id)
    })
  }

  const handleMarkAllAsRead = () => {
    markAllAsRead()
  }

  const handleClearAll = () => {
    if (
      window.confirm(
        "Are you sure you want to clear all notifications? This action cannot be undone."
      )
    ) {
      clearAllNotifications()
    }
  }

  if (isLoading && notifications.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Notifications</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex items-center gap-4">
              <Skeleton className="h-12 w-12 rounded-full" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-1/2" />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      {/* Header with controls */}
      <Card>
        <CardHeader className="flex flex-col gap-3 space-y-0 sm:flex-row sm:items-center sm:justify-between sm:pb-4">
          <div className="flex flex-col gap-1">
            <CardTitle className="flex items-center gap-2">
              Notifications
              {unreadCount > 0 && (
                <Badge variant="destructive" className="text-xs">
                  {unreadCount}
                </Badge>
              )}
            </CardTitle>
          </div>

          <div className="flex flex-wrap gap-2 sm:justify-end">
            {unreadCount > 0 && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleMarkAllAsRead}
                className="w-full gap-2 sm:w-auto"
              >
                <CheckCheck className="h-4 w-4" />
                Mark All Read
              </Button>
            )}

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full sm:w-auto"
                >
                  Filter
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Notification Type</DropdownMenuLabel>
                <DropdownMenuItem onClick={() => setFilterType("all")}>
                  All Notifications
                  {filterType === "all" && <span className="ml-auto">✓</span>}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setFilterType("unread")}>
                  Unread
                  {filterType === "unread" && (
                    <span className="ml-auto">✓</span>
                  )}
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                {Object.entries(NOTIFICATION_TYPE_LABELS).map(
                  ([key, label]) => (
                    <DropdownMenuItem
                      key={key}
                      onClick={() => setFilterType(key)}
                    >
                      {label}
                      {filterType === key && <span className="ml-auto">✓</span>}
                    </DropdownMenuItem>
                  )
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardHeader>
      </Card>

      {/* Notifications list */}
      {isEmpty ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12 text-center">
            <div className="mb-4 text-4xl">🔔</div>
            <p className="text-lg font-semibold text-foreground">
              {filterType === "all"
                ? "No notifications yet"
                : "No notifications with this filter"}
            </p>
            <p className="text-sm text-muted-foreground">
              {filterType === "all"
                ? "When you get activity, you'll see it here"
                : "Try a different filter"}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-2">
          {filteredNotifications.map((notification) => (
            <MessagesView
              key={notification._id}
              notification={notification}
              isPending={Boolean(pendingRequestIds[notification._id])}
              onAcceptFollowRequest={handleAcceptRequest}
              onRejectFollowRequest={handleRejectRequest}
              onDelete={(id) => deleteNotification(id)}
              onOpen={handleNotificationClick}
            />
          ))}
        </div>
      )}
    </div>
  )
}
