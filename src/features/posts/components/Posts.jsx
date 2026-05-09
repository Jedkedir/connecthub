import Post from "./Post"
const data = [
  {
    _id: "69fe0e8b6354d498cd31777b",
    authorId: {
      _id: "69fdfc586354d498cd31776b",
      username: "app",
      profilePic: "",
    },
    content: "This is some photos of the Arena.",
    mediaUrls: [
      "https://images.unsplash.com/photo-1504450758481-7338eba7524a?q=80&w=2069&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    ],
    likesCount: 0,
    commentsCount: 0,
    bookmarksCount: 0,
    viewCount: 0,
    createdAt: "2026-05-08T16:25:47.186Z",
    updatedAt: "2026-05-08T16:25:47.186Z",
    __v: 0,
  },
  {
    _id: "69fe0e8b6354d498cd31777b",
    authorId: {
      _id: "69fdfc586354d498cd31776b",
      username: "app",
      profilePic: "",
    },
    content: "This is some photos of the Arena.",
    mediaUrls: [
      "https://images.unsplash.com/photo-1504450758481-7338eba7524a?q=80&w=2069&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      "https://images.unsplash.com/photo-1504450758481-7338eba7524a?q=80&w=2069&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      "https://images.unsplash.com/photo-1504450758481-7338eba7524a?q=80&w=2069&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      "https://images.unsplash.com/photo-1504450758481-7338eba7524a?q=80&w=2069&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      "https://images.unsplash.com/photo-1504450758481-7338eba7524a?q=80&w=2069&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    ],
    likesCount: 0,
    commentsCount: 0,
    bookmarksCount: 0,
    viewCount: 0,
    createdAt: "2026-05-08T16:25:47.186Z",
    updatedAt: "2026-05-08T16:25:47.186Z",
    __v: 0,
  },
  {
    _id: "69fe0e5b6354d498cd317778",
    authorId: {
      _id: "69fdfc586354d498cd31776b",
      username: "app",
      profilePic: "",
    },
    content: "This is some photos of Lebron James.",

    likesCount: 0,
    commentsCount: 0,
    bookmarksCount: 0,
    viewCount: 0,
    createdAt: "2026-05-08T16:24:59.993Z",
    updatedAt: "2026-05-08T16:24:59.993Z",
    __v: 0,
  },
  {
    _id: "69fe0e5b6354d498cd317778",
    authorId: {
      _id: "69fdfc586354d498cd31776b",
      username: "app",
      profilePic: "",
    },
    content: "This is some photos of Lebron James.",

    likesCount: 0,
    commentsCount: 0,
    bookmarksCount: 0,
    viewCount: 0,
    createdAt: "2026-05-08T16:24:59.993Z",
    updatedAt: "2026-05-08T16:24:59.993Z",
    __v: 0,
  },
]

export default function Posts({
  data: postsData,
  onLike,
  onComment,
  onBookmark,
  onShare,
  onReport,
  layout = "grid",
}) {
  const posts = postsData || data

  if (layout === "list") {
    return (
      <div className="mx-auto max-w-2xl space-y-4">
        {posts.map((post) => (
          <Post
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
    <div className="mx-auto flex max-w-4xl flex-col gap-4">
      {posts.map((post) => (
        <Post
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
