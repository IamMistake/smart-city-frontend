import { Navbar } from "@/components/layout/Navbar/Navbar";
import { Box, Container} from "@chakra-ui/react";
import { Outlet } from "react-router-dom";
import { Footer } from "@/components/sections/Footer";


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
