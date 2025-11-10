import { IconButton } from "@chakra-ui/react"
import { FiMoon } from "react-icons/fi"

export function ThemeToggle() {
  // placeholder (theme handled by provider color-mode elsewhere)
  return (
    <IconButton
      aria-label="Toggle theme"
      size="sm"
      variant="ghost"
      _icon={{ fontSize: "16px" }}
    >
      <FiMoon />
    </IconButton>
  )
}

export default ThemeToggle
