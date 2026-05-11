import { useMemo } from "react"

import { feedService } from "@/features/feed/services/feed.service"
import { useAsyncAction } from "@/shared/hooks"

export function useFeed() {
  const exploreFeedAction = useAsyncAction(feedService.getExploreFeed)
  const globalFeedAction = useAsyncAction(feedService.getGlobalFeed)
  const personalizedFeedAction = useAsyncAction(feedService.getPersonalizedFeed)

  return useMemo(
    () => ({
      getExploreFeed: exploreFeedAction.execute,
      getExploreFeedState: exploreFeedAction,
      getGlobalFeed: globalFeedAction.execute,
      getGlobalFeedState: globalFeedAction,
      getPersonalizedFeed: personalizedFeedAction.execute,
      getPersonalizedFeedState: personalizedFeedAction,
    }),
    [exploreFeedAction, globalFeedAction, personalizedFeedAction]
  )
}
