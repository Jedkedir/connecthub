import { useState, useEffect, useCallback, useRef, useMemo } from "react";
import { feedService } from "@/features/feed/services/feed.service";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { debounce } from "@/lib/utils";
import PostCard from "./PostCard";

export default function ExploreView() {
  const [posts, setPosts] = useState([]);
  const [cursor, setCursor] = useState(null);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const observerRef = useRef();
  const loadingRef = useRef(false); // to avoid stale closure in fetchPosts

  const fetchPosts = useCallback(async (reset, query, cursorParam) => {
    if (loadingRef.current) return;
    loadingRef.current = true;
    setLoading(true);
    try {
      let data;
      if (query.trim()) {
        data = await feedService.getExploreFeed({ q: query, cursor: cursorParam });
      } else {
        data = await feedService.getGlobalFeed({ cursor: cursorParam });
      }
      const newPosts = data.data || [];
      setPosts((prev) => (reset ? newPosts : [...prev, ...newPosts]));
      setHasMore(data.pageInfo?.hasMore ?? false);
      setCursor(data.pageInfo?.nextCursor ?? null);
    } catch (err) {
      console.error("Failed to load explore feed", err);
    } finally {
      loadingRef.current = false;
      setLoading(false);
      if (reset) setInitialLoading(false);
      setIsSearching(false);
    }
  }, []); 

  const debouncedSearch = useMemo(
    () =>
      debounce((query) => {
        setIsSearching(true);
        setPosts([]);
        setCursor(null);
        setHasMore(true);
        fetchPosts(true, query, null);
      }, 500),
    [fetchPosts] 
  );

  useEffect(() => {
    fetchPosts(true, "", null);
  }, [fetchPosts]); 

  const loadMore = useCallback(() => {
    if (!hasMore || loadingRef.current || (searchQuery.trim() && isSearching)) return;
    fetchPosts(false, searchQuery, cursor);
  }, [hasMore, searchQuery, cursor, fetchPosts, isSearching]);

  const lastPostRef = useCallback(
    (node) => {
      if (loadingRef.current) return;
      if (observerRef.current) observerRef.current.disconnect();
      observerRef.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) loadMore();
      });
      if (node) observerRef.current.observe(node);
    },
    [hasMore, loadMore]
  );

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchQuery(value);
    debouncedSearch(value);
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="sticky top-0 z-10 bg-background/80 backdrop-blur-sm pb-4">
        <Input
          type="text"
          placeholder="Search posts, users, or topics..."
          value={searchQuery}
          onChange={handleSearchChange}
          className="rounded-full"
        />
      </div>
      {initialLoading ? (
        <div className="text-center py-10 text-muted-foreground">Loading explore feed...</div>
      ) : posts.length === 0 ? (
        <Card>
          <CardContent className="py-10 text-center text-muted-foreground">
            {searchQuery.trim()
              ? `No results found for "${searchQuery}"`
              : "No posts available yet."}
          </CardContent>
        </Card>
      ) : (
        <ScrollArea className="h-[calc(100vh-10rem)]">
          {posts.map((post, idx) => (
            <div key={post._id} ref={idx === posts.length - 1 ? lastPostRef : null}>
              <PostCard post={post} />
            </div>
          ))}
          {loading && <div className="text-center py-4 text-muted-foreground">Loading more...</div>}
          {!hasMore && posts.length > 0 && (
            <div className="text-center py-4 text-muted-foreground text-sm">
              End of the feed 
            </div>
          )}
        </ScrollArea>
      )}
    </div>
  );
}