import { useState, useEffect, useCallback, useRef, useMemo } from "react"
import { feedService } from "@/features/feed/services/feed.service"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { debounce } from "@/lib/utils"
// import PostCard from "./PostCard";
import Post from "../../posts/components/Post"
import { Link, useSearchParams } from "react-router-dom"
// Function
const searchType = (searchQuery) => {
  if (searchQuery.startsWith("@")) {
    return { user: searchQuery.slice(1) }
  } else if (searchQuery.startsWith("#")) {
    return { topic: searchQuery.slice(1) }
  } else {
    return { content: searchQuery }
  }
}

// Return true when the query should trigger a server request.
const isValidSearch = (q) => {
  const trimmed = (q || "").trim()
  if (!trimmed) return false
  if (
    (trimmed.startsWith("@") || trimmed.startsWith("#")) &&
    trimmed.length === 1
  )
    return false
  return true
}

const getInitials = (fullname) => {
  return fullname?.slice(0, 2).toUpperCase() || "U"
}

function UserResultCard({ user }) {
  if (!user?._id) return null

  return (
    <Link to={`/profile/${user._id}`} className="block">
      <Card className="mb-4 transition-shadow hover:shadow-md">
        <CardContent className="flex items-center gap-3 p-4">
          <Avatar className="h-12 w-12">
            <AvatarImage
              src={
                user.profilePic ||
                `https://api.dicebear.com/9.x/adventurer-neutral/svg?seed=${user.fullname}`
              }
            />
            <AvatarFallback>{getInitials(user.fullname)}</AvatarFallback>
          </Avatar>
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold">
              {user.fullname || "User"}
            </p>
            {user.username && (
              <p className="truncate text-xs text-muted-foreground">
                @{user.username}
              </p>
            )}
            {user.bio && (
              <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
                {user.bio}
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}

export default function ExploreView() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [posts, setPosts] = useState([])
  const [cursor, setCursor] = useState(null)
  const [hasMore, setHasMore] = useState(true)
  const [loading, setLoading] = useState(false)
  const [initialLoading, setInitialLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState(
    searchParams.get("search") || ""
  )
  const [isSearching, setIsSearching] = useState(false)
  const [searchedUser, setSearchedUser] = useState(null)
  const observerRef = useRef()
  const loadingRef = useRef(false)

  const fetchPosts = useCallback(async (reset, query, cursorParam) => {
    if (loadingRef.current) return
    loadingRef.current = true
    setLoading(true)
    try {
      let data
      const trimmed = (query || "").trim()
      if (isValidSearch(trimmed)) {
        const params = { ...searchType(trimmed), cursor: cursorParam }
        // avoid sending empty user/topic values (e.g. "@" or "#")
        const value = params.user ?? params.topic ?? params.content
        if (!value) {
          data = await feedService.getGlobalFeed({ cursor: cursorParam })
        } else {
          data = await feedService.getExploreFeed(params)
        }
      } else {
        data = await feedService.getGlobalFeed({ cursor: cursorParam })
      }
      const newPosts = data.data || []
      setPosts((prev) => (reset ? newPosts : [...prev, ...newPosts]))
      if (reset) {
        setSearchedUser(data.user || null)
      }
      setHasMore(data.pageInfo?.hasMore ?? false)
      setCursor(data.pageInfo?.nextCursor ?? null)
    } catch (err) {
      console.error("Failed to load explore feed", err)
      if (reset) {
        setSearchedUser(null)
      }
    } finally {
      loadingRef.current = false
      setLoading(false)
      if (reset) setInitialLoading(false)
      setIsSearching(false)
    }
  }, [])

  const debouncedSearch = useMemo(
    () =>
      debounce((query) => {
        setIsSearching(true)
        setPosts([])
        setSearchedUser(null)
        setCursor(null)
        setHasMore(true)
        if (query.trim()) {
          setSearchParams({ search: query })
        } else {
          setSearchParams({})
        }
      }, 500),
    [setSearchParams]
  )

  useEffect(() => {
    const nextSearchQuery = searchParams.get("search") || ""
    const timeoutId = window.setTimeout(() => {
      setSearchQuery(nextSearchQuery)
      fetchPosts(true, nextSearchQuery, null)
    }, 0)

    return () => window.clearTimeout(timeoutId)
  }, [fetchPosts, searchParams])

  const loadMore = useCallback(() => {
    if (!hasMore || loadingRef.current || (searchQuery.trim() && isSearching))
      return
    fetchPosts(false, searchQuery, cursor)
  }, [hasMore, searchQuery, cursor, fetchPosts, isSearching])

  const lastPostRef = useCallback(
    (node) => {
      if (loadingRef.current) return
      if (observerRef.current) observerRef.current.disconnect()
      observerRef.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) loadMore()
      })
      if (node) observerRef.current.observe(node)
    },
    [hasMore, loadMore]
  )

  const handleSearchChange = (e) => {
    const value = e.target.value
    setSearchQuery(value)
    debouncedSearch(value)
  }
  return (
    <div className="mx-auto max-w-4xl">
      <div className="sticky top-0 z-10 bg-background/80 pb-4 backdrop-blur-sm">
        <Input
          type="text"
          placeholder="Search posts, users, or topics..."
          value={searchQuery}
          onChange={handleSearchChange}
          className="rounded-full"
        />
      </div>
      {initialLoading ? (
        <div className="py-10 text-center text-muted-foreground">
          Loading explore feed...
        </div>
      ) : (
        <>
          <UserResultCard user={searchedUser} />
          {posts.length === 0 ? (
            <Card>
              <CardContent className="py-10 text-center text-muted-foreground">
                {searchQuery.trim()
                  ? searchedUser
                    ? `No posts found for "${searchQuery}"`
                    : `No results found for "${searchQuery}"`
                  : "No posts available yet."}
              </CardContent>
            </Card>
          ) : (
            <ScrollArea className="h-[calc(100vh-10rem)]">
              {posts.map((post, idx) => (
                <div
                  key={post._id}
                  ref={idx === posts.length - 1 ? lastPostRef : null}
                >
                  {/* <PostCard post={post} /> */}
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
                  End of the feed
                </div>
              )}
            </ScrollArea>
          )}
        </>
      )}
    </div>
  )
}
