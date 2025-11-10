import { useState } from "react"

interface UseAIQueryResult {
  run: (prompt: string) => Promise<string>
  loading: boolean
}

export function useAIQuery(): UseAIQueryResult {
  const [loading, setLoading] = useState(false)
  async function run(prompt: string) {
    setLoading(true)
    await new Promise((r) => setTimeout(r, 400))
    setLoading(false)
    // Mock AI reasoning output
    return `AI response for: "${prompt}"\nReasoning: (mock) The system evaluated trust & relevance heuristics.`
  }
  return { run, loading }
}

export default useAIQuery
