import { Box } from "@chakra-ui/react"
import type { ReactNode } from "react"

interface PageContainerProps {
  children: ReactNode
  maxW?: string
}

export function PageContainer({ children, maxW = "7xl" }: PageContainerProps) {
  return (
    <Box
      w="100%"
      maxW={maxW}
      mx="auto"
      px={{ base: 4, md: 6 }}
      py={{ base: 4, md: 6 }}
    >
      {children}
    </Box>
  )
}

export default PageContainer
