import { useState, useEffect, useCallback, useRef } from "react"
import api from "@/services/apiClient"
import { endpoints } from "@/services/endpoints"
import { feedService } from "@/features/feed/services/feed.service"
import { Card, CardContent } from "@/components/ui/card"
import { toast } from "sonner"
import { Textarea } from "@/components/ui/textarea"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Button } from "@/components/ui/button"
import PostCard from "./PostCard"

const CreatePostForm = ({ onSuccess }) => {
  const [content, setContent] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!content.trim()) return
    setIsSubmitting(true)
    try {
      const response = await api.post(endpoints.posts.create, { content })
      setContent("")
      onSuccess(response.data)
      toast({ title: "Posted!", description: "Your post is live." })
    } catch (err) {
      console.error(err)
      toast({
        title: "Error",
        description: "Could not create post.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card className="mb-6">
      <CardContent className="p-6">
        <form onSubmit={handleSubmit} className="space-y-3">
          <Textarea
            placeholder="Share your thoughts, art, or work..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={3}
          />
          <div className="flex justify-end">
            <Button type="submit" disabled={!content.trim() || isSubmitting}>
              {isSubmitting ? "Posting..." : "Post"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}

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

  const handlePostCreated = (newPost) => {
    setPosts((prev) => [newPost, ...prev])
  }
  return (
    <div className="mx-auto max-w-2xl">
      <CreatePostForm onSuccess={handlePostCreated} />
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
              <PostCard post={post} />
            </div>
          ))}
          {loading && (
            <div className="py-4 text-center text-muted-foreground">
              Loading more...
            </div>
          )}
          {!hasMore && posts.length > 0 && (
            <div className="py-4 text-center text-sm text-muted-foreground">
              You&apos;ve seen everything 🎉
            </div>
          )}
        </ScrollArea>
      )}
    </div>
  )
}
