import { Box, Flex, Heading } from "@chakra-ui/react"
import { createFileRoute } from "@tanstack/react-router"
import { AIInsightBox } from "@/components/AI/AIInsightBox"
import AlertCard from "@/components/Cards/AlertCard"
import StatCard from "@/components/Cards/StatCard"
import TrustScoreCard from "@/components/Cards/TrustScoreCard"
import { BarChart } from "@/components/Charts/BarChart"
import { LineChart } from "@/components/Charts/LineChart"
import PageContainer from "@/components/Layout/PageContainer"
import { DataTable } from "@/components/Tables/DataTable"

export const Route = createFileRoute("/_layout/dashboard" as any)({
  component: Dashboard,
})

// Mock data local to page
const summaryStats = [
  { label: "Sources", value: 128, subLabel: "+4 today" },
  { label: "Alerts", value: 7, subLabel: "2 critical" },
  { label: "Avg Trust", value: "62%", subLabel: "past 7d" },
  { label: "AI Insights", value: 23, subLabel: "this week" },
]

const topSources = [
  { name: "SourceA", trust: 88, type: "news" },
  { name: "SourceB", trust: 75, type: "reports" },
  { name: "SourceC", trust: 66, type: "social" },
]

const recentInsights = [
  {
    title: "Emerging pattern",
    insight: "Cluster of low-trust signals around topic X.",
  },
  { title: "Stability", insight: "Top 5 sources maintained high trust >80%." },
]

const lineData = Array.from({ length: 12 }).map((_, i) => ({
  name: `T${i}`,
  value: 40 + Math.random() * 40,
}))
const barData = Array.from({ length: 6 }).map((_, i) => ({
  name: `S${i}`,
  value: 50 + Math.random() * 30,
}))

function Dashboard() {
  return (
    <PageContainer>
      <Flex justify="space-between" align="center" mb={6}>
        <Heading fontSize="2xl">Dashboard</Heading>
      </Flex>
      <Flex wrap="wrap" gap={4} mb={6}>
        {summaryStats.map((s) => (
          <Box key={s.label} flexBasis="220px" flexGrow={1}>
            <StatCard {...s} />
          </Box>
        ))}
      </Flex>
      <Flex wrap="wrap" gap={6} mb={8}>
        <Box flex="1 1 340px">
          <TrustScoreCard
            score={62}
            explanation="Average trust computed from last 7 days."
          />
        </Box>
        <Box flex="1 1 340px">
          <AlertCard
            status="warning"
            title="Model drift"
            description="Retrain suggested within 3 days."
          />
        </Box>
      </Flex>
      <Flex wrap="wrap" gap={6} mb={10}>
        <Box flex="1 1 380px">
          <Heading fontSize="md" mb={3}>
            Trust Trend
          </Heading>
          <LineChart data={lineData} />
        </Box>
        <Box flex="1 1 380px">
          <Heading fontSize="md" mb={3}>
            Top Source Volume
          </Heading>
          <BarChart data={barData} />
        </Box>
      </Flex>
      <Box h="1px" bg="gray.200" _dark={{ bg: "gray.700" }} mb={6} />
      <Flex wrap="wrap" gap={10}>
        <Box flex="1 1 380px" display="flex" flexDirection="column" gap={4}>
          <Heading fontSize="md">Top Sources</Heading>
          <DataTable
            columns={[
              { header: "Name", accessor: "name" },
              { header: "Trust", accessor: (r) => `${r.trust}%` },
              { header: "Type", accessor: "type" },
            ]}
            data={topSources}
          />
        </Box>
        <Box flex="1 1 380px" display="flex" flexDirection="column" gap={4}>
          <Heading fontSize="md">Recent AI Insights</Heading>
          {recentInsights.map((i) => (
            <AIInsightBox key={i.title} {...i} />
          ))}
        </Box>
      </Flex>
    </PageContainer>
  )
}

export default Dashboard
