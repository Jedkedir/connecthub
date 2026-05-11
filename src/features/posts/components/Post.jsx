import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  Heart,
  MessageCircle,
  Bookmark,
  Share2,
  Eye,
  MoreHorizontal,
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { formatDistanceToNow } from "date-fns"
import { usePosts } from "../hooks/usePosts"
export default function Post({
  post
}) {
  const [isLiked, setIsLiked] = useState(false)
  const [isBookmarked, setIsBookmarked] = useState(false)
  const [likesCount, setLikesCount] = useState(post.likesCount)
  const [bookmarksCount, setBookmarksCount] = useState(post.bookmarksCount)
  const { bookmarkPost, likePost, removeBookmark, unlikePost } = usePosts()
  const navigate = useNavigate()

  const handleLike = () => {
    const next = !isLiked
    setIsLiked(next)
    setLikesCount((prev) => (next ? prev + 1 : prev - 1))
    if (next) {
      likePost(post._id)
    } else {
      unlikePost(post._id)
    }
  }

  const handleBookmark = () => {
    const next = !isBookmarked
    setIsBookmarked(next)
    setBookmarksCount((prev) => (next ? prev + 1 : prev - 1))
    if (next) {
      bookmarkPost(post._id)
    } else {
      removeBookmark(post._id)
    }
  }
  const handleShare = () =>{
    //TODO 
    console.log("Shared post")
  }
  const handlePostDetail = () => {
    navigate(`/posts/${post._id}`)
  }

  const getInitials = (username) => {
    console.log("Generating initials for username:", username)
    return username.slice(0, 2).toUpperCase()
  }

  const timeAgo = formatDistanceToNow(new Date(post.createdAt), {
    addSuffix: true,
  })

  return (
    <>
    <Card className="overflow-hidden transition-shadow hover:shadow-lg" >
      {/* Post Header */}
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div className="flex items-center space-x-3">
          <Avatar>
            <AvatarImage
              src={
                post?.authorId?.profilePic ||
                `https://api.dicebear.com/7.x/avataaars/svg?seed=${post?.authorId?.username}`
              }
            />
            <AvatarFallback>
              {getInitials(post?.authorId?.username || "User")}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="text-sm font-semibold">@{post?.authorId?.username}</p>
            <p className="text-xs text-muted-foreground">{timeAgo}</p>
          </div>
        </div>
      </CardHeader>

      {/* Post Content */}
      <CardContent className="space-y-3" onClick={()=>{handlePostDetail(post.id)}}>
        {post.content && <p className="text-sm">{post.content}</p>}

        {/* Media Grid */}
        {post.mediaUrls && post.mediaUrls.length > 0 && (
          <div
            className={`grid gap-2 ${
              post.mediaUrls.length === 1
                ? "grid-cols-1"
                : post.mediaUrls.length === 2
                  ? "grid-cols-2"
                  : post.mediaUrls.length === 3
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
                  className="h-full w-full cursor-pointer object-cover transition-transform duration-300 hover:scale-105"
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

      {/* Action Buttons */}
      <CardFooter className="flex justify-between pt-0">
        <Button
          variant="ghost"
          size="sm"
          className={`flex items-center gap-2 ${isLiked ? "text-red-500" : ""}`}
          onClick={handleLike}
        >
          <Heart className={`h-4 w-4 ${isLiked ? "fill-current" : ""}`} />
        </Button>

        <Button
          variant="ghost"
          size="sm"
          className="flex items-center gap-2"
          onClick={()=>{handlePostDetail(post.id)}}
        >
          <MessageCircle className="h-4 w-4" />
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
        </Button>

        <Button
          variant="ghost"
          size="sm"
          className="flex items-center gap-2"
          onClick={() => handleShare()}
        >
          <Share2 className="h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
    </>
  )
}
