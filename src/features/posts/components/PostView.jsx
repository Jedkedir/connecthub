import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import {Separator} from "@/components/ui/separator"
import {
  Heart,
  MessageCircle,
  Bookmark,
  Share2,
  Eye,
  MoreHorizontal,
  Send,
  ArrowLeft,
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useState, useEffect } from "react"
import { formatDistanceToNow,isValid,parseISO } from "date-fns"
import { usePosts } from "../hooks/usePosts"
import { useNavigate } from "react-router-dom"
import { useAuthStore } from "@/features/auth"
import { Link } from "react-router-dom"

function Comment({ comment, onReply, onLikeComment }) {
  const [isLiked, setIsLiked] = useState(false)
  const [showReplyInput, setShowReplyInput] = useState(false)
  const [replyContent, setReplyContent] = useState("")

  let timeAgo = "Just now"; // or some default string

if (comment?.createdAt) {
  timeAgo = formatDistanceToNow(parseISO(comment.createdAt), {
    addSuffix: true,
  });
}

  const handleSubmitReply = () => {
    if (replyContent.trim()) {
      onReply(comment._id, replyContent)
      setReplyContent("")
      setShowReplyInput(false)
    }
  }
  const currentUserId = useAuthStore((state) => state.user?._id)
  let avaterSide = "left"
  if (currentUserId == comment.userId?._id) {
      avaterSide = "right"
  }

  return (
    <div className={`flex space-x-3 ${avaterSide === "right" ? "flex-row-reverse" : ""} gap-1 items-center`}>
      <Link to={`/profile/${comment.userId?._id}`}>
      <Avatar className="size-10">
        <AvatarImage src={comment.userId?.profilePic || "https://api.dicebear.com/9.x/adventurer-neutral/svg"} />
        <AvatarFallback>
          {comment.userId?.username?.slice(0, 2).toUpperCase() || "User"}
        </AvatarFallback>
      </Avatar>
      </Link>
      <div className="flex-1">
        <div className="rounded-lg bg-muted p-3">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold">@{comment.userId?.username || "user"}</p>
            <p className="text-xs text-muted-foreground">{timeAgo}</p>
          </div>
          <p className="text-sm mt-1">{comment.content}</p>
        </div>
        <div className="flex items-center space-x-4 mt-1 ml-2">
          <Button
            variant="ghost"
            size="sm"
            className="h-auto p-0 text-xs"
            onClick={() => onLikeComment?.(comment._id)}
          >
            <Heart className={`h-3 w-3 mr-1 ${isLiked ? "fill-current text-red-500" : ""}`} />
            {comment.likesCount || 0}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="h-auto p-0 text-xs"
            onClick={() => setShowReplyInput(!showReplyInput)}
          >
            <MessageCircle className="h-3 w-3 mr-1" />
            Reply
          </Button>
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
          <div className="ml-6 mt-2 space-y-2">
            {comment.replies.map((reply) => (
              <Comment key={reply._id} comment={reply} onReply={onReply} />
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
    bookmarkPost,
    removeBookmark,
    likePost,
    unlikePost,
    deletePost,
  } = usePosts()

  const fetchPost = async (id) => {
    if (!id) return
    setIsLoading(true)
    try {
      const data = await getPostById(id)
      setPost(data.data.post)
      setLikesCount(data.data?.likesCount || 0)
      setBookmarksCount(data.data?.bookmarksCount || 0)
    } catch (err) {
      console.error("Error fetching post:", err)
    } finally {
      setIsLoading(false)
    }
  }

  const fetchComments = async (id) => {
    if (!id) return
    try {
      const data = await getComments(id)
      setComments(data.data || [])
    } catch (err) {
      console.error("Error fetching comments:", err)
    }
  }
  useEffect(() => {
    if (!postId) return
    fetchPost(postId)
    fetchComments(postId)
  }, [postId,isSubmitting])

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
      setPost((p) => (p ? { ...p, commentsCount: (p.commentsCount || 0) + 1 } : p))
    } catch (err) {
      console.error("Error adding comment:", err)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleAddReply = async (commentId, content) => {
    // TODO: implement reply API
    console.log("reply", commentId, content)
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

  const getInitials = (username) => {
    return username?.slice(0, 2).toUpperCase() || "U"
  }

const postDate = post?.createdAt ? new Date(post.createdAt) : null;

const timeAgo = isValid(postDate) 
  ? formatDistanceToNow(postDate, { addSuffix: true }) 
  : "Just now";
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!post) return null

  return (
    <div className="min-h-screen bg-background rounded-t-full">
      {/* Header with back button */}
      <div className="sticky top-0 z-10 bg-background border-b">
        <div className="container max-w-4xl mx-auto px-4">
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
      
      <div className="container max-w-4xl mx-auto px-4 py-6">
        {/* Post Content */}
        <Card className="border-0 shadow-none">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 px-0">
            <div className="flex items-center space-x-3">
              <Link to={`/profile/${post.authorId?._id}`}>
              <Avatar>
                <AvatarImage src={post.authorId?.profilePic || "https://api.dicebear.com/9.x/adventurer-neutral/svg"} />
                <AvatarFallback>{getInitials(post.authorId?.username)}</AvatarFallback>
              </Avatar>
              </Link>
              <div>
                <p className="text-sm font-semibold">@{post.authorId?.username}</p>
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
                {ownPost && <DropdownMenuItem onClick={handleDeletePost}>Delete Post</DropdownMenuItem>}
                <DropdownMenuItem>Report Post</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </CardHeader>
          <Separator/>
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
                      post.mediaUrls.length === 3 && idx === 0 ? "row-span-2" : ""
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
            <Button variant="ghost" size="sm" className={`flex items-center gap-2 ${isLiked ? "text-red-500" : ""}`} onClick={handleLike}>
              <Heart className={`h-4 w-4 ${isLiked ? "fill-current" : ""}`} />
              Like
            </Button>

            <Button variant="ghost" size="sm" className="flex items-center gap-2">
              <MessageCircle className="h-4 w-4" />
              Comment
            </Button>

            <Button variant="ghost" size="sm" className={`flex items-center gap-2 ${isBookmarked ? "text-yellow-500" : ""}`} onClick={handleBookmark}>
              <Bookmark className={`h-4 w-4 ${isBookmarked ? "fill-current" : ""}`} />
              Save
            </Button>

            <Button variant="ghost" size="sm" className="flex items-center gap-2">
              <Share2 className="h-4 w-4" />
              Share
            </Button>
          </CardFooter>
        </Card>

        {/* Comments Section */}
        <div className="border-t mt-6 pt-6">
          <h3 className="font-semibold mb-4">Comments ({post.commentsCount})</h3>

          {/* Add Comment Input */}
          <div className="flex space-x-3 mb-6">
            <Avatar className="h-8 w-8">
              <AvatarFallback>ME</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <Textarea placeholder="Write a comment..." value={newComment} onChange={(e) => setNewComment(e.target.value)} className="text-sm" rows={3} />
              <div className="flex justify-end mt-2">
                <Button size="sm" onClick={handleAddComment} disabled={isSubmitting || !newComment.trim()}>
                  <Send className="h-3 w-3 mr-1" />
                  Post Comment
                </Button>
              </div>
            </div>
          </div>

          {/* Comments List */}
          <div className="space-y-4">
            {comments.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">No comments yet. Be the first to comment!</p>
            ) : (
              comments.map((comment) => <Comment key={comment._id} comment={comment} onReply={handleAddReply} />)
            )}

            {hasMore && (
              <div className="flex justify-center pt-4">
                <Button variant="outline" size="sm">Load More Comments</Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
