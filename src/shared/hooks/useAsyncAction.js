import { useCallback, useState } from "react"

export function useAsyncAction(action) {
  const [data, setData] = useState(null)
  const [error, setError] = useState(null)
  const [isLoading, setIsLoading] = useState(false)

  const execute = useCallback(
    async (...args) => {
      setIsLoading(true)
      setError(null)

      try {
        const result = await action(...args)
        setData(result)
        return result
      } catch (nextError) {
        setError(nextError)
        throw nextError
      } finally {
        setIsLoading(false)
      }
    },
    [action]
  )

  const reset = useCallback(() => {
    setData(null)
    setError(null)
    setIsLoading(false)
  }, [])

  return {
    data,
    error,
    execute,
    isLoading,
    reset,
  }
}
