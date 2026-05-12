import { useMemo } from "react"

import { postService } from "@/features/posts/services/post.service"
import { useAsyncAction } from "@/shared/hooks"

export function usePosts() {
  const addCommentAction = useAsyncAction(postService.addComment)
  const addReplyAction = useAsyncAction(postService.addReply)
  const bookmarkPostAction = useAsyncAction(postService.bookmarkPost)
  const deleteCommentAction = useAsyncAction(postService.deleteComment)
  const deletePostAction = useAsyncAction(postService.deletePost)
  const getBookmarkedPostsAction = useAsyncAction(
    postService.getBookmarkedPosts
  )
  const getLikedPostsAction = useAsyncAction(postService.getLikedPosts)
  const getCommentsAction = useAsyncAction(postService.getComments)
  const getCommentRepliesAction = useAsyncAction(postService.getCommentReplies)
  const getPostByIdAction = useAsyncAction(postService.getPostById)
  const getUserPostsAction = useAsyncAction(postService.getUserPosts)
  const likeCommentAction = useAsyncAction(postService.likeComment)
  const likePostAction = useAsyncAction(postService.likePost)
  const removeBookmarkAction = useAsyncAction(postService.removeBookmark)
  const unlikeCommentAction = useAsyncAction(postService.unlikeComment)
  const unlikePostAction = useAsyncAction(postService.unlikePost)
  const updateCommentAction = useAsyncAction(postService.updateComment)

  return useMemo(
    () => ({
      addComment: addCommentAction.execute,
      addCommentState: addCommentAction,
      addReply: addReplyAction.execute,
      addReplyState: addReplyAction,
      bookmarkPost: bookmarkPostAction.execute,
      bookmarkPostState: bookmarkPostAction,
      deleteComment: deleteCommentAction.execute,
      deleteCommentState: deleteCommentAction,
      deletePost: deletePostAction.execute,
      deletePostState: deletePostAction,
      getBookmarkedPosts: getBookmarkedPostsAction.execute,
      getLikedPosts: getLikedPostsAction.execute,
      getBookmarkedPostsState: getBookmarkedPostsAction,
      getLikedPostsState: getLikedPostsAction,
      getComments: getCommentsAction.execute,
      getCommentsState: getCommentsAction,
      getCommentReplies: getCommentRepliesAction.execute,
      getCommentRepliesState: getCommentRepliesAction,
      getPostById: getPostByIdAction.execute,
      getPostByIdState: getPostByIdAction,
      getUserPosts: getUserPostsAction.execute,
      getUserPostsState: getUserPostsAction,
      likeComment: likeCommentAction.execute,
      likeCommentState: likeCommentAction,
      likePost: likePostAction.execute,
      likePostState: likePostAction,
      removeBookmark: removeBookmarkAction.execute,
      removeBookmarkState: removeBookmarkAction,
      unlikeComment: unlikeCommentAction.execute,
      unlikeCommentState: unlikeCommentAction,
      unlikePost: unlikePostAction.execute,
      unlikePostState: unlikePostAction,
      updateComment: updateCommentAction.execute,
      updateCommentState: updateCommentAction,
    }),
    [
      addCommentAction,
      addReplyAction,
      bookmarkPostAction,
      deleteCommentAction,
      deletePostAction,
      getBookmarkedPostsAction,
      getLikedPostsAction,
      getCommentsAction,
      getCommentRepliesAction,
      getPostByIdAction,
      getUserPostsAction,
      likeCommentAction,
      likePostAction,
      removeBookmarkAction,
      unlikeCommentAction,
      unlikePostAction,
      updateCommentAction,
    ]
  )
}
