import { Button } from "@chakra-ui/react";
import { useColorMode } from "@/components/ui/color-mode";
import { topRightButtonStyles } from "@/styles/buttonStyles";

export function ThemeToggleButton() {
	const { colorMode, toggleColorMode } = useColorMode();

	return (
		<Button {...topRightButtonStyles} onClick={toggleColorMode}>
			{colorMode === "dark" ? "Switch to Light" : "Switch to Dark"}
		</Button>
	);
}
