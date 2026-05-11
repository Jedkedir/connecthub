import { useState,useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import Post from "./Post"
import { usePosts } from "../hooks/usePosts"
export default function Likes() {
  const { getLikedPosts } = usePosts()
    const [likedPosts, setLikedPosts] = useState([])
    const [isLoading, setIsLoading] = useState(true)
  
    useEffect(() => {
      const fetchLikedPosts = async () => {
        try {
          const response = await getLikedPosts()
          setLikedPosts(response.data || [])
        } catch (error) {
          console.error("Error fetching liked posts:", error)
        } finally {
          setIsLoading(false)
        }
      }
  
      fetchLikedPosts()
    }, [getLikedPosts])
  
    if (isLoading) {
      return (
        <Card>
          <CardContent className="p-6 text-sm text-muted-foreground">
            Loading...
          </CardContent>
        </Card>
      )
    }
  
    if (likedPosts.length === 0) {
      return (
        <Card>
          <CardContent className="p-6 text-sm text-muted-foreground">
            Nothing here.
          </CardContent>
        </Card>
      )
    }
    if (likedPosts.length > 0) {
      return (
        <div className="mx-auto flex max-w-4xl flex-col gap-4 w-full">
          {likedPosts.map((post) => {
            return <Post key={post._id} post={post.postId} />
          })}
        </div>
      )
    }
  return (
    <Card>
      <CardContent className="p-6 text-sm text-muted-foreground">
        Nothing here.
      </CardContent>
    </Card>
  )
}
