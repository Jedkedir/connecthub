import { formatDistanceToNow } from "date-fns"
import { Check, Trash2, X } from "lucide-react"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/shared/utils/cn"

const NOTIFICATION_TYPE_COLORS = {
  LIKE: "bg-rose-50 text-rose-900 dark:bg-rose-950",
  COMMENT: "bg-blue-50 text-blue-900 dark:bg-blue-950",
  FOLLOW_REQUEST: "bg-amber-50 text-amber-900 dark:bg-amber-950",
  FOLLOW_ACCEPTED: "bg-green-50 text-green-900 dark:bg-green-950",
  MENTION: "bg-violet-50 text-violet-900 dark:bg-violet-950",
}

const NOTIFICATION_TYPE_LABELS = {
  LIKE: "Like",
  COMMENT: "Comment",
  FOLLOW_REQUEST: "Follow Request",
  FOLLOW_ACCEPTED: "Follow Accepted",
  MENTION: "Mention",
}

const NOTIFICATION_TYPE_ICONS = {
  LIKE: "❤️",
  COMMENT: "💬",
  FOLLOW_REQUEST: "👤",
  FOLLOW_ACCEPTED: "✅",
  MENTION: "@",
}

function getfullname(notification) {
  return notification?.senderId?.fullname || "Unknown user"
}

function getAvatar(notification) {
  return notification?.senderId?.profilePic || ""
}

function getPostPreview(notification) {
  const postContent = notification?.postId?.content
  if (!postContent) return null
  return postContent.length > 88
    ? `${postContent.slice(0, 88)}...`
    : postContent
}

export default function MessagesView({
  notification,
  isPending = false,
  onAcceptFollowRequest,
  onRejectFollowRequest,
  onDelete,
  onOpen,
}) {
  if (!notification) {
    return (
      <Card>
        <CardContent className="p-6 text-sm text-muted-foreground">
          No message selected.
        </CardContent>
      </Card>
    )
  }

  const isFollowRequest = notification.type === "FOLLOW_REQUEST"
  const senderId = notification?.senderId?._id
  const fullname = getfullname(notification)
  const avatarSrc = getAvatar(notification)
  const postPreview = getPostPreview(notification)
  const timestamp = notification?.createdAt
    ? formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })
    : "just now"

  return (
    <Card
      className={cn(
        "cursor-pointer transition-colors hover:bg-accent",
        !notification.isRead &&
          "border-primary/50 bg-primary/5 dark:bg-primary/10"
      )}
      onClick={() => onOpen?.(notification)}
    >
      <CardContent className="p-3 sm:p-4">
        <div className="flex items-start gap-3 sm:gap-4">
          <Avatar className="h-10 w-10 sm:h-12 sm:w-12">
            <AvatarImage src={avatarSrc} alt={fullname} />
            <AvatarFallback>
              {fullname.slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>

          <div className="min-w-0 flex-1">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
              <div className="min-w-0">
                <p className="text-sm font-medium text-foreground">
                  <span className="mr-1">{fullname}</span>
                  <span className="font-normal text-muted-foreground">
                    {notification.message}
                  </span>
                </p>

                {postPreview ? (
                  <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">
                    {postPreview}
                  </p>
                ) : null}

                <div className="mt-2 flex flex-wrap items-center gap-2">
                  <Badge variant="secondary" className="text-[10px] sm:text-xs">
                    {NOTIFICATION_TYPE_LABELS[notification.type] ||
                      notification.type}
                  </Badge>
                  <span
                    className={cn(
                      "inline-flex h-6 w-6 items-center justify-center rounded-md text-xs",
                      NOTIFICATION_TYPE_COLORS[notification.type]
                    )}
                  >
                    {NOTIFICATION_TYPE_ICONS[notification.type] || "🔔"}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {timestamp}
                  </span>
                </div>
              </div>

              <div className="ml-auto flex items-center gap-2 sm:ml-2">
                {!notification.isRead ? (
                  <span className="h-2 w-2 rounded-full bg-primary" />
                ) : null}

                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-destructive hover:bg-destructive/10 hover:text-destructive"
                  onClick={(event) => {
                    event.stopPropagation()
                    onDelete?.(notification._id)
                  }}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {!notification.isRead && isFollowRequest && senderId ? (
              <div className="mt-3 flex flex-col gap-2 sm:flex-row sm:items-center">
                <Button
                  size="sm"
                  className="w-full sm:w-auto"
                  disabled={isPending}
                  onClick={(event) => {
                    event.stopPropagation()
                    onAcceptFollowRequest?.(notification)
                  }}
                >
                  <Check className="mr-2 h-4 w-4" />
                  Accept
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full sm:w-auto"
                  disabled={isPending}
                  onClick={(event) => {
                    event.stopPropagation()
                    onRejectFollowRequest?.(notification)
                  }}
                >
                  <X className="mr-2 h-4 w-4" />
                  Reject
                </Button>
              </div>
            ) : null}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
