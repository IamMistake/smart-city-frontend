import {
	Box,
	Grid,
	Heading,
	Text,
	Button,
	VStack,
	Badge,
} from "@chakra-ui/react";
import { NavLink } from "react-router-dom";
import { ROUTES } from "@/constants/routes";
import { keyframes } from "@emotion/react";

// Animations for staggered reveal
const cardReveal = keyframes`
  from { opacity: 0; transform: translateY(24px); }
  to { opacity: 1; transform: translateY(0); }
`;

const modules = [
	{ title: "Live Map", desc: "Monitor city in real time", route: ROUTES.map },
	{ title: "Emergencies", desc: "Track incidents", route: ROUTES.emergencies },
	{ title: "Pollution", desc: "Air quality insights", route: ROUTES.pollution },
	{ title: "Chatbot", desc: "Ask the system", route: ROUTES.chatbot },
];

export function ModulesSection() {
	return (
		<Box
			as="section"
			aria-labelledby="modules-title"
			position="relative"
			overflow="hidden"
			px={{ base: "5", md: "8", lg: "12" }}
			py={{ base: "8", md: "10", lg: "12" }}
			borderWidth="1px"
			borderColor="border"
			borderRadius={{ base: "2xl", lg: "3xl" }}
			bg="bg.panel"
		>
			{/* Background accent */}
			<Box
				position="absolute"
				top={{ base: "-20", lg: "-24" }}
				right={{ base: "-20", lg: "-16" }}
				w={{ base: "48", lg: "64" }}
				h={{ base: "48", lg: "64" }}
				bgGradient="radial(circle at center, accent.subtle, transparent 70%)"
				pointerEvents="none"
			/>

			<Heading
				id="modules-title"
				size="lg"
				mb={8}
				opacity={0}
				animation={`${cardReveal} 600ms ease-out forwards`}
			>
				Core Modules
			</Heading>

			<Grid templateColumns={{ base: "1fr", md: "repeat(2, 1fr)" }} gap={6}>
				{modules.map((m, i) => (
					<Box
						key={m.title}
						borderWidth="1px"
						borderRadius="2xl"
						p={{ base: 5, md: 6 }}
						bg="bg"
						boxShadow="0 20px 45px -25px rgba(10, 30, 20, 0.25)"
						transform="translateY(0)"
						_hover={{
							transform: "translateY(-4px)",
							boxShadow: "0 25px 50px -25px rgba(10, 30, 20, 0.35)",
						}}
						opacity={0}
						animation={`${cardReveal} 600ms ease-out forwards ${i * 120}ms`}
						position="relative"
					>
						{/* Accent badge */}
						<Badge
							colorPalette="accent"
							position="absolute"
							top="-2"
							right="-2"
							px="2.5"
							py="1"
							borderRadius="md"
							fontSize="xs"
							fontWeight="bold"
							textTransform="uppercase"
						>
							{m.title.includes("Map") ? "Live" : m.title}
						</Badge>

						<VStack align="start" gap={3} mt={2}>
							<Heading size="md">{m.title}</Heading>
							<Text color="fg.muted">{m.desc}</Text>
							<Button asChild colorPalette="accent" mt={3} borderRadius="full">
								<NavLink to={m.route}>Open</NavLink>
							</Button>
						</VStack>
					</Box>
				))}
			</Grid>
		</Box>
	);
}
