import { Box, Grid, Heading, Text, Button } from "@chakra-ui/react";
import { NavLink } from "react-router-dom";
import { ROUTES } from "@/constants/routes";

const modules = [
	{ title: "Live Map", desc: "Monitor city in real time", route: ROUTES.map },
	{ title: "Emergencies", desc: "Track incidents", route: ROUTES.emergencies },
	{ title: "Pollution", desc: "Air quality insights", route: ROUTES.pollution },
	{ title: "Chatbot", desc: "Ask the system", route: ROUTES.chatbot },
];

export function ModulesSection() {
	return (
		<Box>
			<Heading size="lg" mb={6}>
				Core Modules
			</Heading>

			<Grid templateColumns={{ base: "1fr", md: "repeat(2, 1fr)" }} gap={6}>
				{modules.map((m) => (
					<Box key={m.title} borderWidth="1px" borderRadius="xl" p={5}>
						<Heading size="md">{m.title}</Heading>
						<Text mt={2} color="fg.muted">
							{m.desc}
						</Text>

						<Button asChild mt={4}>
							<NavLink to={m.route}>Open</NavLink>
						</Button>
					</Box>
				))}
			</Grid>
		</Box>
	);
}
