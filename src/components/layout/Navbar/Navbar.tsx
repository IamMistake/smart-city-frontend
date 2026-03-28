import { Box, Container, Flex, HStack, Text, Button } from "@chakra-ui/react";
import { NavLink } from "react-router-dom";
import { ROUTES } from "@/constants/routes";
import { useColorMode } from "@/components/ui/color-mode";
import styles from "./Navbar.module.css";

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
	const inactiveColor = colorMode === "dark" ? "fg.muted" : "gray.500";

	return (
		<Box
			className={styles.navbar}
			style={
				{
					"--bg-panel": colorMode === "dark" ? "#1A202C" : "#fff",
					"--border-color": colorMode === "dark" ? "#4A5568" : "#E2E8F0",
				} as any
			}
		>
			<Container
				maxW="7xl"
				mx="auto"
				py={{ base: 3, md: 4 }}
				px={{ base: 5, md: 8, lg: 12 }}
			>
				<Flex
					direction={{ base: "column", md: "row" }}
					align={{ base: "flex-start", md: "center" }}
					justify="space-between"
					gap={{ base: 3, md: 6 }}
					className={styles.flexContainer}
				>
					<HStack className={styles["nav-links"]}>
						{navItems.map((item) => (
							<NavLink key={item.to} to={item.to}>
								{({ isActive }) => (
									<Text
										className={styles["nav-link"]}
										fontSize={{ base: "md", md: "lg" }}
										fontWeight={isActive ? "semibold" : "medium"}
										color={isActive ? activeColor : inactiveColor}
									>
										{item.label}
									</Text>
								)}
							</NavLink>
						))}
					</HStack>

					<Button
						className={styles["theme-toggle"]}
						onClick={toggleColorMode}
						bg={colorMode === "dark" ? "gray.800" : "gray.200"}
						color={colorMode === "dark" ? "white" : "gray.800"}
						_hover={{
							transform: "scale(1.05)",
							bg: colorMode === "dark" ? "gray.700" : "gray.300",
						}}
					>
						{colorMode === "dark" ? "Dark" : "Light"} Mode
						<Box
							className={styles["slide-indicator"]}
							style={{
								left: colorMode === "dark" ? "12px" : "1px",
							}}
						/>
					</Button>
				</Flex>
			</Container>
		</Box>
	);
}
