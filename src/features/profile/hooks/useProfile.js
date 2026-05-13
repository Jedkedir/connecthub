import { useCallback, useMemo } from "react"

import { profileService } from "@/features/profile/services/profile.service"
import { useAsyncAction } from "@/shared/hooks"
import { useAuthStore } from "@/features/auth"

function extractUserFromResponse(response) {
  if (!response) {
    return null
  }

  if (response.user) {
    return response.user
  }

  if (response.data?.user) {
    return response.data.user
  }

  if (response.data?._id || response.data?.id) {
    return response.data
  }

  if (response._id || response.id) {
    return response
  }

  return null
}

function hasUserChanged(previousUser, nextUser) {
  if (!previousUser && !nextUser) {
    return false
  }

  if (!previousUser || !nextUser) {
    return true
  }

  return JSON.stringify(previousUser) !== JSON.stringify(nextUser)
}

export function useProfile() {
  const getCurrentUserAction = useAsyncAction(profileService.getCurrentUser)
  const getUserByIdAction = useAsyncAction(profileService.getUserById)
  const updateProfileAction = useAsyncAction(profileService.updateProfile)
  const getUserPostsAction = useAsyncAction(profileService.getUserPosts)
  const updateUser = useAuthStore((state) => state.updateUser)

  const syncAuthenticatedUser = useCallback(
    (response, targetUserId) => {
      const user = extractUserFromResponse(response)
      if (!user) {
        return response
      }

      const authenticatedUser = useAuthStore.getState().user
      const authenticatedUserId = authenticatedUser?._id || authenticatedUser?.id
      const responseUserId = user?._id || user?.id
      const userChanged = hasUserChanged(authenticatedUser, user)

      if (!authenticatedUserId || !responseUserId) {
        if (userChanged) {
          updateUser(user)
        }

        return response
      }

      if (!userChanged) {
        return response
      }

      if (
        !targetUserId ||
        targetUserId === authenticatedUserId ||
        responseUserId === authenticatedUserId
      ) {
        updateUser(user)
      }

      return response
    },
    [updateUser]
  )

  const getCurrentUser = useCallback(async () => {
    const response = await getCurrentUserAction.execute()
    return syncAuthenticatedUser(response)
  }, [getCurrentUserAction, syncAuthenticatedUser])

  const getUserById = useCallback(
    async (id) => {
      const response = await getUserByIdAction.execute(id)
      return syncAuthenticatedUser(response, id)
    },
    [getUserByIdAction, syncAuthenticatedUser]
  )

  const updateProfile = useCallback(
    async (payload) => {
      const response = await updateProfileAction.execute(payload)
      return syncAuthenticatedUser(response)
    },
    [updateProfileAction, syncAuthenticatedUser]
  )

  const getUserPosts = useCallback(
    async (userId, params) => {
      return getUserPostsAction.execute(userId, params)
    },
    [getUserPostsAction]
  )

  return useMemo(
    () => ({
      getCurrentUser,
      getCurrentUserState: getCurrentUserAction,
      getUserById,
      getUserByIdState: getUserByIdAction,
      updateProfile,
      updateProfileState: updateProfileAction,
      getUserPosts,
      getUserPostsState: getUserPostsAction,
    }),
    [
      getCurrentUser,
      getCurrentUserAction,
      getUserById,
      getUserByIdAction,
      updateProfile,
      updateProfileAction,
      getUserPosts,
      getUserPostsAction,
    ]
  )
}
