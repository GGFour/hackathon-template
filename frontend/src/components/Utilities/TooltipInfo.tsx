import { Badge } from "@chakra-ui/react"

interface TooltipInfoProps {
  label: string
  description: string
}

export function TooltipInfo({ label }: TooltipInfoProps) {
  return (
    <Badge variant="subtle" colorScheme="gray">
      {label}
    </Badge>
  )
}

export default TooltipInfo
