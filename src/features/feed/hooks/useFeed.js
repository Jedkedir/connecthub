import { useMemo } from "react"

import { feedService } from "@/features/feed/services/feed.service"
import { useAsyncAction } from "@/shared/hooks"

export function useFeed() {
  const createPostAction = useAsyncAction(feedService.createPost)
  const exploreFeedAction = useAsyncAction(feedService.getExploreFeed)
  const globalFeedAction = useAsyncAction(feedService.getGlobalFeed)
  const personalizedFeedAction = useAsyncAction(feedService.getPersonalizedFeed)

  return useMemo(
    () => ({
      createPost: createPostAction.execute,
      createPostState: createPostAction,
      getExploreFeed: exploreFeedAction.execute,
      getExploreFeedState: exploreFeedAction,
      getGlobalFeed: globalFeedAction.execute,
      getGlobalFeedState: globalFeedAction,
      getPersonalizedFeed: personalizedFeedAction.execute,
      getPersonalizedFeedState: personalizedFeedAction,
    }),
    [
      createPostAction,
      exploreFeedAction,
      globalFeedAction,
      personalizedFeedAction,
    ]
  )
}
