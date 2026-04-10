import {
	Box,
	Grid,
	Heading,
	Text,
	Button,
	VStack,
	Badge,
	HStack,
} from "@chakra-ui/react";
import { ROUTES } from "@/constants/routes";
import { keyframes } from "@emotion/react";
import { useNavigate } from "react-router-dom";
import { FiActivity, FiAlertTriangle, FiCloud, FiCpu } from "react-icons/fi";

const cardReveal = keyframes`
	from { opacity: 0; transform: translateY(24px) scale(0.98); }
	to { opacity: 1; transform: translateY(0) scale(1); }
`;

const modules = [
	{
		title: "Live City Intelligence",
		desc: "Real-time monitoring of traffic, sensors, incidents and city activity across all zones.",
		route: ROUTES.map,
		icon: FiActivity,
	},
	{
		title: "Emergency Response Hub",
		desc: "Central system for tracking incidents with priority handling and fast response coordination.",
		route: ROUTES.emergencies,
		icon: FiAlertTriangle,
	},
	{
		title: "Environmental Analytics",
		desc: "Air quality tracking with pollution trends and environmental insights per district.",
		route: ROUTES.pollution,
		icon: FiCloud,
	},
	{
		title: "AI City Assistant",
		desc: "Smart assistant for reporting issues and accessing city services instantly.",
		route: ROUTES.chatbot,
		icon: FiCpu,
	},
];

export function ModulesSection() {
	const navigate = useNavigate();

	return (
		<Box
			as="section"
			position="relative"
			overflow="hidden"
			px={{ base: "5", md: "8", lg: "12" }}
			py={{ base: "8", md: "10", lg: "12" }}
			borderRadius="3xl"
			bgGradient="linear(to-br, bg.panel, bg)"
			borderWidth="1px"
			borderColor="whiteAlpha.200"
		>
			<Box
				position="absolute"
				top="-20"
				right="-20"
				w="72"
				h="72"
				bg="accent.500"
				opacity="0.08"
				filter="blur(80px)"
			/>

			<Heading
				mb={10}
				size="lg"
				textAlign="center"
				animation={`${cardReveal} 600ms ease-out forwards`}
			>
				Platform Modules
			</Heading>

			<Grid templateColumns={{ base: "1fr", md: "repeat(2, 1fr)" }} gap={6}>
				{modules.map((m, i) => {
					const Icon = m.icon;

					return (
						<Box
							key={m.title}
							p={6}
							borderRadius="2xl"
							bg="bg"
							borderWidth="1px"
							borderColor="whiteAlpha.200"
							position="relative"
							overflow="hidden"
							transition="all 0.3s ease"
							_hover={{
								transform: "translateY(-6px)",
								boxShadow: "0 20px 40px rgba(0,0,0,0.2)",
								borderColor: "accent.300",
							}}
							animation={`${cardReveal} 600ms ease-out forwards ${i * 100}ms`}
						>
							<Box
								position="absolute"
								top="-10"
								right="-10"
								w="24"
								h="24"
								bg="accent.500"
								opacity="0.1"
								filter="blur(30px)"
							/>

							<VStack align="start" gap={3}>
								<HStack justify="space-between" w="100%">
									<Box color="accent.400" fontSize="22px">
										<Icon />
									</Box>

									<Badge colorPalette="accent" variant="subtle">
										MODULE
									</Badge>
								</HStack>

								<Heading size="md">{m.title}</Heading>

								<Text color="fg.muted">{m.desc}</Text>

								<Button
									colorPalette="accent"
									mt={3}
									borderRadius="full"
									onClick={() => navigate(m.route)}
								>
									Open
								</Button>
							</VStack>
						</Box>
					);
				})}
			</Grid>
		</Box>
	);
}
