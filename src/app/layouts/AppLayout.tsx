import { Box, Container, Flex, HStack, Link} from "@chakra-ui/react";
import { NavLink, Outlet } from "react-router-dom";
import { ThemeToggleButton } from "@/components/theme/ThemeToggleButton";
import { ROUTES } from "@/constants/routes";
import { Footer } from "@/components/sections/Footer";

const navItems = [
	{ label: "Home", to: ROUTES.home },
	{ label: "Map", to: ROUTES.map },
	{ label: "Emergencies", to: ROUTES.emergencies },
	{ label: "Pollution", to: ROUTES.pollution },
	{ label: "Chatbot", to: ROUTES.chatbot },
];

export function AppLayout() {
	return (
		<Box minH="100vh" bg="bg" color="fg">
			<Box borderBottomWidth="1px" borderColor="border" bg="bg.panel">
				<Container maxW="7xl" py="4">
					<Flex align="center" justify="space-between" gap="4" wrap="wrap">
						<HStack gap="4" wrap="wrap">
							{navItems.map((item) => (
								<Link
									key={item.to}
									asChild
									color="fg.muted"
									fontWeight="medium"
									_hover={{ color: "accent.fg" }}
								>
									<NavLink to={item.to}>{item.label}</NavLink>
								</Link>
							))}
						</HStack>
						<ThemeToggleButton />
					</Flex>
				</Container>
			</Box>

			<Container maxW="7xl" py="8">
				<Outlet />
			</Container>

			<Footer />
		</Box>
	);
}
