import { Box, Container, Flex, HStack, Text, Button } from "@chakra-ui/react";
import { NavLink } from "react-router-dom";
import { ROUTES } from "@/constants/routes";
import { useColorMode } from "@/components/ui/color-mode";

const navItems = [
  { label: "Home", to: ROUTES.home },
  { label: "Map", to: ROUTES.map },
  { label: "Emergencies", to: ROUTES.emergencies },
  { label: "Pollution", to: ROUTES.pollution },
  { label: "Chatbot", to: ROUTES.chatbot },
];

export function Navbar() {
  const { colorMode, toggleColorMode } = useColorMode();

  const activeColor = colorMode === "dark" ? "accent.fg" : "green.600";
  const inactiveColor = colorMode === "dark" ? "gray.400" : "gray.500";
  const bgColor = colorMode === "dark" ? "#1A202C" : "#fff";
  const borderColor = colorMode === "dark" ? "#4A5568" : "#E2E8F0";

  return (
    <Box
      bg={bgColor}
      borderBottom="1px solid"
      borderBottomColor={borderColor}
      w="100%"
      position="sticky"
      top={0}
      zIndex={1000}
    >
      <Container
        maxW="7xl"
        py={{ base: 3, md: 4 }}
        px={{ base: 5, md: 8, lg: 12 }}
      >
        <Flex
          direction={{ base: "column", md: "row" }}
          align={{ base: "center", md: "center" }}
          justify="space-between"
          gap={{ base: 3, md: 6 }}
        >
          <HStack
            flexWrap="wrap"
            justify={{ base: "center", md: "flex-start" }}
            gap={{ base: 3, md: 6 }}
            w="100%"
          >
            {navItems.map((item) => (
              <NavLink key={item.to} to={item.to}>
                {({ isActive }) => (
                  <Text
                    fontSize={{ base: "md", md: "lg" }}
                    fontWeight={isActive ? "semibold" : "medium"}
                    color={isActive ? activeColor : inactiveColor}
                    px={3}
                    py={1}
                    borderRadius="md"
                    textAlign="center"
                    _hover={{ transform: "translateY(-1px)", transition: "all 0.2s" }}
                  >
                    {item.label}
                  </Text>
                )}
              </NavLink>
            ))}
          </HStack>

          <Button
            onClick={toggleColorMode}
            bg={colorMode === "dark" ? "gray.800" : "gray.200"}
            color={colorMode === "dark" ? "white" : "gray.800"}
            minW="120px"
            borderRadius="md"
            mt={{ base: 2, md: 0 }}
            _hover={{
              transform: "scale(1.05)",
              bg: colorMode === "dark" ? "gray.700" : "gray.300",
            }}
            display="flex"
            alignItems="center"
            justifyContent="space-between"
          >
            {colorMode === "dark" ? "Dark" : "Light"} Mode
            <Box
              w="24px"
              h="12px"
              borderRadius="full"
              bg="green.500"
              position="relative"
              ml={2}
            >
              <Box
                w="10px"
                h="10px"
                borderRadius="full"
                bg="white"
                position="absolute"
                top="1px"
                left={colorMode === "dark" ? "12px" : "1px"}
                transition="left 0.3s"
              />
            </Box>
          </Button>
        </Flex>
      </Container>
    </Box>
  );
}