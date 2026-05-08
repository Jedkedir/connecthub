import { useMemo } from "react"

import { authService } from "@/features/auth/services/auth.service"
import { useAsyncAction } from "@/shared/hooks"

export function useAuth() {
  const changePasswordAction = useAsyncAction(authService.changePassword)
  const loginAction = useAsyncAction(authService.login)
  const refreshAction = useAsyncAction(authService.refresh)
  const registerAction = useAsyncAction(authService.register)

  return useMemo(
    () => ({
      changePassword: changePasswordAction.execute,
      changePasswordState: changePasswordAction,
      login: loginAction.execute,
      loginState: loginAction,
      refresh: refreshAction.execute,
      refreshState: refreshAction,
      register: registerAction.execute,
      registerState: registerAction,
    }),
    [changePasswordAction, loginAction, refreshAction, registerAction]
  )
}
