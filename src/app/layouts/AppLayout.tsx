import { Navbar } from "@/components/layout/Navbar/Navbar";
import { Box } from "@chakra-ui/react";
import { Outlet } from "react-router-dom";
import { Footer } from "@/components/sections/Footer";

export function AppLayout() {
	return (
		<Box minH="100vh" bg="bg" color="fg">
			<Navbar />

			<Box
				as="main"
				maxW="1200px"
				mx="auto"
				px={{ base: "4", md: "6" }}
				pt="8"
				pb="6"
			>
				<Outlet />
			</Box>

			<Footer />
		</Box>
	);
}
