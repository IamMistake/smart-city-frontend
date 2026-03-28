import { Navbar } from "@/components/layout/Navbar/Navbar";
import { Box, Container, Flex, HStack, Link} from "@chakra-ui/react";
import { NavLink, Outlet } from "react-router-dom";
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
			
			<Navbar />

			<Container maxW="7xl" py="8">
				<Outlet />
			</Container>

			<Footer />
		</Box>
	);
}
