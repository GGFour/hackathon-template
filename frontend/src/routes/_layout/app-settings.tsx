import { Box, Flex, Heading, Text } from "@chakra-ui/react"
import { createFileRoute } from "@tanstack/react-router"
import { useState } from "react"
import PageContainer from "@/components/Layout/PageContainer"
import ThemeToggle from "@/components/Utilities/ThemeToggle"
import { Button } from "@/components/ui/button"

// Cast path until route types regenerate
export const Route = createFileRoute("/_layout/app-settings" as any)({
  component: AppSettings,
})

function AppSettings() {
  const [trustThreshold, setTrustThreshold] = useState(60)
  const [apiKey, setApiKey] = useState("sk-demo-123")
  const [modelConfig, setModelConfig] = useState(
    "temperature:0.7\nmax_tokens:512",
  )

  const save = () =>
    console.log("Saved app settings", { trustThreshold, apiKey, modelConfig })
  const exportConfig = () => void navigator.clipboard.writeText(modelConfig)
  const importConfig = () =>
    setModelConfig("temperature:0.65\nmax_tokens:640\ntop_p:0.9")

  return (
    <PageContainer>
      <Flex justify="space-between" align="center" mb={6}>
        <Heading fontSize="2xl">App Settings</Heading>
        <ThemeToggle />
      </Flex>
      <Box display="flex" flexDirection="column" gap={24}>
        <Box display="flex" flexDirection="column" gap={6}>
          <Heading fontSize="md">Trust Threshold</Heading>
          <Text fontSize="xs" color="gray.500">
            Minimum acceptable trust for automation.
          </Text>
          <Flex align="center" gap={4}>
            <input
              type="range"
              min={0}
              max={100}
              value={trustThreshold}
              onChange={(e) => setTrustThreshold(Number(e.target.value))}
              style={{ flex: 1 }}
            />
            <Text fontSize="sm" w="40px" textAlign="right">
              {trustThreshold}%
            </Text>
          </Flex>
        </Box>
        <Box display="flex" flexDirection="column" gap={6}>
          <Heading fontSize="md">Model / API Settings</Heading>
          <input
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            placeholder="API Key"
            style={{ padding: "6px", fontSize: "12px" }}
          />
          <textarea
            value={modelConfig}
            onChange={(e) => setModelConfig(e.target.value)}
            rows={6}
            style={{
              padding: "6px",
              fontSize: "12px",
              fontFamily: "monospace",
            }}
          />
          <Flex gap={4} wrap="wrap">
            <Button
              size="sm"
              onClick={save}
              variant="solid"
              colorScheme="green"
            >
              Save
            </Button>
            <Button size="sm" onClick={exportConfig} variant="outline">
              Export
            </Button>
            <Button size="sm" onClick={importConfig} variant="ghost">
              Import
            </Button>
          </Flex>
        </Box>
      </Box>
    </PageContainer>
  )
}

export default AppSettings
