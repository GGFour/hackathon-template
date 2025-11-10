import { Input } from "@chakra-ui/react"

interface SearchBarProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
}

export function SearchBar({
  value,
  onChange,
  placeholder = "Search...",
}: SearchBarProps) {
  return (
    <Input
      maxW="xs"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      size="sm"
    />
  )
}

export default SearchBar
