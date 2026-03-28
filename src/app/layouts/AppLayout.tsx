import { Box, Container, Text } from "@chakra-ui/react";
import { Outlet } from "react-router-dom";
import { Navbar } from "@/components/layout/Navbar/Navbar";

export function AppLayout() {
	return (
		<Box minH="100vh" bg="bg" color="fg">
			
			<Navbar />

			<Container maxW="7xl" py="8">
				<Outlet />
			</Container>

			<Box as="footer" borderTopWidth="1px" borderColor="border" py="4">
				<Container maxW="7xl">
					<Text color="fg.muted" fontSize="sm">
						Smart City Monitoring Platform
					</Text>
				</Container>
			</Box>
		</Box>
	);
}
