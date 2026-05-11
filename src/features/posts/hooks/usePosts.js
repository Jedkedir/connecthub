import { useMemo } from "react"

import { postService } from "@/features/posts/services/post.service"
import { useAsyncAction } from "@/shared/hooks"

export function usePosts() {
  const addCommentAction = useAsyncAction(postService.addComment)
  const bookmarkPostAction = useAsyncAction(postService.bookmarkPost)
  const deletePostAction = useAsyncAction(postService.deletePost)
  const getBookmarkedPostsAction = useAsyncAction(
    postService.getBookmarkedPosts
  )
  const getLikedPostsAction = useAsyncAction(postService.getLikedPosts)
  const getCommentsAction = useAsyncAction(postService.getComments)
  const getPostByIdAction = useAsyncAction(postService.getPostById)
  const getUserPostsAction = useAsyncAction(postService.getUserPosts)
  const likePostAction = useAsyncAction(postService.likePost)
  const removeBookmarkAction = useAsyncAction(postService.removeBookmark)
  const unlikePostAction = useAsyncAction(postService.unlikePost)

  return useMemo(
    () => ({
      addComment: addCommentAction.execute,
      addCommentState: addCommentAction,
      bookmarkPost: bookmarkPostAction.execute,
      bookmarkPostState: bookmarkPostAction,
      deletePost: deletePostAction.execute,
      deletePostState: deletePostAction,
      getBookmarkedPosts: getBookmarkedPostsAction.execute,
      getLikedPosts: getLikedPostsAction.execute,
      getBookmarkedPostsState: getBookmarkedPostsAction,
      getLikedPostsState: getLikedPostsAction,
      getComments: getCommentsAction.execute,
      getCommentsState: getCommentsAction,
      getPostById: getPostByIdAction.execute,
      getPostByIdState: getPostByIdAction,
      getUserPosts: getUserPostsAction.execute,
      getUserPostsState: getUserPostsAction,
      likePost: likePostAction.execute,
      likePostState: likePostAction,
      removeBookmark: removeBookmarkAction.execute,
      removeBookmarkState: removeBookmarkAction,
      unlikePost: unlikePostAction.execute,
      unlikePostState: unlikePostAction,
    }),
    [
      addCommentAction,
      bookmarkPostAction,
      deletePostAction,
      getBookmarkedPostsAction,
      getLikedPostsAction,
      getCommentsAction,
      getPostByIdAction,
      getUserPostsAction,
      likePostAction,
      removeBookmarkAction,
      unlikePostAction,
    ]
  )
}
