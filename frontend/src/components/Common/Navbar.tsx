import { Flex, Image, useBreakpointValue } from "@chakra-ui/react"
import { Link } from "@tanstack/react-router"

import Logo from "/assets/images/icecube-logo.svg"
import UserMenu from "./UserMenu"

function Navbar() {
  const display = useBreakpointValue({ base: "none", md: "flex" })

  const navLinks = [
    { to: "/dashboard", label: "Dashboard" },
    { to: "/source-detail", label: "Source" },
    { to: "/compare-sources", label: "Compare" },
    { to: "/model-insights", label: "Model" },
    { to: "/app-settings", label: "App Settings" },
    { to: "/about", label: "About" },
  ]

  return (
    <Flex
      display={display}
      justify="space-between"
      position="sticky"
      color="black"
      align="center"
      bg="bg.muted"
      w="100%"
      top={0}
      p={4}
      gap={6}
    >
      <Link to="/">
        <Image src={Logo} alt="Logo" maxW="3xs" p={2} />
      </Link>
      <Flex flex="1" justify="flex-start" gap={4} as="nav">
        {navLinks.map((l) => (
          <Link
            key={l.to}
            to={l.to}
            activeProps={{
              style: { fontWeight: "600", textDecoration: "underline" },
            }}
          >
            <Flex
              as="span"
              px={2}
              py={1}
              rounded="md"
              fontSize="lg"
              _hover={{ bg: "bg.subtle" }}
            >
              {l.label}
            </Flex>
          </Link>
        ))}
      </Flex>
      <Flex gap={2} alignItems="center" shrink={0}>
        <UserMenu />
      </Flex>
    </Flex>
  )
}

export default Navbar
