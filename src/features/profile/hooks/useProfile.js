import { useMemo } from "react"

import { profileService } from "@/features/profile/services/profile.service"
import { useAsyncAction } from "@/shared/hooks"

export function useProfile() {
  const getCurrentUserAction = useAsyncAction(profileService.getCurrentUser)
  const getUserByIdAction = useAsyncAction(profileService.getUserById)
  const updateProfileAction = useAsyncAction(profileService.updateProfile)
  const getUserPostsAction = useAsyncAction(profileService.getUserPosts)

  return useMemo(
    () => ({
      getCurrentUser: getCurrentUserAction.execute,
      getCurrentUserState: getCurrentUserAction,
      getUserById: getUserByIdAction.execute,
      getUserByIdState: getUserByIdAction,
      updateProfile: updateProfileAction.execute,
      updateProfileState: updateProfileAction,
      getUserPosts: getUserPostsAction.execute,
      getUserPostsState: getUserPostsAction,
    }),
    [
      getCurrentUserAction,
      getUserByIdAction,
      updateProfileAction,
      getUserPostsAction,
    ]
  )
}
