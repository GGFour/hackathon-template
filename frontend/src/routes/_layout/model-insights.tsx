import { Box, Button, Flex, Heading } from "@chakra-ui/react"
import { createFileRoute } from "@tanstack/react-router"
import { useState } from "react"
import { AIInsightBox } from "@/components/AI/AIInsightBox"
import { AskModelDrawer } from "@/components/AI/AskModelDrawer"
import { FeatureImportanceChart } from "@/components/Charts/FeatureImportanceChart"
import { UncertaintyHistogram } from "@/components/Charts/UncertaintyHistogram"
import PageContainer from "@/components/Layout/PageContainer"

export const Route = createFileRoute("/_layout/model-insights" as any)({
  component: ModelInsights,
})

// Mock data
const featureImportance = [
  { feature: "accuracy", importance: 0.32 },
  { feature: "recency", importance: 0.21 },
  { feature: "bias", importance: 0.15 },
  { feature: "volume", importance: 0.12 },
  { feature: "consistency", importance: 0.2 },
]

const histogram = [
  { bucket: "0-0.2", count: 5 },
  { bucket: "0.2-0.4", count: 14 },
  { bucket: "0.4-0.6", count: 22 },
  { bucket: "0.6-0.8", count: 9 },
  { bucket: "0.8-1.0", count: 3 },
]

const aiInsight = `Model reliability stable. Feature weights indicate rising importance for consistency; monitor drift.
Uncertainty distribution skewed towards middle buckets—opportunity for calibration.`

function ModelInsights() {
  const [open, setOpen] = useState(false)
  return (
    <PageContainer>
      <Flex justify="space-between" align="center" mb={6}>
        <Heading fontSize="2xl">Model Insights</Heading>
        <Button
          variant="outline"
          onClick={() => setOpen(true)}
          style={{ fontSize: "12px" }}
        >
          Ask Model
        </Button>
      </Flex>
      <Flex wrap="wrap" gap={10} mb={10}>
        <Box flex="1 1 380px" display="flex" flexDirection="column" gap={4}>
          <Heading fontSize="md">Feature Importance</Heading>
          <FeatureImportanceChart data={featureImportance} />
        </Box>
        <Box flex="1 1 380px" display="flex" flexDirection="column" gap={4}>
          <Heading fontSize="md">Uncertainty Histogram</Heading>
          <UncertaintyHistogram data={histogram} />
        </Box>
      </Flex>
      <Box display="flex" flexDirection="column" gap={4} mb={8}>
        <Heading fontSize="md">AI Insight</Heading>
        <AIInsightBox title="Model Overview" insight={aiInsight} />
      </Box>
      {open && (
        <Box
          position="fixed"
          top={0}
          right={0}
          w="320px"
          h="100vh"
          bg="white"
          _dark={{ bg: "gray.800" }}
          p={4}
          shadow="lg"
          display="flex"
          flexDirection="column"
          gap={4}
        >
          <Button
            variant="ghost"
            style={{ alignSelf: "flex-end" }}
            onClick={() => setOpen(false)}
          >
            Close
          </Button>
          <AskModelDrawer isOpen={true} onClose={() => setOpen(false)} />
        </Box>
      )}
    </PageContainer>
  )
}

export default ModelInsights
