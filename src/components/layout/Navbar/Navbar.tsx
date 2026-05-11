import { Show, SignInButton, SignUpButton, UserButton } from "@clerk/react";
import {
	Box,
	Button,
	Container,
	Flex,
	HStack,
	Icon,
	Text,
} from "@chakra-ui/react";
import { NavLink } from "react-router-dom";
import { useColorMode } from "@/components/ui/color-mode";
import { ROUTES } from "@/constants/routes";
import {
	FaExclamationTriangle,
	FaHome,
	FaMap,
	FaMoon,
	FaRobot,
	FaSmog,
	FaSun,
} from "react-icons/fa";

const navItems = [
	{ label: "Home", to: ROUTES.home, icon: FaHome },
	{ label: "Map", to: ROUTES.map, icon: FaMap },
	{ label: "Emergencies", to: ROUTES.emergencies, icon: FaExclamationTriangle },
	{ label: "Pollution", to: ROUTES.pollution, icon: FaSmog },
	{ label: "Chatbot", to: ROUTES.chatbot, icon: FaRobot },
];

export function Navbar() {
	const { colorMode, toggleColorMode } = useColorMode();
	const isDark = colorMode === "dark";

	return (
		<Box
			w="100%"
			position="sticky"
			top={0}
			zIndex={1000}
			h="56px"
			backdropFilter="blur(10px)"
			borderBottom="1px solid"
			borderColor="border"
		>
			<Container maxW="7xl" h="full" py={0}>
				<Flex justify="space-between" align="center" gap={4} h="full">
					<HStack gap={6} flexWrap="wrap">
						<NavLink to={ROUTES.home}>
							<Text fontWeight="bold" color="fg" whiteSpace="nowrap">
								Smart City
							</Text>
						</NavLink>
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

					<HStack gap={3}>
						<Show when="signed-out">
							<HStack gap={3}>
								<SignInButton mode="modal">
									<Button variant="ghost" colorPalette="accent" size="sm">
										Log in
									</Button>
								</SignInButton>
								<SignUpButton mode="modal">
									<Button colorPalette="accent" size="sm">
										Sign up
									</Button>
								</SignUpButton>
							</HStack>
						</Show>
						<Show when="signed-in">
							<UserButton>
								<UserButton.MenuItems>
									<UserButton.Action
										label={isDark ? "Switch to Light" : "Switch to Dark"}
										labelIcon={
											<Icon as={isDark ? FaSun : FaMoon} boxSize={4} />
										}
										onClick={toggleColorMode}
									/>
								</UserButton.MenuItems>
							</UserButton>
						</Show>
					</HStack>
				</Flex>
			</Container>
		</Box>
	);
}
