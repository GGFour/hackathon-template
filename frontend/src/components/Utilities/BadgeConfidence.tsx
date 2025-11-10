import { Badge } from "@chakra-ui/react"
import { useColorByTrust } from "@/hooks/useColorByTrust"

interface BadgeConfidenceProps {
  score: number | null
}

export function BadgeConfidence({ score }: BadgeConfidenceProps) {
  const color = useColorByTrust(score)
  return (
    <Badge colorScheme={color} fontSize="0.65rem" px={2}>
      {score === null ? "Unknown" : `${score.toFixed(0)}%`}
    </Badge>
  )
}

export default BadgeConfidence
