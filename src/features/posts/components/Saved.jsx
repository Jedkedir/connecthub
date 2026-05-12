import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import Post from "./Post"
import { usePosts } from "../hooks/usePosts"
export default function Saved() {
  const { getBookmarkedPosts } = usePosts()
  const [bookmarkedPosts, setBookmarkedPosts] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchBookmarkedPosts = async () => {
      try {
        const response = await getBookmarkedPosts()
        setBookmarkedPosts(response.data || [])
      } catch (error) {
        console.error("Error fetching bookmarked posts:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchBookmarkedPosts()
  }, [getBookmarkedPosts])

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6 text-sm text-muted-foreground">
          Loading...
        </CardContent>
      </Card>
    )
  }

  if (bookmarkedPosts.length === 0) {
    return (
      <Card>
        <CardContent className="p-6 text-sm text-muted-foreground">
          Nothing here.
        </CardContent>
      </Card>
    )
  }
  if (bookmarkedPosts.length > 0) {
    return (
      <div className="mx-auto flex w-full max-w-4xl flex-col gap-4">
        {bookmarkedPosts.map((post) => {
          return <Post key={post._id} post={post.postId} />
        })}
      </div>
    )
  }
}
