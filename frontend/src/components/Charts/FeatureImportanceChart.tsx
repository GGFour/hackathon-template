import { Box } from "@chakra-ui/react"
import {
  Bar,
  BarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"

export interface FeatureImportanceItem {
  feature: string
  importance: number
}

interface FeatureImportanceChartProps {
  data: FeatureImportanceItem[]
  color?: string
  height?: number
}

export function FeatureImportanceChart({
  data,
  color = "cyan",
  height = 260,
}: FeatureImportanceChartProps) {
  return (
    <Box w="full" h={height}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <XAxis dataKey="feature" tick={{ fontSize: 11 }} />
          <YAxis tick={{ fontSize: 11 }} />
          <Tooltip />
          <Bar
            dataKey="importance"
            fill={`var(--chakra-colors-${color}-500)`}
            radius={4}
          />
        </BarChart>
      </ResponsiveContainer>
    </Box>
  )
}

export default FeatureImportanceChart
