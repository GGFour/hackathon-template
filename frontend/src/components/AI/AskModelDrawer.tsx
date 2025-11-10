import { Box, Button, Text, Textarea } from "@chakra-ui/react"
import { useState } from "react"
import { useAIQuery } from "@/hooks/useAIQuery"

interface AskModelDrawerProps {
  isOpen: boolean
  onClose: () => void
}

export function AskModelDrawer({ isOpen, onClose }: AskModelDrawerProps) {
  const [prompt, setPrompt] = useState("")
  const [response, setResponse] = useState<string | null>(null)
  const { run, loading } = useAIQuery()
  // removed Drawer; btnRef no longer needed

  const submit = async () => {
    if (!prompt.trim()) return
    const output = await run(prompt)
    setResponse(output)
  }

  if (!isOpen) return null
  return (
    <Box
      position="fixed"
      top={0}
      right={0}
      h="100vh"
      w="320px"
      bg="white"
      _dark={{ bg: "gray.800" }}
      shadow="lg"
      p={4}
      zIndex={1000}
      display="flex"
      flexDirection="column"
      gap={12}
    >
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Text fontWeight="semibold">Ask the Model</Text>
        <Button variant="ghost" onClick={onClose} style={{ fontSize: "12px" }}>
          Close
        </Button>
      </Box>
      <Box display="flex" flexDirection="column" gap={12}>
        <Textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Enter your question or prompt"
        />
        <Button onClick={submit} loading={loading} variant="solid">
          Submit
        </Button>
        {response && (
          <Text
            fontSize="sm"
            p={2}
            borderWidth="1px"
            rounded="md"
            whiteSpace="pre-wrap"
          >
            {response}
          </Text>
        )}
      </Box>
    </Box>
  )
}

export default AskModelDrawer
