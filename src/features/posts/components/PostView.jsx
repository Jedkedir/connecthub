import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Separator } from "@/components/ui/separator"
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
import { useState, useEffect } from "react"
import { formatDistanceToNow, isValid, parseISO } from "date-fns"
import { usePosts } from "../hooks/usePosts"
import { useNavigate } from "react-router-dom"
import { useAuthStore } from "@/features/auth"
import { Link } from "react-router-dom"

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

  let timeAgo = "Just now" // or some default string

  if (comment?.createdAt) {
    timeAgo = formatDistanceToNow(parseISO(comment.createdAt), {
      addSuffix: true,
    })
  }

  const handleSubmitReply = () => {
    if (replyContent.trim()) {
      onReply(comment._id, replyContent)
      setReplyContent("")
      setShowReplyInput(false)
    }
  }
  let avaterSide = "left"
  if (currentUserId == comment.userId?._id) {
    avaterSide = "right"
  }
  const isOwnComment = currentUserId === comment.userId?._id

  return (
    <div
      className={`flex space-x-3 ${avaterSide === "right" ? "flex-row-reverse" : ""} items-center gap-1`}
    >
      <Link to={`/profile/${comment.userId?._id}`}>
        <Avatar className="size-10">
          <AvatarImage
            src={
              comment.userId?.profilePic ||
              "https://api.dicebear.com/9.x/adventurer-neutral/svg"
            }
          />
          <AvatarFallback>
            {comment.userId?.username?.slice(0, 2).toUpperCase() || "User"}
          </AvatarFallback>
        </Avatar>
      </Link>
      <div className="flex-1">
        <div className="rounded-lg bg-muted p-3">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold">
              @{comment.userId?.username || "user"}
            </p>
            <div className="flex items-center gap-2">
              <p className="text-xs text-muted-foreground">{timeAgo}</p>
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
          </div>
          {editingId === comment._id ? (
            <Textarea
              value={editText}
              onChange={(e) => setEditText(e.target.value)}
              className="mt-2 text-sm"
              rows={2}
            />
          ) : (
            <p className="mt-1 text-sm">{comment.content}</p>
          )}
        </div>
        {editingId === comment._id && (
          <div className="mt-2 ml-2 flex gap-2">
            <Button
              size="sm"
              onClick={() => onSave(comment._id)}
              className="h-auto py-1 text-xs"
            >
              Save
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => onEdit(null)}
              className="h-auto py-1 text-xs"
            >
              Cancel
            </Button>
          </div>
        )}
        <div className="mt-1 ml-2 flex items-center space-x-4">
          <Button
            variant="ghost"
            size="sm"
            className={`h-auto p-0 text-xs ${isLiked ? "text-red-500" : ""}`}
            onClick={() => {
              setIsLiked(!isLiked)
              onLikeComment?.(comment._id)
            }}
          >
            <Heart
              className={`mr-1 h-3 w-3 ${isLiked ? "fill-current" : ""}`}
            />
            {comment.likesCount || 0}
          </Button>
          {!isReply && (
            <Button
              variant="ghost"
              size="sm"
              className="h-auto p-0 text-xs"
              onClick={() => setShowReplyInput(!showReplyInput)}
            >
              <MessageCircle className="mr-1 h-3 w-3" />
              Reply
            </Button>
          )}
        </div>
        {showReplyInput && (
          <div className="mt-2 flex items-start space-x-2">
            <Textarea
              placeholder="Write a reply..."
              value={replyContent}
              onChange={(e) => setReplyContent(e.target.value)}
              className="flex-1 text-sm"
              rows={2}
            />
            <Button size="sm" onClick={handleSubmitReply}>
              <Send className="h-3 w-3" />
            </Button>
          </div>
        )}
        {comment.replies && comment.replies.length > 0 && (
          <div className="mt-2 ml-6 space-y-2">
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
  const currentUserId = useAuthStore((state) => state.user?._id)
  let ownPost = false
  if (currentUserId == post?.authorId?._id) {
    ownPost = true
  }

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

  const fetchPost = async (id) => {
    if (!id) return
    setIsLoading(true)
    try {
      const { data } = await getPostById(id)
      setPost(data.post)
      setLikesCount(data.post.likesCount || 0)
      setBookmarksCount(data.post.bookmarksCount || 0)
      setIsBookmarked(data.post.isBookmarked || false)
    } catch (err) {
      console.error("Error fetching post:", err)
    } finally {
      setIsLoading(false)
    }
  }

  const fetchComments = async (id) => {
    if (!id) return
    try {
      const { data } = await getComments(id)
      setComments(data || [])
    } catch (err) {
      console.error("Error fetching comments:", err)
    }
  }
  useEffect(() => {
    if (!postId) return
    fetchPost(postId)
    fetchComments(postId)
  }, [postId, isSubmitting])

  const handleAddComment = async () => {
    if (!newComment.trim()) return

    setIsSubmitting(true)
    try {
      const created = await addComment(postId, { content: newComment })
      // if API returns created comment
      const newCommentObj = created || {
        _id: Date.now().toString(),
        userId: { _id: "me", username: "me", profilePic: null },
        postId,
        content: newComment,
        createdAt: new Date().toISOString(),
      }
      setComments([newCommentObj, ...comments])
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

  const handleAddReply = async (parentCommentId, content) => {
    if (!content.trim()) return
    setIsSubmitting(true)
    try {
      const created = await addReply(postId, { parentCommentId, content })
      const newReply = created || {
        _id: Date.now().toString(),
        userId: { _id: currentUserId, username: "me", profilePic: null },
        content,
        createdAt: new Date().toISOString(),
        likesCount: 0,
      }
      // Update comments with new reply nested under parent
      setComments(
        comments.map((c) =>
          c._id === parentCommentId
            ? {
                ...c,
                replies: [newReply, ...(c.replies || [])],
              }
            : c
        )
      )
    } catch (err) {
      console.error("Error adding reply:", err)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleLikeComment = async (commentId) => {
    try {
      const updatedComment = comments.find((c) => c._id === commentId)
      if (!updatedComment) return
      const isLiked = updatedComment.isLiked
      // Optimistic update
      setComments(
        comments.map((c) =>
          c._id === commentId
            ? {
                ...c,
                isLiked: !isLiked,
                likesCount: isLiked
                  ? Math.max(0, c.likesCount - 1)
                  : c.likesCount + 1,
              }
            : c
        )
      )
      // API call
      if (!isLiked) {
        await likeComment(commentId)
      } else {
        await unlikeComment(commentId)
      }
    } catch (err) {
      console.error("Error toggling like on comment:", err)
    }
  }

  const handleEditComment = (commentId, content) => {
    if (editingCommentId === commentId) {
      // Cancel edit
      setEditingCommentId(null)
      setEditCommentText("")
    } else {
      // Start edit
      setEditingCommentId(commentId)
      setEditCommentText(content || "")
    }
  }

  const handleCommentSave = async (commentId) => {
    if (!editCommentText?.trim()) return
    try {
      await updateComment(commentId, { content: editCommentText })
      setComments(
        comments.map((c) =>
          c._id === commentId ? { ...c, content: editCommentText } : c
        )
      )
      setEditingCommentId(null)
      setEditCommentText("")
    } catch (err) {
      console.error("Error updating comment:", err)
    }
  }

  const handleDeleteComment = async (commentId) => {
    if (!confirm("Delete this comment?")) return
    setIsSubmitting(true)
    try {
      await deleteComment(commentId)
      setComments(comments.filter((c) => c._id !== commentId))
      setPost((p) =>
        p ? { ...p, commentsCount: Math.max(0, p.commentsCount - 1) } : p
      )
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
    // Implement share functionality
    if (navigator.share) {
      navigator.share({
        title: post?._id,
        text: `Check out ${post?.content}`,
        url: `${window.location.origin}/posts/${post._id}`,
      })
    }
  }

  const getInitials = (username) => {
    return username?.slice(0, 2).toUpperCase() || "U"
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

  return (
    <div className="min-h-screen rounded-t-full bg-background">
      {/* Header with back button */}
      <div className="sticky top-0 z-10 border-b bg-background">
        <div className="container mx-auto max-w-4xl px-4">
          <div className="flex items-center space-x-4 py-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate(-1)}
              className="h-8 w-8"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <h1 className="text-xl font-semibold">Post</h1>
          </div>
        </div>
      </div>

      <div className="container mx-auto max-w-4xl px-4 py-6">
        {/* Post Content */}
        <Card className="border-0 shadow-none">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 px-0">
            <div className="flex items-center space-x-3">
              <Link to={`/profile/${post.authorId?._id}`}>
                <Avatar>
                  <AvatarImage
                    src={
                      post.authorId?.profilePic ||
                      "https://api.dicebear.com/9.x/adventurer-neutral/svg"
                    }
                  />
                  <AvatarFallback>
                    {getInitials(post.authorId?.username)}
                  </AvatarFallback>
                </Avatar>
              </Link>
              <div>
                <p className="text-sm font-semibold">
                  @{post.authorId?.username}
                </p>
                <p className="text-xs text-muted-foreground">{timeAgo}</p>
              </div>
            </div>

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
          </CardHeader>
          <Separator />
          <CardContent className="space-y-3 px-0">
            {post.content && <p className="text-sm">{post.content}</p>}

            {/* Media Grid */}
            {post.mediaUrls && post.mediaUrls.length > 0 && (
              <div
                className={`grid gap-2 ${
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
                    className={`relative overflow-hidden rounded-lg ${
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

            {/* Stats Bar */}
            <div className="flex items-center justify-between border-t pt-2 text-xs text-muted-foreground">
              <div className="flex items-center space-x-2">
                <Eye className="h-3 w-3" />
                <span>{post.viewCount} views</span>
              </div>
              <div className="flex items-center space-x-4">
                <span>{likesCount} likes</span>
                <span>{post.commentsCount} comments</span>
                <span>{bookmarksCount} saves</span>
              </div>
            </div>
          </CardContent>

          <CardFooter className="flex justify-between px-0">
            <Button
              variant="ghost"
              size="sm"
              className={`flex items-center gap-2 ${isLiked ? "text-red-500" : ""}`}
              onClick={handleLike}
            >
              <Heart className={`h-4 w-4 ${isLiked ? "fill-current" : ""}`} />
              Like
            </Button>

            <Button
              variant="ghost"
              size="sm"
              className="flex items-center gap-2"
            >
              <MessageCircle className="h-4 w-4" />
              Comment
            </Button>

            <Button
              variant="ghost"
              size="sm"
              className={`flex items-center gap-2 ${isBookmarked ? "text-yellow-500" : ""}`}
              onClick={handleBookmark}
            >
              <Bookmark
                className={`h-4 w-4 ${isBookmarked ? "fill-current" : ""}`}
              />
              Save
            </Button>

            <Button
              variant="ghost"
              size="sm"
              className="flex items-center gap-2"
              onClick={handleShare}
            >
              <Share2 className="h-4 w-4" />
              Share
            </Button>
          </CardFooter>
        </Card>

        {/* Comments Section */}
        <div className="mt-6 border-t pt-6">
          <h3 className="mb-4 font-semibold">
            Comments ({post.commentsCount})
          </h3>

          {/* Add Comment Input */}
          <div className="mb-6 flex space-x-3">
            <Avatar className="h-8 w-8">
              <AvatarFallback>ME</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <Textarea
                placeholder="Write a comment..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                className="text-sm"
                rows={3}
              />
              <div className="mt-2 flex justify-end">
                <Button
                  size="sm"
                  onClick={handleAddComment}
                  disabled={isSubmitting || !newComment.trim()}
                >
                  <Send className="mr-1 h-3 w-3" />
                  Post Comment
                </Button>
              </div>
            </div>
          </div>

          {/* Comments List */}
          <div className="space-y-4">
            {comments.length === 0 ? (
              <p className="py-8 text-center text-muted-foreground">
                No comments yet. Be the first to comment!
              </p>
            ) : (
              comments.map((comment) => (
                <Comment
                  key={comment._id}
                  comment={comment}
                  onReply={handleAddReply}
                  onLikeComment={handleLikeComment}
                  onEdit={handleEditComment}
                  onSave={handleCommentSave}
                  onDelete={handleDeleteComment}
                  editingId={editingCommentId}
                  editText={editCommentText}
                  setEditText={setEditCommentText}
                  currentUserId={currentUserId}
                />
              ))
            )}

            {hasMore && (
              <div className="flex justify-center pt-4">
                <Button variant="outline" size="sm">
                  Load More Comments
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
