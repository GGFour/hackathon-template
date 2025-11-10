import { Box, Flex, Heading, Text } from "@chakra-ui/react"
import { useColorByTrust } from "@/hooks/useColorByTrust"

interface TrustScoreCardProps {
  score: number | null
  label?: string
  explanation?: string
}

export function TrustScoreCard({
  score,
  label = "Trust Score",
  explanation,
}: TrustScoreCardProps) {
  const color = useColorByTrust(score)
  const bg = "white"
  const pct = score === null ? 0 : Math.max(0, Math.min(100, score))
  return (
    <Box p={4} rounded="md" shadow="sm" borderWidth="1px" bg={bg}>
      <Flex justify="space-between" mb={2}>
        <Heading fontSize="lg">{label}</Heading>
        <Text fontSize="sm" color={`${color}.500`} fontWeight="semibold">
          {score === null ? "Unknown" : `${pct.toFixed(0)}%`}
        </Text>
      </Flex>
      <Box h="6px" w="100%" bg="gray.200" rounded="full" mb={2}>
        <Box h="100%" w={`${pct}%`} bg={`${color}.500`} rounded="full" />
      </Box>
      {explanation && (
        <Text fontSize="xs" color="gray.500">
          {explanation}
        </Text>
      )}
    </Box>
  )
}

export default TrustScoreCard
