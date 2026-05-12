import { useEffect, useState } from "react"
import Post from "./Post"
import { usePosts } from "../hooks/usePosts"
import { set } from "date-fns"


export default function Posts({ user }) {
  const { getUserPosts } = usePosts()
  const [posts, setPosts] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetch = async () => {
      setIsLoading(true)
      try {
        if (!user) {
          setPosts([])
          return
        }
        const userId = user._id || user?.id || user
        const data = await getUserPosts(userId)
        setPosts(data.data || [])
      } catch (err) {
        console.error("Error fetching user posts:", err)
        setPosts([])
      } finally {
        setIsLoading(false)
      }
    }

    fetch()
  }, [user, getUserPosts])

  if (isLoading) return <div className="text-center">Loading...</div>

  if (!posts || posts.length === 0) {
    return <div className="text-center text-muted-foreground">No posts yet.</div>
  }
  return (
    <div className="mx-auto flex max-w-4xl flex-col gap-4 w-full">
      {posts.map((post) => (
        <Post key={post._id} post={post} />
      ))}
    </div>
  )
}
