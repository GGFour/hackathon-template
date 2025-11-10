import { Flex, Link, Text } from "@chakra-ui/react"

function Footer() {
  return (
    <Flex
      as="footer"
      py={2}
      px={4}
      borderTopWidth="1px"
      align="center"
      gap={4}
      fontSize="xs"
      color="gray.500"
    >
      <Text>&copy; {new Date().getFullYear()} Hackathon Template</Text>
      <Flex gap={2} ml="auto">
        <Link href="/about" fontWeight="medium">
          About
        </Link>
        <Link href="https://github.com">GitHub</Link>
      </Flex>
    </Flex>
  )
}

export default Footer
