import { Box, Flex, Heading, Text } from "@chakra-ui/react"
import { createFileRoute } from "@tanstack/react-router"
import PageContainer from "@/components/Layout/PageContainer"

export const Route = createFileRoute("/_layout/about" as any)({
  component: About,
})

// Mock data
const team = [
  { name: "Alice", role: "ML Engineer" },
  { name: "Bob", role: "Data Scientist" },
  { name: "Carol", role: "Frontend Dev" },
]

function About() {
  return (
    <PageContainer>
      <Flex justify="space-between" align="center" mb={6}>
        <Heading fontSize="2xl">About</Heading>
      </Flex>
      <Box display="flex" flexDirection="column" gap={16}>
        <Text fontSize="sm">
          This project accelerates hackathon teams building trust & insight
          dashboards for AI-driven source evaluation. It demonstrates modular
          Chakra UI design, generated API clients, and pluggable AI reasoning
          panels.
        </Text>
        <Box display="flex" flexDirection="column" gap={8}>
          <Heading fontSize="md">Team</Heading>
          <Flex wrap="wrap" gap={4}>
            {team.map((t) => (
              <Box
                key={t.name}
                p={3}
                borderWidth="1px"
                rounded="md"
                minW="140px"
              >
                <Text fontSize="sm" fontWeight="semibold">
                  {t.name}
                </Text>
                <Text fontSize="xs" color="gray.500">
                  {t.role}
                </Text>
              </Box>
            ))}
          </Flex>
        </Box>
        <Box display="flex" flexDirection="column" gap={4}>
          <Heading fontSize="md">Contact</Heading>
          <Text fontSize="xs">
            Reach out via issues or PRs on the repository. Collaboration
            welcome.
          </Text>
        </Box>
      </Box>
    </PageContainer>
  )
}

export default About
