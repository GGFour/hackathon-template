import { Box } from "@chakra-ui/react"
import {
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer,
  RadarChart as RRadarChart,
  Tooltip,
} from "recharts"

interface RadarChartProps {
  data: { subject: string; value: number }[]
  color?: string
  height?: number
}

export function RadarChart({
  data,
  color = "orange",
  height = 300,
}: RadarChartProps) {
  return (
    <Box w="full" h={height}>
      <ResponsiveContainer width="100%" height="100%">
        <RRadarChart data={data} outerRadius="70%">
          <PolarGrid />
          <PolarAngleAxis dataKey="subject" tick={{ fontSize: 11 }} />
          <PolarRadiusAxis angle={30} tick={{ fontSize: 10 }} />
          <Tooltip />
          <Radar
            dataKey="value"
            stroke={`var(--chakra-colors-${color}-500)`}
            fill={`var(--chakra-colors-${color}-200)`}
            fillOpacity={0.6}
          />
        </RRadarChart>
      </ResponsiveContainer>
    </Box>
  )
}

export default RadarChart
