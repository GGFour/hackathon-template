import { useMemo } from "react"

interface RawPoint {
  timestamp: string
  metric: number
}

interface UseChartDataResult {
  line: { name: string; value: number }[]
  bar: { name: string; value: number }[]
  radar: { subject: string; value: number }[]
}

export function useChartData(
  raw: RawPoint[],
  featureDistribution?: Record<string, number>,
): UseChartDataResult {
  return useMemo(() => {
    const line = raw.map((r) => ({
      name: r.timestamp.slice(11, 16),
      value: r.metric,
    }))
    const bar = line
    const radar = Object.entries(
      featureDistribution || { a: 30, b: 50, c: 20 },
    ).map(([k, v]) => ({ subject: k, value: v }))
    return { line, bar, radar }
  }, [raw, featureDistribution])
}

export default useChartData
