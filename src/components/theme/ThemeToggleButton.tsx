import { Button, Box } from "@chakra-ui/react";
import { useColorMode } from "@/components/ui/color-mode";
import { topRightButtonStyles } from "@/styles/buttonStyles";

export function ThemeToggleButton() {
  const { colorMode, toggleColorMode } = useColorMode();

  return (
    <Button
      {...topRightButtonStyles}
      onClick={toggleColorMode}
      position="relative"
      display="flex"
      alignItems="center"
      justifyContent="space-between"
      minW="120px"
      px={4}
    >
      <Box as="span">{colorMode === "dark" ? "Dark" : "Light"} Mode</Box>
      
      {/* Slide indicator */}
      <Box
        ml={2}
        w="24px"
        h="12px"
        borderRadius="full"
        bg={colorMode === "dark" ? "green.400" : "gray.300"}
        position="relative"
        _before={{
          content: '""',
          position: "absolute",
          top: "1px",
          left: colorMode === "dark" ? "12px" : "1px",
          width: "10px",
          height: "10px",
          borderRadius: "full",
          bg: "white",
          transition: "left 0.3s",
        }}
      />
    </Button>
  );
}