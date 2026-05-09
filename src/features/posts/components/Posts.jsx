import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Heart, MessageCircle, Bookmark, Share2, Eye, MoreHorizontal } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useState } from "react"
import { formatDistanceToNow } from "date-fns"

const data = [
  {
    "_id": "69fe0e8b6354d498cd31777b",
    "authorId": {
      "_id": "69fdfc586354d498cd31776b",
      "username": "app",
      "profilePic": ""
    },
    "content": "This is some photos of the Arena.",
    "mediaUrls": [
      "https://images.unsplash.com/photo-1504450758481-7338eba7524a?q=80&w=2069&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
    ],
    "likesCount": 0,
    "commentsCount": 0,
    "bookmarksCount": 0,
    "viewCount": 0,
    "createdAt": "2026-05-08T16:25:47.186Z",
    "updatedAt": "2026-05-08T16:25:47.186Z",
    "__v": 0
  },
  {
    "_id": "69fe0e5b6354d498cd317778",
    "authorId": {
      "_id": "69fdfc586354d498cd31776b",
      "username": "app",
      "profilePic": ""
    },
    "content": "This is some photos of Lebron James.",
    
    "likesCount": 0,
    "commentsCount": 0,
    "bookmarksCount": 0,
    "viewCount": 0,
    "createdAt": "2026-05-08T16:24:59.993Z",
    "updatedAt": "2026-05-08T16:24:59.993Z",
    "__v": 0
  }
]

function SinglePost({ post, onLike, onComment, onBookmark, onShare, onReport }) {
  const [isLiked, setIsLiked] = useState(false)
  const [isBookmarked, setIsBookmarked] = useState(false)
  const [likesCount, setLikesCount] = useState(post.likesCount)
  const [bookmarksCount, setBookmarksCount] = useState(post.bookmarksCount)

  const handleLike = () => {
    setIsLiked(!isLiked)
    setLikesCount(prev => isLiked ? prev - 1 : prev + 1)
    onLike?.(post._id)
  }

  const handleBookmark = () => {
    setIsBookmarked(!isBookmarked)
    setBookmarksCount(prev => isBookmarked ? prev - 1 : prev + 1)
    onBookmark?.(post._id)
  }

  const getInitials = (username) => {
    return username.slice(0, 2).toUpperCase()
  }

  const timeAgo = formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      {/* Post Header */}
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div className="flex items-center space-x-3">
          <Avatar>
            <AvatarImage 
              src={post.authorId.profilePic || `https://api.dicebear.com/7.x/avataaars/svg?seed=${post.authorId.username}`} 
            />
            <AvatarFallback>{getInitials(post.authorId.username)}</AvatarFallback>
          </Avatar>
          <div>
            <p className="font-semibold text-sm">@{post.authorId.username}</p>
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
            <DropdownMenuItem onClick={() => onReport?.(post._id)}>
              Report Post
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardHeader>

      {/* Post Content */}
      <CardContent className="space-y-3">
        {post.content && (
          <p className="text-sm">{post.content}</p>
        )}
        
        {/* Media Grid */}
        {post.mediaUrls && post.mediaUrls.length > 0 && (
          <div className={`grid gap-2 ${
            post.mediaUrls.length === 1 ? 'grid-cols-1' :
            post.mediaUrls.length === 2 ? 'grid-cols-2' :
            post.mediaUrls.length === 3 ? 'grid-cols-2' :
            'grid-cols-2'
          }`}>
            {post.mediaUrls.map((url, idx) => (
              <div 
                key={idx} 
                className={`relative overflow-hidden rounded-lg ${
                  post.mediaUrls.length === 3 && idx === 0 ? 'row-span-2' : ''
                }`}
              >
                <img
                  src={url}
                  alt={`Post media ${idx + 1}`}
                  className="w-full h-full object-cover cursor-pointer hover:scale-105 transition-transform duration-300"
                  style={{ aspectRatio: '1/1' }}
                />
              </div>
            ))}
          </div>
        )}

        {/* Stats Bar */}
        <div className="flex items-center justify-between pt-2 text-xs text-muted-foreground border-t">
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
          className={`flex items-center gap-2 ${isLiked ? 'text-red-500' : ''}`}
          onClick={handleLike}
        >
          <Heart className={`h-4 w-4 ${isLiked ? 'fill-current' : ''}`} />
          Like
        </Button>
        
        <Button 
          variant="ghost" 
          size="sm" 
          className="flex items-center gap-2"
          onClick={() => onComment?.(post._id)}
        >
          <MessageCircle className="h-4 w-4" />
          Comment
        </Button>
        
        <Button 
          variant="ghost" 
          size="sm" 
          className={`flex items-center gap-2 ${isBookmarked ? 'text-yellow-500' : ''}`}
          onClick={handleBookmark}
        >
          <Bookmark className={`h-4 w-4 ${isBookmarked ? 'fill-current' : ''}`} />
          Save
        </Button>
        
        <Button 
          variant="ghost" 
          size="sm" 
          className="flex items-center gap-2"
          onClick={() => onShare?.(post._id)}
        >
          <Share2 className="h-4 w-4" />
          Share
        </Button>
      </CardFooter>
    </Card>
  )
}

export default function Posts({ data: postsData, onLike, onComment, onBookmark, onShare, onReport, layout = 'grid' }) {
  const posts = postsData || data

  if (layout === 'list') {
    return (
      <div className="space-y-4 max-w-2xl mx-auto">
        {posts.map((post) => (
          <SinglePost
            key={post._id}
            post={post}
            onLike={onLike}
            onComment={onComment}
            onBookmark={onBookmark}
            onShare={onShare}
            onReport={onReport}
          />
        ))}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {posts.map((post) => (
        <SinglePost
          key={post._id}
          post={post}
          onLike={onLike}
          onComment={onComment}
          onBookmark={onBookmark}
          onShare={onShare}
          onReport={onReport}
        />
      ))}
    </div>
  )
}