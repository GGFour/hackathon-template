export function useColorByTrust(score: number | null): string {
  if (score === null) return "gray"
  if (score >= 70) return "green"
  if (score >= 40) return "yellow"
  if (score >= 0) return "red"
  return "gray"
}

export default useColorByTrust
