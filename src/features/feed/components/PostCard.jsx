import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { FaHeart, FaShareAlt, FaCommentAlt } from "react-icons/fa"
import { FaBookmark } from "react-icons/fa6"

export default function PostCard({ post }) {
  const author = post.authorId
  return (
    <Card className="mb-4">
      <CardContent className="pt-6">
        <div className="flex items-start gap-3">
          <Avatar>
            <AvatarImage src={author?.profilePic} />
            <AvatarFallback>
              {author?.username?.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-semibold">@{author?.username} </span>
              <span className="text.xs text-muted-foreground">
                {new Date(post.createdAt).toLocaleString()}
              </span>
            </div>
            <p className="mt-2 whitespace-pre-wrap">{post.content}</p>
            {post.mediaUrls?.length > 0 && (
              <div className="mt-3 grid grid-cols-2 gap-2">
                {post.mediaUrls.map((url, index) => (
                  <img
                    key={index}
                    src={url}
                    alt="media"
                    className="rouneded-md max-h-64 w-full object-cover"
                  />
                ))}
              </div>
            )}
            <div className="flex items-center justify-between">
              <div className="mt-4 flex gap-6 text-muted-foreground">
                <Button variant="ghost" size="sm" className="gap-1">
                  <FaHeart /> {post.likesCount || 0}
                </Button>
                <Button variant="ghost" size="sm" className="gap-1">
                  <FaCommentAlt />
                  {post.commuentsCount || 0}
                </Button>
                <Button variant="ghost" size="sm" className="gap-1">
                  <FaBookmark />
                  {post.bookmarksCount || 0}
                </Button>
              </div>
              <div className="text-muted-foreground">
                <Button variant="ghost" size="sm" className="gap-1">
                  <FaShareAlt />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
