import { useState, useEffect, useCallback, useRef } from "react"
import { feedService } from "@/features/feed/services/feed.service"
import { Card, CardContent } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import Post from "../../posts/components/Post"
import CreatePostForm from "./CreatePost"

export default function Feed() {
  const [posts, setPosts] = useState([])
  const [cursor, setCursor] = useState(null)
  const [hasMore, setHasMore] = useState(true)
  const [loading, setLoading] = useState(false)
  const [initialLoading, setInitialLoading] = useState(true)
  const observerRef = useRef()

  const loadPosts = useCallback(
    async (reset = false) => {
      if (loading) return
      setLoading(true)
      try {
        const params = reset ? {} : { cursor }
        const data = await feedService.getPersonalizedFeed(params)
        const newPosts = data.data || []
        setPosts((prev) => (reset ? newPosts : [...prev, ...newPosts]))
        setHasMore(data.pageInfo?.hasMore ?? false)
        setCursor(data.pageInfo?.nextCursor ?? null)
      } catch (err) {
        console.error("Failed to load feed", err)
      } finally {
        setLoading(false)
        if (reset) setInitialLoading(false)
      }
    },
    [cursor, loading]
  )

  useEffect(() => {
    loadPosts(true)
  }, [])

  const handlePostCreated = useCallback(() => {
    setCursor(null)
    setHasMore(true)
    loadPosts(true)
  }, [loadPosts])

  const lastPostRef = useCallback(
    (node) => {
      if (loading) return
      if (observerRef.current) observerRef.current.disconnect()
      observerRef.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) loadPosts()
      })
      if (node) observerRef.current.observe(node)
    },
    [loading, hasMore, loadPosts]
  )

  return (
    <div className="mx-auto max-w-4xl">
      <CreatePostForm onPostCreated={handlePostCreated} />
      {initialLoading ? (
        <div className="py-10 text-center text-muted-foreground">
          Loading your feed...
        </div>
      ) : posts.length === 0 ? (
        <Card>
          <CardContent className="py-10 text-center text-muted-foreground">
            No posts from people you follow. Explore more creators!
          </CardContent>
        </Card>
      ) : (
        <ScrollArea className="h-[calc(100vh-12rem)]">
          {posts.map((post, idx) => (
            <div
              key={post._id}
              ref={idx === posts.length - 1 ? lastPostRef : null}
            >
              <Post post={post} />
            </div>
          ))}
          {loading && (
            <div className="py-4 text-center text-muted-foreground">
              Loading more...
            </div>
          )}
          {!hasMore && posts.length > 0 && (
            <div className="py-4 text-center text-sm text-muted-foreground">
              You&apos;ve seen everything
            </div>
          )}
        </ScrollArea>
      )}
    </div>
  )
}
