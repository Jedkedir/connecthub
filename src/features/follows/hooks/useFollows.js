import { useMemo } from "react"

import { followService } from "@/features/follows/services/follow.service"
import { useAsyncAction } from "@/shared/hooks"

export function useFollows() {
  const acceptFollowRequestAction = useAsyncAction(
    followService.acceptFollowRequest
  )
  const rejectFollowRequestAction = useAsyncAction(
    followService.rejectFollowRequest
  )
  const sendFollowRequestAction = useAsyncAction(
    followService.sendFollowRequest
  )
  const unfollowUserAction = useAsyncAction(followService.unfollowUser)

  return useMemo(
    () => ({
      acceptFollowRequest: acceptFollowRequestAction.execute,
      acceptFollowRequestState: acceptFollowRequestAction,
      rejectFollowRequest: rejectFollowRequestAction.execute,
      rejectFollowRequestState: rejectFollowRequestAction,
      sendFollowRequest: sendFollowRequestAction.execute,
      sendFollowRequestState: sendFollowRequestAction,
      unfollowUser: unfollowUserAction.execute,
      unfollowUserState: unfollowUserAction,
    }),
    [
      acceptFollowRequestAction,
      rejectFollowRequestAction,
      sendFollowRequestAction,
      unfollowUserAction,
    ]
  )
}
