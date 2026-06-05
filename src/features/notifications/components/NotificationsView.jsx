import { useMemo, useState } from "react"
import { Bell, Check, CheckCheck, Filter, Inbox } from "lucide-react"
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
  const currentFilterLabel =
    filterType === "all"
      ? "All"
      : filterType === "unread"
        ? "Unread"
        : NOTIFICATION_TYPE_LABELS[filterType] || filterType

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

  if (isLoading && notifications.length === 0) {
    return (
      <Card className="border-border/70 shadow-none">
        <CardHeader className="border-b pb-4">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Bell className="h-5 w-5 text-muted-foreground" />
            Notifications
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-1 p-0">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="flex items-start gap-3 border-b p-4 last:border-b-0"
            >
              <Skeleton className="h-11 w-11 rounded-full" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-4/5" />
                <Skeleton className="h-3 w-2/5" />
                <Skeleton className="h-8 w-32" />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="mx-auto w-full max-w-3xl space-y-4">
      <Card className="border-border/70 shadow-none">
        <CardHeader className="space-y-4 pb-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div className="space-y-1">
              <CardTitle className="flex items-center gap-2 text-xl">
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-muted">
                  <Bell className="h-5 w-5" />
                </span>
                Notifications
                {unreadCount > 0 && (
                  <Badge variant="destructive" className="rounded-full text-xs">
                    {unreadCount}
                  </Badge>
                )}
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                {unreadCount > 0
                  ? `${unreadCount} unread update${unreadCount === 1 ? "" : "s"}`
                  : "You are all caught up"}
              </p>
            </div>

            <div className="flex flex-wrap gap-2 sm:justify-end">
              {unreadCount > 0 && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleMarkAllAsRead}
                  className="h-9 w-full gap-2 sm:w-auto"
                >
                  <CheckCheck className="h-4 w-4" />
                  Mark read
                </Button>
              )}

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-9 w-full gap-2 sm:w-auto"
                  >
                    <Filter className="h-4 w-4" />
                    {currentFilterLabel}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>Notification Type</DropdownMenuLabel>
                  <DropdownMenuItem onClick={() => setFilterType("all")}>
                    All Notifications
                    {filterType === "all" && (
                      <Check className="ml-auto h-4 w-4" />
                    )}
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setFilterType("unread")}>
                    Unread
                    {filterType === "unread" && (
                      <Check className="ml-auto h-4 w-4" />
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
                        {filterType === key && (
                          <Check className="ml-auto h-4 w-4" />
                        )}
                      </DropdownMenuItem>
                    )
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {[
              ["all", "All"],
              ["unread", "Unread"],
              ...Object.entries(NOTIFICATION_TYPE_LABELS),
            ].map(([key, label]) => (
              <Button
                key={key}
                type="button"
                variant={filterType === key ? "secondary" : "ghost"}
                size="sm"
                onClick={() => setFilterType(key)}
                className="h-8 rounded-full px-3 text-xs"
              >
                {label}
              </Button>
            ))}
          </div>
        </CardHeader>
      </Card>

      {isEmpty ? (
        <Card className="border-border/70 shadow-none">
          <CardContent className="flex flex-col items-center justify-center px-6 py-16 text-center">
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-muted">
              <Inbox className="h-7 w-7 text-muted-foreground" />
            </div>
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
        <div className="overflow-hidden rounded-lg border border-border/70">
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
