import { formatDistanceToNow } from "date-fns"
import {
  AtSign,
  Bell,
  Check,
  Clock,
  Heart,
  MessageCircle,
  Trash2,
  UserCheck,
  UserPlus,
  X,
} from "lucide-react"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/shared/utils/cn"

const NOTIFICATION_TYPE_COLORS = {
  LIKE: "bg-rose-50 text-rose-600 ring-rose-200 dark:bg-rose-950/40 dark:text-rose-300 dark:ring-rose-900",
  COMMENT: "bg-sky-50 text-sky-600 ring-sky-200 dark:bg-sky-950/40 dark:text-sky-300 dark:ring-sky-900",
  FOLLOW_REQUEST:
    "bg-amber-50 text-amber-700 ring-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:ring-amber-900",
  FOLLOW_ACCEPTED:
    "bg-emerald-50 text-emerald-600 ring-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:ring-emerald-900",
  MENTION:
    "bg-violet-50 text-violet-600 ring-violet-200 dark:bg-violet-950/40 dark:text-violet-300 dark:ring-violet-900",
}

const NOTIFICATION_TYPE_LABELS = {
  LIKE: "Like",
  COMMENT: "Comment",
  FOLLOW_REQUEST: "Follow Request",
  FOLLOW_ACCEPTED: "Follow Accepted",
  MENTION: "Mention",
}

const NOTIFICATION_TYPE_ICONS = {
  LIKE: Heart,
  COMMENT: MessageCircle,
  FOLLOW_REQUEST: UserPlus,
  FOLLOW_ACCEPTED: UserCheck,
  MENTION: AtSign,
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
  const TypeIcon = NOTIFICATION_TYPE_ICONS[notification.type] || Bell

  return (
    <article
      className={cn(
        "group relative cursor-pointer border-b bg-card transition-colors last:border-b-0 hover:bg-accent/60",
        !notification.isRead && "bg-primary/[0.04] dark:bg-primary/10"
      )}
      onClick={() => onOpen?.(notification)}
    >
      {!notification.isRead ? (
        <span className="absolute left-0 top-0 h-full w-1 bg-primary" />
      ) : null}
      <div className="p-4 sm:p-5">
        <div className="flex items-start gap-3 sm:gap-4">
          <div className="relative shrink-0">
            <Avatar className="h-11 w-11 sm:h-12 sm:w-12">
              <AvatarImage src={avatarSrc} alt={fullname} />
              <AvatarFallback>
                {fullname.slice(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <span
              className={cn(
                "absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full ring-2 ring-background",
                NOTIFICATION_TYPE_COLORS[notification.type]
              )}
            >
              <TypeIcon className="h-3.5 w-3.5" />
            </span>
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex items-start gap-3">
              <div className="min-w-0">
                <p className="text-sm leading-6 text-foreground">
                  <span className="font-semibold">{fullname}</span>
                  <span> </span>
                  <span className="font-normal text-muted-foreground">
                    {notification.message}
                  </span>
                </p>

                {postPreview ? (
                  <p className="mt-2 line-clamp-2 rounded-md border bg-muted/40 px-3 py-2 text-sm text-muted-foreground">
                    {postPreview}
                  </p>
                ) : null}

                <div className="mt-3 flex flex-wrap items-center gap-2">
                  <Badge
                    variant="secondary"
                    className="h-6 rounded-full px-2 text-[11px]"
                  >
                    {NOTIFICATION_TYPE_LABELS[notification.type] ||
                      notification.type}
                  </Badge>
                  <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                    <Clock className="h-3.5 w-3.5" />
                    {timestamp}
                  </span>
                  {!notification.isRead ? (
                    <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                      New
                    </span>
                  ) : null}
                </div>
              </div>

              <div className="ml-auto flex shrink-0 items-center gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-muted-foreground opacity-100 hover:bg-destructive/10 hover:text-destructive sm:opacity-0 sm:transition-opacity sm:group-hover:opacity-100 sm:group-focus-within:opacity-100"
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
              <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:items-center">
                <Button
                  size="sm"
                  className="h-8 w-full gap-2 sm:w-auto"
                  disabled={isPending}
                  onClick={(event) => {
                    event.stopPropagation()
                    onAcceptFollowRequest?.(notification)
                  }}
                >
                  <Check className="h-4 w-4" />
                  Accept
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-8 w-full gap-2 sm:w-auto"
                  disabled={isPending}
                  onClick={(event) => {
                    event.stopPropagation()
                    onRejectFollowRequest?.(notification)
                  }}
                >
                  <X className="h-4 w-4" />
                  Reject
                </Button>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </article>
  )
}
