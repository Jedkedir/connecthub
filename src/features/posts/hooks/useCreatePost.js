import { useMemo } from "react"

import { postService } from "@/features/posts/services/post.service"
import { useAsyncAction } from "@/shared/hooks"

export function useCreatePost() {
  const createPostAction = useAsyncAction(postService.createPost)

  return useMemo(
    () => ({
      createPost: createPostAction.execute,
      createPostState: createPostAction,
      data: createPostAction.data,
      error: createPostAction.error,
      isLoading: createPostAction.isLoading,
      reset: createPostAction.reset,
    }),
    [createPostAction]
  )
}
