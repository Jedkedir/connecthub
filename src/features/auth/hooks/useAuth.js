import { useMemo } from "react"

import { authService } from "@/features/auth/services/auth.service"
import { useAsyncAction } from "@/shared/hooks"
import { useAuthStore } from "../auth.store"

export function useAuth() {
  const changePasswordAction = useAsyncAction(authService.changePassword)
  const loginAction = useAsyncAction(authService.login)
  const refreshAction = useAsyncAction(authService.refresh)
  const registerAction = useAsyncAction(authService.register)

  const user = useAuthStore((state) => state.user)
  const accessToken = useAuthStore((state) => state.accessToken)
  const refreshToken = useAuthStore((state) => state.refreshToken)
  const logout = useAuthStore((state) => state.logout)
  const updateUser = useAuthStore((state) => state.updateUser)

  return useMemo(
    () => ({
      // Auth state
      user,
      accessToken,
      refreshToken,
      // Auth actions
      changePassword: changePasswordAction.execute,
      changePasswordState: changePasswordAction,
      login: loginAction.execute,
      loginState: loginAction,
      refresh: refreshAction.execute,
      refreshState: refreshAction,
      register: registerAction.execute,
      registerState: registerAction,
      logout,
      updateUser,
    }),
    [
      changePasswordAction,
      loginAction,
      refreshAction,
      registerAction,
      user,
      accessToken,
      refreshToken,
      logout,
      updateUser,
    ]
  )
}
