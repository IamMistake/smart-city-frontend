import { Box, Container, Flex, HStack, Icon } from "@chakra-ui/react";
import { NavLink } from "react-router-dom";
import { ROUTES } from "@/constants/routes";
import { ThemeToggleButton } from "@/components/theme/ThemeToggleButton";
import { FaHome, FaMap, FaExclamationTriangle, FaSmog, FaRobot } from "react-icons/fa";

const navItems = [
  { label: "Home", to: ROUTES.home, icon: FaHome },
  { label: "Map", to: ROUTES.map, icon: FaMap },
  { label: "Emergencies", to: ROUTES.emergencies, icon: FaExclamationTriangle },
  { label: "Pollution", to: ROUTES.pollution, icon: FaSmog },
  { label: "Chatbot", to: ROUTES.chatbot, icon: FaRobot },
];

export function Navbar() {
  return (
    <Box
      w="100%"
      position="sticky"
      top={0}
      zIndex={1000}
      backdropFilter="blur(10px)"     
      borderBottom="1px solid"
      borderColor="border"   // линија долу, ќе се смени во light/dark mode
    >
      <Container maxW="7xl" py={4}>
        <Flex justify="space-between" align="center">
          <HStack gap={4}>
            {navItems.map((item) => (
              <NavLink key={item.to} to={item.to}>
                {({ isActive }) => (
                  <Flex
                    align="center"
                    gap={2}
                    px={3}
                    py={1}
                    fontWeight={isActive ? "bold" : "medium"}
                    color={isActive ? "accent.fg" : "fg.muted"}
                    cursor="pointer"
                    transition="all 0.2s"
                    _hover={{
                      color: "accent.fg",
                      transform: "scale(1.1)",
                      textDecoration: "underline",
                    }}
                  >
                    <Icon as={item.icon} boxSize={4} />
                    <Box>{item.label}</Box>
                  </Flex>
                )}
              </NavLink>
            ))}
          </HStack>

          <ThemeToggleButton />
        </Flex>
      </Container>
    </Box>
  );
}