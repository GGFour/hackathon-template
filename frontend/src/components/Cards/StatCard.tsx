import { Box, Flex, Heading, Text } from "@chakra-ui/react"

interface StatCardProps {
  label: string
  value: string | number
  subLabel?: string
  accent?: string
}

export function StatCard({ label, value, subLabel, accent }: StatCardProps) {
  const bg = "white"
  return (
    <Box p={4} rounded="md" shadow="sm" borderWidth="1px" bg={bg} role="group">
      <Flex justify="space-between" align="start">
        <Heading fontSize="lg">{label}</Heading>
        {accent && (
          <Text fontSize="xs" color="gray.500" fontWeight="medium">
            {accent}
          </Text>
        )}
      </Flex>
      <Text fontSize="3xl" fontWeight="semibold" mt={2}>
        {value}
      </Text>
      {subLabel && (
        <Text fontSize="xs" color="gray.500" mt={1}>
          {subLabel}
        </Text>
      )}
    </Box>
  )
}

export default StatCard
