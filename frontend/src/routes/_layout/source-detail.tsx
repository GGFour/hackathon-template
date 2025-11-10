import { Box, Flex, Heading, Text } from "@chakra-ui/react"
import { createFileRoute } from "@tanstack/react-router"
import { AIInsightBox } from "@/components/AI/AIInsightBox"
import TrustScoreCard from "@/components/Cards/TrustScoreCard"
import { RadarChart } from "@/components/Charts/RadarChart"
import PageContainer from "@/components/Layout/PageContainer"
import { EvidenceTable } from "@/components/Tables/EvidenceTable"

export const Route = createFileRoute("/_layout/source-detail" as any)({
  component: SourceDetail,
})

// Mock data local
const sourceProfile = {
  id: "SRC-001",
  name: "SourceA",
  category: "news",
  trustScore: 88,
  description: "Leading publisher with consistent reliability over time.",
}

const evidenceRows = Array.from({ length: 5 }).map((_, i) => ({
  id: `EV-${i + 1}`,
  type: i % 2 === 0 ? "article" : "report",
  confidence: 60 + Math.random() * 30,
  summary: "Supporting signal referencing prior event.",
}))

const radarData = [
  { subject: "Accuracy", value: 90 },
  { subject: "Freshness", value: 72 },
  { subject: "Depth", value: 66 },
  { subject: "Bias", value: 40 },
  { subject: "Consistency", value: 83 },
]

const reasoning = `The trust score remains high due to consistent accuracy and low volatility.
Bias dimension slightly elevated; monitor shifts over political topics.`

function SourceDetail() {
  return (
    <PageContainer>
      <Flex justify="space-between" align="center" mb={6}>
        <Heading fontSize="2xl">Source Detail</Heading>
      </Flex>
      <Flex wrap="wrap" gap={6} mb={8}>
        <Box flex="1 1 260px">
          <TrustScoreCard
            score={sourceProfile.trustScore}
            explanation="Calculated from last 30 days signals."
          />
        </Box>
        <Box flex="1 1 260px" display="flex" flexDirection="column" gap={4}>
          <Text fontSize="sm" fontWeight="semibold">
            {sourceProfile.name}
          </Text>
          <Text fontSize="xs" color="gray.500">
            Category: {sourceProfile.category}
          </Text>
          <Text fontSize="xs">{sourceProfile.description}</Text>
        </Box>
        <Box flex="1 1 260px" display="flex" flexDirection="column" gap={4}>
          <Heading fontSize="sm">Profile Metrics</Heading>
          <RadarChart data={radarData} />
        </Box>
      </Flex>
      <Box h="1px" bg="gray.200" _dark={{ bg: "gray.700" }} mb={6} />
      <Flex wrap="wrap" gap={10}>
        <Box flex="1 1 380px" display="flex" flexDirection="column" gap={4}>
          <Heading fontSize="md">Evidence</Heading>
          <EvidenceTable rows={evidenceRows} />
        </Box>
        <Box flex="1 1 380px" display="flex" flexDirection="column" gap={4}>
          <Heading fontSize="md">AI Reasoning</Heading>
          <AIInsightBox title="Model Explanation" insight={reasoning} />
        </Box>
      </Flex>
    </PageContainer>
  )
}

export default SourceDetail
