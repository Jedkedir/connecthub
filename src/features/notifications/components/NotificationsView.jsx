import { useState, useMemo } from "react"
import { formatDistanceToNow } from "date-fns"
import { Trash2, CheckCheck, Archive } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { useNotifications } from "@/features/notifications/hooks/useNotifications"
import { cn } from "@/shared/utils/cn"

const NOTIFICATION_TYPE_COLORS = {
  LIKE: "bg-rose-50 text-rose-900 dark:bg-rose-950",
  COMMENT: "bg-blue-50 text-blue-900 dark:bg-blue-950",
  FOLLOW_REQUEST: "bg-amber-50 text-amber-900 dark:bg-amber-950",
  FOLLOW_ACCEPTED: "bg-green-50 text-green-900 dark:bg-green-950",
  MENTION: "bg-purple-50 text-purple-900 dark:bg-purple-950",
}

const NOTIFICATION_TYPE_LABELS = {
  LIKE: "Like",
  COMMENT: "Comment",
  FOLLOW_REQUEST: "Follow Request",
  FOLLOW_ACCEPTED: "Follow Accepted",
  MENTION: "Mention",
}

const NOTIFICATION_TYPE_EMOJIS = {
  LIKE: "❤️",
  COMMENT: "💬",
  FOLLOW_REQUEST: "👤",
  FOLLOW_ACCEPTED: "✅",
  MENTION: "@",
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
  console.log("NotificationsView render:", { notifications, unreadCount }) // Debug log
  const [filterType, setFilterType] = useState("all")

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

  const handleDeleteNotification = (e, id) => {
    e.stopPropagation()
    deleteNotification(id)
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
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
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

          <div className="flex gap-2">
            {unreadCount > 0 && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleMarkAllAsRead}
                className="gap-2"
              >
                <CheckCheck className="h-4 w-4" />
                Mark All Read
              </Button>
            )}

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  Filter
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setFilterType("all")}>
                  All Notifications
                  {filterType === "all" && <span className="ml-auto">✓</span>}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setFilterType("unread")}>
                  Unread
                  {filterType === "unread" && <span className="ml-auto">✓</span>}
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                {Object.entries(NOTIFICATION_TYPE_LABELS).map(([key, label]) => (
                  <DropdownMenuItem
                    key={key}
                    onClick={() => setFilterType(key)}
                  >
                    {label}
                    {filterType === key && <span className="ml-auto">✓</span>}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {notifications.length > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleClearAll}
                className="text-destructive hover:bg-destructive/10 hover:text-destructive"
              >
                <Archive className="h-4 w-4" />
              </Button>
            )}
          </div>
        </CardHeader>
      </Card>

      {/* Notifications list */}
      {isEmpty ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12 text-center">
            <div className="text-4xl mb-4">🔔</div>
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
            <Card
              key={notification._id}
              className={cn(
                "transition-colors cursor-pointer hover:bg-accent",
                !notification.isRead &&
                  "border-primary/50 bg-primary/5 dark:bg-primary/10"
              )}
              onClick={() => handleNotificationClick(notification)}
            >
              <CardContent className="p-4">
                <div className="flex gap-4">
                  {/* Notification type indicator */}
                  <div
                    className={cn(
                      "flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg text-xl",
                      NOTIFICATION_TYPE_COLORS[notification.type]
                    )}
                  >
                    {NOTIFICATION_TYPE_EMOJIS[notification.type]}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1">
                        <p className="text-sm font-medium text-foreground">
                          {notification.message}
                        </p>
                        <div className="mt-1 flex flex-wrap items-center gap-2">
                          <Badge
                            variant="secondary"
                            className="text-xs"
                          >
                            {NOTIFICATION_TYPE_LABELS[notification.type]}
                          </Badge>
                          <span className="text-xs text-muted-foreground">
                            {formatDistanceToNow(new Date(notification.createdAt), {
                              addSuffix: true,
                            })}
                          </span>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-2 flex-shrink-0">
                        {!notification.isRead && (
                          <div className="h-2 w-2 rounded-full bg-primary" />
                        )}

                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) =>
                            handleDeleteNotification(e, notification._id)
                          }
                          className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
