import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import {
  Heart,
  MessageCircle,
  Bookmark,
  Share2,
  Eye,
  Send,
  ArrowLeft,
  MoreHorizontal,
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useState, useEffect, useCallback } from "react"
import { formatDistanceToNow, isValid, parseISO } from "date-fns"
import { usePosts } from "../hooks/usePosts"
import { useNavigate } from "react-router-dom"
import { useAuthStore } from "@/features/auth"
import { Link } from "react-router-dom"
import { useUserSearch } from "@/features/profile/hooks/useUserSearch"
import {
  extractMentionsFromContent,
  getActiveToken,
  getMentionLookup,
  getMentionPayload,
  getTopicPayload,
  getUserId,
  renderInteractiveContent,
} from "@/features/posts/utils/contentTokens"
import { toast } from "sonner"
import { commentSchema, replySchema } from "@/validators/commentValidator"
import { validateSchema } from "@/validators/validation"

function MentionCommentInput({
  disabled = false,
  onChange,
  onSubmit,
  placeholder,
  rows = 2,
  submitLabel = "Send",
  value,
}) {
  const [activeToken, setActiveToken] = useState(null)
  const [selectedMentionUsers, setSelectedMentionUsers] = useState({})
  const mentionQuery = activeToken?.type === "mention" ? activeToken.query : ""
  const { users: mentionSuggestions } = useUserSearch(mentionQuery, 5, {
    enabled: activeToken?.type === "mention",
    minLength: 0,
  })

  const updateActiveToken = (text, caretIndex) => {
    setActiveToken(getActiveToken(text, caretIndex))
  }

  const handleSelectMention = (suggestedUser) => {
    if (!activeToken) return

    const mention = `@${suggestedUser.username}`
    const nextValue = `${value.slice(0, activeToken.start)}${mention} ${value.slice(activeToken.end)}`
    const userId = getUserId(suggestedUser)

    setSelectedMentionUsers((prev) => ({
      ...prev,
      [mention.toLowerCase()]: {
        id: userId,
        username: suggestedUser.username,
      },
    }))
    onChange(nextValue)
    setActiveToken(null)
  }

  const handleSubmit = async () => {
    if (!value.trim()) return

    await onSubmit(value, selectedMentionUsers)
    setActiveToken(null)
    setSelectedMentionUsers({})
  }

  const activeMentions = extractMentionsFromContent(value)

  return (
    <div className="flex-1 space-y-2">
      <Textarea
        placeholder={placeholder}
        value={value}
        onChange={(e) => {
          onChange(e.target.value)
          updateActiveToken(e.target.value, e.target.selectionStart)
        }}
        onClick={(event) =>
          updateActiveToken(value, event.currentTarget.selectionStart)
        }
        onKeyUp={(event) =>
          updateActiveToken(value, event.currentTarget.selectionStart)
        }
        className="text-sm"
        rows={rows}
      />
      {activeToken?.type === "mention" && mentionSuggestions.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {mentionSuggestions.map((suggestedUser) => (
            <Button
              key={getUserId(suggestedUser) || suggestedUser.username}
              type="button"
              variant="outline"
              size="sm"
              onClick={() => handleSelectMention(suggestedUser)}
              className="h-7 rounded-full px-3 text-emerald-600 hover:text-emerald-700"
            >
              @{suggestedUser.username}
            </Button>
          ))}
        </div>
      )}
      {activeMentions.length > 0 && (
        <div className="flex flex-wrap gap-2 text-xs">
          {activeMentions.map((mention) => (
            <span key={mention} className="text-emerald-600">
              {mention}
            </span>
          ))}
        </div>
      )}
      <div className="flex justify-end">
        <Button
          size="sm"
          onClick={handleSubmit}
          disabled={disabled || !value.trim()}
        >
          <Send className="mr-1 h-3 w-3" />
          {submitLabel}
        </Button>
      </div>
    </div>
  )
}

function Comment({
  comment,
  onReply,
  onLikeComment,
  onEdit,
  onSave,
  onDelete,
  editingId,
  editText,
  setEditText,
  currentUserId,
  isReply = false,
}) {
  const [isLiked, setIsLiked] = useState(comment?.isLiked || false)
  const [showReplyInput, setShowReplyInput] = useState(false)
  const [replyContent, setReplyContent] = useState("")
  const navigate = useNavigate()
  const mentionLookup = getMentionLookup(
    comment.mentions,
    comment.mentionedUsers
  )

  let timeAgo = "Just now"

  if (comment?.createdAt) {
    timeAgo = formatDistanceToNow(parseISO(comment.createdAt), {
      addSuffix: true,
    })
  }

  const handleSubmitReply = async (content, selectedMentionUsers) => {
    if (content.trim()) {
      await onReply(comment._id, content, selectedMentionUsers)
      setReplyContent("")
      setShowReplyInput(false)
    }
  }

  const isOwnComment = currentUserId === comment.userId?._id

  return (
    <article className={isReply ? "border-l pl-4" : ""}>
      <div className="flex gap-3">
        <Link to={`/profile/${comment.userId?._id}`} className="shrink-0">
          <Avatar className="h-9 w-9">
            <AvatarImage
              src={
                comment.userId?.profilePic ||
                "https://api.dicebear.com/9.x/adventurer-neutral/svg"
              }
            />
            <AvatarFallback>
              {comment.userId?.fullname?.slice(0, 2).toUpperCase() || "User"}
            </AvatarFallback>
          </Avatar>
        </Link>
        <div className="min-w-0 flex-1">
          <div className="rounded-lg border bg-card p-3">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold">
                  {comment.userId?.fullname || "user"}
                </p>
                <p className="text-xs text-muted-foreground">{timeAgo}</p>
              </div>
              {isOwnComment && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-auto p-0.5 text-muted-foreground"
                    >
                      <MoreHorizontal className="h-3 w-3" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem
                      onClick={() => onEdit(comment._id, comment.content)}
                    >
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onDelete(comment._id)}>
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>

            {editingId === comment._id ? (
              <Textarea
                value={editText}
                onChange={(e) => setEditText(e.target.value)}
                className="mt-3 min-h-16 resize-none text-sm"
                rows={2}
              />
            ) : (
              <p className="mt-3 text-sm leading-6">
                {renderInteractiveContent({
                  mentionLookup,
                  navigate,
                  text: comment.content,
                })}
              </p>
            )}
          </div>

          <div className="mt-2 flex flex-wrap items-center gap-3 pl-1">
            {editingId === comment._id ? (
              <>
                <Button
                  size="sm"
                  onClick={() => onSave(comment._id)}
                  className="h-7 px-3 text-xs"
                >
                  Save
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => onEdit(null)}
                  className="h-7 px-3 text-xs"
                >
                  Cancel
                </Button>
              </>
            ) : null}
            <Button
              variant="ghost"
              size="sm"
              className={`h-7 gap-1 px-2 text-xs ${isLiked ? "text-red-500" : "text-muted-foreground"}`}
              onClick={() => {
                setIsLiked(!isLiked)
                onLikeComment?.(comment._id)
              }}
            >
              <Heart
                className={`h-3.5 w-3.5 ${isLiked ? "fill-current" : ""}`}
              />
              {comment.likesCount || 0}
            </Button>

            {!isReply && (
              <Button
                variant="ghost"
                size="sm"
                className="h-7 gap-1 px-2 text-xs text-muted-foreground"
                onClick={() => setShowReplyInput(!showReplyInput)}
              >
                <MessageCircle className="h-3.5 w-3.5" />
                Reply
              </Button>
            )}
          </div>

          {showReplyInput && (
            <div className="mt-3 rounded-lg border bg-muted/30 p-3">
              <MentionCommentInput
                placeholder="Write a reply..."
                value={replyContent}
                onChange={setReplyContent}
                onSubmit={handleSubmitReply}
                rows={2}
                submitLabel="Reply"
              />
            </div>
          )}

          {comment.replies && comment.replies.length > 0 && (
            <div className="mt-4 space-y-4">
              {comment.replies.map((reply) => (
                <Comment
                  key={reply._id}
                  comment={reply}
                  onReply={onReply}
                  onLikeComment={onLikeComment}
                  onEdit={onEdit}
                  onSave={onSave}
                  onDelete={onDelete}
                  editingId={editingId}
                  editText={editText}
                  setEditText={setEditText}
                  currentUserId={currentUserId}
                  isReply={true}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </article>
  )
}

export default function PostView({ postId }) {
  const [post, setPost] = useState(null)
  const [comments, setComments] = useState([])
  const [newComment, setNewComment] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [hasMore, setHasMore] = useState(true)
  const [isLiked, setIsLiked] = useState(false)
  const [isBookmarked, setIsBookmarked] = useState(false)
  const [likesCount, setLikesCount] = useState(0)
  const [bookmarksCount, setBookmarksCount] = useState(0)
  const [editingCommentId, setEditingCommentId] = useState(null)
  const [editCommentText, setEditCommentText] = useState("")
  const [commentToDeleteId, setCommentToDeleteId] = useState(null)
  const [cursor, setCursor] = useState(null)

  const currentUserId = useAuthStore((state) => state.user?._id)
  const navigate = useNavigate()

  const {
    getPostById,
    getComments,
    addComment,
    addReply,
    bookmarkPost,
    removeBookmark,
    likePost,
    unlikePost,
    likeComment,
    unlikeComment,
    updateComment,
    deleteComment,
    deletePost,
  } = usePosts()

  // Memoize fetchPost with useCallback
  const fetchPost = useCallback(
    async (id) => {
      if (!id) return
      try {
        const { data } = await getPostById(id)
        setPost(data.post)
        setLikesCount(data.post.likesCount || 0)
        setBookmarksCount(data.post.bookmarksCount || 0)
        setIsBookmarked(data.post.isBookmarked || false)
      } catch (err) {
        console.error("Error fetching post:", err)
      }
    },
    [getPostById]
  )

  // Memoize fetchComments with useCallback
  const fetchComments = useCallback(
    async (id, resetCursor = true) => {
      if (!id) return
      try {
        const response = await getComments(id, resetCursor ? null : cursor)
        const newComments = response.data || []

        if (resetCursor) {
          setComments(newComments)
        } else {
          setComments((prev) => [...prev, ...newComments])
        }

        setHasMore(newComments.length > 0)
        if (newComments.length > 0) {
          setCursor(newComments[newComments.length - 1]?.createdAt)
        }
      } catch (err) {
        console.error("Error fetching comments:", err)
      }
    },
    [getComments, cursor]
  )

  // Initial load effect
  useEffect(() => {
    if (!postId) return

    const loadData = async () => {
      setIsLoading(true)
      await fetchPost(postId)
      await fetchComments(postId, true)
      setIsLoading(false)
    }

    loadData()
  }, [postId, fetchPost, fetchComments])

  // Separate effect for when comments need to refresh after submitting
  useEffect(() => {
    if (!postId || !isSubmitting) return

    const refreshComments = async () => {
      await fetchComments(postId, true)
    }

    refreshComments()
  }, [isSubmitting, postId, fetchComments])

  const handleAddComment = async (
    content = newComment,
    selectedMentionUsers = {}
  ) => {
    if (!content.trim()) return

    const payload = {
      content,
      ...getMentionPayload(content, selectedMentionUsers),
      ...getTopicPayload(content),
    }

    const { error: schemaError } = validateSchema(commentSchema, payload)

    if (schemaError) {
      toast.error(schemaError)
      return
    }

    setIsSubmitting(true)
    try {
      await addComment(postId, payload)
      setNewComment("")
      setPost((p) =>
        p ? { ...p, commentsCount: (p.commentsCount || 0) + 1 } : p
      )
    } catch (err) {
      console.error("Error adding comment:", err)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleAddReply = async (
    parentCommentId,
    content,
    selectedMentionUsers = {}
  ) => {
    if (!content.trim()) return

    const payload = {
      parentCommentId,
      content,
      ...getMentionPayload(content, selectedMentionUsers),
      ...getTopicPayload(content),
    }

    const { error: schemaError } = validateSchema(replySchema, payload)

    if (schemaError) {
      toast.error(schemaError)
      return
    }
    setIsSubmitting(true)
    try {
      await addReply(postId, payload)
      // Refresh comments to show the new reply
      await fetchComments(postId, true)
    } catch (err) {
      console.error("Error adding reply:", err)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleLikeComment = async (commentId) => {
    try {
      // Optimistic update
      setComments((prevComments) =>
        prevComments.map((c) => {
          if (c._id === commentId) {
            const isCurrentlyLiked = c.isLiked || false
            return {
              ...c,
              isLiked: !isCurrentlyLiked,
              likesCount: isCurrentlyLiked
                ? Math.max(0, (c.likesCount || 0) - 1)
                : (c.likesCount || 0) + 1,
            }
          }
          // Check replies
          if (c.replies) {
            return {
              ...c,
              replies: c.replies.map((r) =>
                r._id === commentId
                  ? {
                      ...r,
                      isLiked: !r.isLiked,
                      likesCount: r.isLiked
                        ? Math.max(0, (r.likesCount || 0) - 1)
                        : (r.likesCount || 0) + 1,
                    }
                  : r
              ),
            }
          }
          return c
        })
      )

      // API call
      const comment = comments.find(
        (c) =>
          c._id === commentId || c.replies?.some((r) => r._id === commentId)
      )
      const isCurrentlyLiked =
        comment?._id === commentId
          ? comment.isLiked
          : comment?.replies?.find((r) => r._id === commentId)?.isLiked

      if (!isCurrentlyLiked) {
        await likeComment(commentId)
      } else {
        await unlikeComment(commentId)
      }
    } catch (err) {
      console.error("Error toggling like on comment:", err)
      // Revert optimistic update by refetching
      await fetchComments(postId, true)
    }
  }

  const handleEditComment = (commentId, content) => {
    if (editingCommentId === commentId) {
      setEditingCommentId(null)
      setEditCommentText("")
    } else {
      setEditingCommentId(commentId)
      setEditCommentText(content || "")
    }
  }

  const handleCommentSave = async (commentId) => {
    if (!editCommentText?.trim()) return

    setIsSubmitting(true)
    try {
      await updateComment(commentId, { content: editCommentText })
      // Update local state
      setComments((prevComments) =>
        prevComments.map((c) => {
          if (c._id === commentId) {
            return { ...c, content: editCommentText }
          }
          if (c.replies) {
            return {
              ...c,
              replies: c.replies.map((r) =>
                r._id === commentId ? { ...r, content: editCommentText } : r
              ),
            }
          }
          return c
        })
      )
      setEditingCommentId(null)
      setEditCommentText("")
    } catch (err) {
      console.error("Error updating comment:", err)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDeleteComment = async (commentId) => {
    setIsSubmitting(true)
    try {
      await deleteComment(commentId)
      setCommentToDeleteId(null)
      setPost((p) =>
        p ? { ...p, commentsCount: Math.max(0, (p.commentsCount || 0) - 1) } : p
      )
      // Refresh comments
      await fetchComments(postId, true)
    } catch (err) {
      console.error("Error deleting comment:", err)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleLike = async () => {
    const next = !isLiked
    setIsLiked(next)
    setLikesCount((prev) => (next ? prev + 1 : Math.max(0, prev - 1)))
    try {
      if (next) await likePost(postId)
      else await unlikePost(postId)
    } catch (err) {
      console.error("Error toggling like:", err)
      // Revert
      setIsLiked(!next)
      setLikesCount((prev) => (next ? prev - 1 : prev + 1))
    }
  }

  const handleBookmark = async () => {
    const next = !isBookmarked
    setIsBookmarked(next)
    setBookmarksCount((prev) => (next ? prev + 1 : Math.max(0, prev - 1)))
    try {
      if (next) await bookmarkPost(postId)
      else await removeBookmark(postId)
    } catch (err) {
      console.error("Error toggling bookmark:", err)
      // Revert
      setIsBookmarked(!next)
      setBookmarksCount((prev) => (next ? prev - 1 : prev + 1))
    }
  }

  const handleDeletePost = async () => {
    if (!confirm("Are you sure you want to delete this post?")) return
    try {
      await deletePost(postId)
      navigate(-1)
    } catch (err) {
      console.error("Error deleting post:", err)
      alert("Could not delete post")
    }
  }

  const handleShare = () => {
    if (navigator.share && post) {
      navigator.share({
        title: post._id,
        text: `Check out ${post.content || "this post"}`,
        url: `${window.location.origin}/posts/${post._id}`,
      })
    }
  }

  const loadMoreComments = async () => {
    if (!hasMore || isLoading) return
    await fetchComments(postId, false)
  }

  const getInitials = (fullname) => {
    return fullname?.slice(0, 2).toUpperCase() || "U"
  }

  const postDate = post?.createdAt ? new Date(post.createdAt) : null
  const timeAgo = isValid(postDate)
    ? formatDistanceToNow(postDate, { addSuffix: true })
    : "Just now"

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!post) return null

  const ownPost = currentUserId === post.authorId?._id
  const mentionLookup = getMentionLookup(post.mentions, post.mentionedUsers)

  return (
    <div className="min-h-screen bg-background">
      <div className="sticky top-0 z-10 border-b bg-background/90 backdrop-blur">
        <div className="mx-auto flex max-w-3xl items-center gap-3 px-4 py-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate(-1)}
            className="h-9 w-9 rounded-full"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-base font-semibold">Post</h1>
            <p className="text-xs text-muted-foreground">Conversation detail</p>
          </div>
        </div>
      </div>

      <main className="mx-auto max-w-3xl px-4 py-6">
        <Card className="overflow-hidden rounded-lg border shadow-none">
          <CardHeader className="space-y-0 border-b p-4 sm:p-5">
            <div className="flex items-start justify-between gap-3">
              <Link
                to={`/profile/${post.authorId?._id}`}
                className="flex min-w-0 items-center gap-3"
              >
                <Avatar className="h-11 w-11">
                  <AvatarImage
                    src={
                      post.authorId?.profilePic ||
                      "https://api.dicebear.com/9.x/adventurer-neutral/svg"
                    }
                  />
                  <AvatarFallback>
                    {getInitials(post.authorId?.fullname)}
                  </AvatarFallback>
                </Avatar>
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold">
                    {post.authorId?.fullname || "User"}
                  </p>
                  <p className="text-xs text-muted-foreground">{timeAgo}</p>
                </div>
              </Link>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  {ownPost && (
                    <DropdownMenuItem onClick={handleDeletePost}>
                      Delete Post
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem>Report Post</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </CardHeader>

          <CardContent className="space-y-5 p-4 sm:p-5">
            {post.content && (
              <p className="text-base leading-7 whitespace-pre-wrap">
                {renderInteractiveContent({
                  mentionLookup,
                  navigate,
                  text: post.content,
                })}
              </p>
            )}

            {post.mediaUrls && post.mediaUrls.length > 0 && (
              <div
                className={`grid overflow-hidden rounded-lg border ${
                  post.mediaUrls.length === 1
                    ? "grid-cols-1"
                    : post.mediaUrls.length === 2
                      ? "grid-cols-2"
                      : "grid-cols-2"
                }`}
              >
                {post.mediaUrls.map((url, idx) => (
                  <div
                    key={idx}
                    className={`relative overflow-hidden bg-muted ${
                      post.mediaUrls.length === 3 && idx === 0
                        ? "row-span-2"
                        : ""
                    }`}
                  >
                    <img
                      src={url}
                      alt={`Post media ${idx + 1}`}
                      className="h-full w-full cursor-pointer object-cover"
                      style={{ aspectRatio: "1/1" }}
                    />
                  </div>
                ))}
              </div>
            )}

            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 border-t pt-4 text-sm text-muted-foreground">
              <span className="inline-flex items-center gap-1">
                <Eye className="h-3 w-3" />
                {post.viewCount || 0} views
              </span>
              <span>{likesCount} likes</span>
              <span>{post.commentsCount || 0} comments</span>
              <span>{bookmarksCount} saves</span>
            </div>
          </CardContent>

          <CardFooter className="grid grid-cols-4 border-t p-2">
            <Button
              variant="ghost"
              size="sm"
              className={`gap-2 rounded-md ${isLiked ? "text-red-500" : "text-muted-foreground"}`}
              onClick={handleLike}
            >
              <Heart className={`h-4 w-4 ${isLiked ? "fill-current" : ""}`} />
              <span className="hidden sm:inline">Like</span>
            </Button>

            <Button
              variant="ghost"
              size="sm"
              className="gap-2 rounded-md text-muted-foreground"
            >
              <MessageCircle className="h-4 w-4" />
              <span className="hidden sm:inline">Comment</span>
            </Button>

            <Button
              variant="ghost"
              size="sm"
              className={`gap-2 rounded-md ${isBookmarked ? "text-yellow-500" : "text-muted-foreground"}`}
              onClick={handleBookmark}
            >
              <Bookmark
                className={`h-4 w-4 ${isBookmarked ? "fill-current" : ""}`}
              />
              <span className="hidden sm:inline">Save</span>
            </Button>

            <Button
              variant="ghost"
              size="sm"
              className="gap-2 rounded-md text-muted-foreground"
              onClick={handleShare}
            >
              <Share2 className="h-4 w-4" />
              <span className="hidden sm:inline">Share</span>
            </Button>
          </CardFooter>
        </Card>

        <section className="mt-5 rounded-lg border bg-card">
          <div className="flex items-center justify-between border-b px-4 py-3 sm:px-5">
            <div>
              <h2 className="font-semibold">Comments</h2>
              <p className="text-xs text-muted-foreground">
                {post.commentsCount || 0} in this conversation
              </p>
            </div>
          </div>

          <div className="border-b p-4 sm:p-5">
            <div className="flex gap-3">
              <Avatar className="h-9 w-9 shrink-0">
                <AvatarFallback>ME</AvatarFallback>
              </Avatar>
              <MentionCommentInput
                placeholder="Write a comment..."
                value={newComment}
                onChange={setNewComment}
                onSubmit={handleAddComment}
                rows={3}
                disabled={isSubmitting}
                submitLabel="Post Comment"
              />
            </div>
          </div>

          <div className="space-y-5 p-4 sm:p-5">
            {comments.length === 0 ? (
              <div className="rounded-lg border border-dashed py-10 text-center">
                <p className="font-medium">No comments yet</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Be the first to start the conversation.
                </p>
              </div>
            ) : (
              comments.map((comment) => (
                <Comment
                  key={comment._id}
                  comment={comment}
                  onReply={handleAddReply}
                  onLikeComment={handleLikeComment}
                  onEdit={handleEditComment}
                  onSave={handleCommentSave}
                  onDelete={setCommentToDeleteId}
                  editingId={editingCommentId}
                  editText={editCommentText}
                  setEditText={setEditCommentText}
                  currentUserId={currentUserId}
                />
              ))
            )}

            {hasMore && comments.length > 0 && (
              <div className="flex justify-center pt-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={loadMoreComments}
                  disabled={isLoading}
                >
                  Load More Comments
                </Button>
              </div>
            )}
          </div>
        </section>

        <AlertDialog
          open={Boolean(commentToDeleteId)}
          onOpenChange={(open) => {
            if (!open) setCommentToDeleteId(null)
          }}
        >
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete comment?</AlertDialogTitle>
              <AlertDialogDescription>
                This comment will be permanently removed from the post.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel disabled={isSubmitting}>
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction
                disabled={isSubmitting}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                onClick={() => handleDeleteComment(commentToDeleteId)}
              >
                {isSubmitting ? "Deleting..." : "Delete"}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </main>
    </div>
  )
}
