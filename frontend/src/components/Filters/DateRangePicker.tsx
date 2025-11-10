import { Flex, Input } from "@chakra-ui/react"

interface DateRangePickerProps {
  start: string
  end: string
  onChange: (range: { start: string; end: string }) => void
  size?: string
}

export function DateRangePicker({
  start,
  end,
  onChange,
}: DateRangePickerProps) {
  return (
    <Flex gap={2} align="center">
      <Input
        type="date"
        value={start}
        onChange={(e) => onChange({ start: e.target.value, end })}
        maxW="xs"
      />
      <Input
        type="date"
        value={end}
        onChange={(e) => onChange({ start, end: e.target.value })}
        maxW="xs"
      />
    </Flex>
  )
}

export default DateRangePicker
