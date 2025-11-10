export type TrustLevel = "high" | "medium" | "low" | "unknown"

export function trustLevel(score: number | null): TrustLevel {
  if (score === null) return "unknown"
  if (score >= 70) return "high"
  if (score >= 40) return "medium"
  if (score >= 0) return "low"
  return "unknown"
}

export function trustColor(level: TrustLevel): string {
  switch (level) {
    case "high":
      return "green"
    case "medium":
      return "yellow"
    case "low":
      return "red"
    default:
      return "gray"
  }
}

export function trustColorFromScore(score: number | null): string {
  return trustColor(trustLevel(score))
}
