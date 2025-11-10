import { Box, Flex, Text, Textarea } from "@chakra-ui/react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { useAIQuery } from "@/hooks/useAIQuery"

interface ChatMessage {
  role: "user" | "assistant"
  content: string
}

export function AIChatPanel() {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [input, setInput] = useState("")
  const { run, loading } = useAIQuery()

  const send = async () => {
    if (!input.trim()) return
    const userMsg: ChatMessage = { role: "user", content: input }
    setMessages((m) => [...m, userMsg])
    setInput("")
    const ai = await run(userMsg.content)
    setMessages((m) => [...m, { role: "assistant", content: ai }])
  }

  return (
    <Flex direction="column" h="100%" gap={3}>
      <Box
        display="flex"
        flexDirection="column"
        flex={1}
        overflowY="auto"
        p={2}
        borderWidth="1px"
        rounded="md"
        gap={8}
      >
        {messages.length === 0 && (
          <Text fontSize="sm">Start asking the model...</Text>
        )}
        {messages.map((m, i) => (
          <Box
            key={i}
            bg={m.role === "assistant" ? "blue.50" : "gray.50"}
            _dark={{ bg: m.role === "assistant" ? "blue.900" : "gray.700" }}
            p={2}
            rounded="md"
            fontSize="sm"
          >
            <Text fontWeight="semibold" mb={1}>
              {m.role === "assistant" ? "AI" : "You"}
            </Text>
            <Text whiteSpace="pre-wrap">{m.content}</Text>
          </Box>
        ))}
      </Box>
      <Flex gap={2}>
        <Textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          size="sm"
          placeholder="Ask the model..."
        />
        <Button onClick={send} loading={loading} variant="solid" flexShrink={0}>
          Send
        </Button>
      </Flex>
    </Flex>
  )
}

export default AIChatPanel
