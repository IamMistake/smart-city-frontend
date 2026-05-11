import { Navbar } from "@/components/layout/Navbar/Navbar";
import { Box } from "@chakra-ui/react";
import { Outlet, useLocation } from "react-router-dom";
import { Footer } from "@/components/sections/Footer";
import { ROUTES } from "@/constants/routes";

export function AppLayout() {
	const location = useLocation();
	const isMapRoute = location.pathname === ROUTES.map;

	return (
		<Box minH="100vh" bg="bg" color="fg">
			<Navbar />

			<Box
				as="main"
				maxW={isMapRoute ? "none" : "1200px"}
				mx={isMapRoute ? "0" : "auto"}
				px={isMapRoute ? "0" : { base: "4", md: "6" }}
				pt={isMapRoute ? "0" : "8"}
				pb={isMapRoute ? "0" : "6"}
			>
				<Outlet />
			</Box>

			<Footer />
		</Box>
	);
}
