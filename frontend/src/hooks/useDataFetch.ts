import { useCallback, useEffect, useState } from "react"

interface UseDataFetchResult<T> {
  data: T | null
  error: Error | null
  loading: boolean
  refetch: () => Promise<void>
}

export function useDataFetch<T = any>(
  url: string,
  mock?: T,
): UseDataFetchResult<T> {
  const [data, setData] = useState<T | null>(mock ?? null)
  const [error, setError] = useState<Error | null>(null)
  const [loading, setLoading] = useState<boolean>(false)

  const fetchData = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      // In absence of real API, simulate latency and return mock
      if (mock) {
        await new Promise((r) => setTimeout(r, 300))
        setData(mock)
      } else {
        const res = await fetch(url)
        if (!res.ok) throw new Error(`Request failed: ${res.status}`)
        const json = (await res.json()) as T
        setData(json)
      }
    } catch (e: any) {
      setError(e)
    } finally {
      setLoading(false)
    }
  }, [url, mock])

  useEffect(() => {
    void fetchData()
  }, [fetchData])

  return { data, error, loading, refetch: fetchData }
}

export default useDataFetch
