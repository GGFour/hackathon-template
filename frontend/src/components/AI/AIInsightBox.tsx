import { Box, Heading, Text } from "@chakra-ui/react"

interface AIInsightBoxProps {
  title: string
  insight: string
}

export function AIInsightBox({ title, insight }: AIInsightBoxProps) {
  return (
    <Box
      p={3}
      borderWidth="1px"
      rounded="md"
      bg="gray.50"
      _dark={{ bg: "gray.700" }}
    >
      <Heading fontSize="sm" mb={1}>
        {title}
      </Heading>
      <Text fontSize="xs" whiteSpace="pre-wrap">
        {insight}
      </Text>
    </Box>
  )
}

export default AIInsightBox
