import { Box } from "@chakra-ui/react"
import {
  Bar,
  CartesianGrid,
  BarChart as RBarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"

interface BarChartProps {
  data: { name: string; value: number }[]
  color?: string
  height?: number
}

export function BarChart({
  data,
  color = "purple",
  height = 240,
}: BarChartProps) {
  return (
    <Box w="full" h={height}>
      <ResponsiveContainer width="100%" height="100%">
        <RBarChart
          data={data}
          margin={{ top: 8, right: 16, left: 0, bottom: 8 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" fontSize={12} />
          <YAxis fontSize={12} />
          <Tooltip />
          <Bar
            dataKey="value"
            fill={`var(--chakra-colors-${color}-500)`}
            radius={4}
          />
        </RBarChart>
      </ResponsiveContainer>
    </Box>
  )
}

export default BarChart
