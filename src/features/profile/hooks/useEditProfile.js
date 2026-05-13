import { useCallback } from "react"

import { authService } from "@/features/auth/services/auth.service"
import { profileService } from "@/features/profile/services/profile.service"
import { useAsyncAction } from "@/shared/hooks"

export function useEditProfile() {
  const updateProfileAction = useAsyncAction(profileService.updateProfile)
  const changePasswordAction = useAsyncAction(authService.changePassword)

  const handleUpdateProfile = useCallback(
    async (profileData) => {
      return updateProfileAction.execute(profileData)
    },
    [updateProfileAction]
  )

  const handleChangePassword = useCallback(
    async (passwordData) => {
      return changePasswordAction.execute(passwordData)
    },
    [changePasswordAction]
  )

  return {
    updateProfile: handleUpdateProfile,
    updateProfileState: updateProfileAction,
    changePassword: handleChangePassword,
    changePasswordState: changePasswordAction,
  }
}
