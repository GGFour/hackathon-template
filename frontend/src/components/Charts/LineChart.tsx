import { Box } from "@chakra-ui/react"
import {
  CartesianGrid,
  Line,
  ResponsiveContainer,
  LineChart as RLineChart,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"

interface LineChartProps {
  data: { name: string; value: number }[]
  color?: string
  height?: number
}

export function LineChart({
  data,
  color = "teal",
  height = 240,
}: LineChartProps) {
  return (
    <Box w="full" h={height}>
      <ResponsiveContainer width="100%" height="100%">
        <RLineChart
          data={data}
          margin={{ top: 8, right: 16, left: 0, bottom: 8 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" fontSize={12} />
          <YAxis fontSize={12} />
          <Tooltip />
          <Line
            type="monotone"
            dataKey="value"
            stroke={`var(--chakra-colors-${color}-500)`}
            strokeWidth={2}
            dot={false}
          />
        </RLineChart>
      </ResponsiveContainer>
    </Box>
  )
}

export default LineChart
