import { useEffect, useMemo, useState } from "react"

import { profileService } from "@/features/profile/services/profile.service"

function normalizeUsersResponse(response) {
  if (Array.isArray(response)) {
    return response
  }

  return response?.data ?? response?.users ?? []
}

export function useUserSearch(query, limit = 5, options = {}) {
  const { enabled = true, minLength = 2 } = options
  const [users, setUsers] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    const normalizedQuery = query.trim()

    if (!enabled || normalizedQuery.length < minLength) {
      const timeoutId = window.setTimeout(() => {
        setUsers([])
        setIsLoading(false)
        setError(null)
      }, 0)

      return () => window.clearTimeout(timeoutId)
    }

    const controller = new AbortController()
    const timeoutId = window.setTimeout(async () => {
      setIsLoading(true)
      setError(null)

      try {
        const response = await profileService.searchUsers(
          normalizedQuery,
          limit,
          controller.signal
        )
        setUsers(normalizeUsersResponse(response))
      } catch (nextError) {
        if (
          nextError?.name !== "CanceledError" &&
          nextError?.name !== "AbortError"
        ) {
          setError(nextError)
          setUsers([])
        }
      } finally {
        if (!controller.signal.aborted) {
          setIsLoading(false)
        }
      }
    }, 300)

    return () => {
      window.clearTimeout(timeoutId)
      controller.abort()
    }
  }, [enabled, limit, minLength, query])

  return useMemo(
    () => ({
      users,
      isLoading,
      error,
    }),
    [users, isLoading, error]
  )
}
