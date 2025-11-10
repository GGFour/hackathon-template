import { Box, Text } from "@chakra-ui/react"

interface AlertCardProps {
  status?: "info" | "warning" | "error" | "success"
  title: string
  description?: string
}

export function AlertCard({
  status = "info",
  title,
  description,
}: AlertCardProps) {
  const colorMap: Record<string, string> = {
    info: "blue",
    warning: "yellow",
    error: "red",
    success: "green",
  }
  const color = colorMap[status] || "gray"
  return (
    <Box
      borderWidth="1px"
      rounded="md"
      p={3}
      bg={`${color}.50`}
      _dark={{ bg: `${color}.900` }}
    >
      <Text fontSize="sm" fontWeight="semibold" mb={1}>
        {title}
      </Text>
      {description && (
        <Text fontSize="xs" color="gray.600" _dark={{ color: "gray.300" }}>
          {description}
        </Text>
      )}
    </Box>
  )
}

export default AlertCard
