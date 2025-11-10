import { Box, Flex, Heading } from "@chakra-ui/react"
import { createFileRoute } from "@tanstack/react-router"
import { AIInsightBox } from "@/components/AI/AIInsightBox"
import { BarChart } from "@/components/Charts/BarChart"
import PageContainer from "@/components/Layout/PageContainer"
import { CompareTable } from "@/components/Tables/CompareTable"

export const Route = createFileRoute("/_layout/compare-sources" as any)({
  component: CompareSources,
})

// Mock data local
const comparisonRows = [
  { metric: "Trust", a: 88, b: 73 },
  { metric: "Volume", a: 120, b: 186 },
  { metric: "Consistency", a: 80, b: 61 },
  { metric: "Bias", a: 34, b: 45 },
]

const chartData = comparisonRows.map((r) => ({
  name: r.metric,
  value: (r.a ?? 0) - (r.b ?? 0),
}))

const aiSummary = `SourceA shows stronger consistency and trust; SourceB provides higher volume but lower reliability.
Bias differential falls within acceptable range; consider hybrid aggregation strategy.`

function CompareSources() {
  return (
    <PageContainer>
      <Flex justify="space-between" align="center" mb={6}>
        <Heading fontSize="2xl">Compare Sources</Heading>
      </Flex>
      <Flex wrap="wrap" gap={10} mb={10}>
        <Box flex="1 1 380px" display="flex" flexDirection="column" gap={4}>
          <Heading fontSize="md">Side-by-Side Metrics</Heading>
          <CompareTable
            rows={comparisonRows}
            sourceA="SourceA"
            sourceB="SourceB"
          />
        </Box>
        <Box flex="1 1 380px" display="flex" flexDirection="column" gap={4}>
          <Heading fontSize="md">Differential Chart (A - B)</Heading>
          <BarChart data={chartData} color="teal" />
        </Box>
      </Flex>
      <Box display="flex" flexDirection="column" gap={4}>
        <Heading fontSize="md">AI Summary</Heading>
        <AIInsightBox title="Comparison" insight={aiSummary} />
      </Box>
    </PageContainer>
  )
}

export default CompareSources
