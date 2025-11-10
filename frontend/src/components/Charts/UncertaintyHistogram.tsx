import { Box } from "@chakra-ui/react"
import {
  Bar,
  BarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"

interface UncertaintyHistogramProps {
  data: { bucket: string; count: number }[]
  color?: string
  height?: number
}

export function UncertaintyHistogram({
  data,
  color = "red",
  height = 220,
}: UncertaintyHistogramProps) {
  return (
    <Box w="full" h={height}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <XAxis dataKey="bucket" tick={{ fontSize: 11 }} />
          <YAxis tick={{ fontSize: 11 }} />
          <Tooltip />
          <Bar
            dataKey="count"
            fill={`var(--chakra-colors-${color}-500)`}
            radius={3}
          />
        </BarChart>
      </ResponsiveContainer>
    </Box>
  )
}

export default UncertaintyHistogram
