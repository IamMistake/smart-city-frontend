import { Show, SignInButton, SignUpButton, UserButton } from "@clerk/react";
import { Box, Button, Container, Flex, HStack, Icon } from "@chakra-ui/react";
import { NavLink } from "react-router-dom";
import { ThemeToggleButton } from "@/components/theme/ThemeToggleButton";
import { ROUTES } from "@/constants/routes";
import {
	FaExclamationTriangle,
	FaHome,
	FaMap,
	FaRobot,
	FaSmog,
} from "react-icons/fa";

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
			borderColor="border"
		>
			<Container maxW="7xl" py={4}>
				<Flex justify="space-between" align="center" gap={4}>
					<HStack gap={4} flexWrap="wrap">
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
							<HStack gap={2}>
								<SignInButton mode="modal">
									<Button size="sm" colorPalette="accent">
										Sign in
									</Button>
								</SignInButton>
								<SignUpButton mode="modal">
									<Button size="sm" variant="outline" colorPalette="accent">
										Sign up
									</Button>
								</SignUpButton>
							</HStack>
						</Show>
						<Show when="signed-in">
							<UserButton />
						</Show>
						<ThemeToggleButton />
					</HStack>
				</Flex>
			</Container>
		</Box>
	);
}
