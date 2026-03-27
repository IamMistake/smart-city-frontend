import {
	Box,
	Container,
	Flex,
	HStack,
	Link,
	Stack,
	Text,
	Icon,
} from "@chakra-ui/react";
import { NavLink } from "react-router-dom";
import { FaEnvelope } from "react-icons/fa";
import { FaPhone } from "react-icons/fa";
import { FaFacebook } from "react-icons/fa";
import { FaTwitter } from "react-icons/fa";
import { FaInstagram } from "react-icons/fa";
import { ROUTES } from "@/constants/routes";

const navItems = [
	{ label: "Home", to: ROUTES.home },
	{ label: "Map", to: ROUTES.map },
	{ label: "Emergencies", to: ROUTES.emergencies },
	{ label: "Pollution", to: ROUTES.pollution },
	{ label: "Chatbot", to: ROUTES.chatbot },
];

export function Footer() {
	return (
		<Box
			as="footer"
			position="relative"
			borderTopWidth="1px"
			borderColor="border"
			bg="bg.panel"
			py={{ base: 8, md: 10 }}
			backdropFilter="blur(10px)"
		>
			{/* subtle gradient glow */}
			<Box
				position="absolute"
				top="-40px"
				left="0"
				right="0"
				height="80px"
				bgGradient="linear(to-b, accent.subtle, transparent)"
				opacity={0.4}
				pointerEvents="none"
			/>

			<Container maxW="7xl" position="relative">
				<Flex
					direction={{ base: "column", md: "row" }}
					justify="space-between"
					gap={{ base: 8, md: 16 }}
				>
					{/* Project Info */}
					<Box>
						<Text fontWeight="bold" mb={2}>
							Smart City Monitoring Platform
						</Text>
						<Text color="fg.muted" fontSize="sm">
							Bringing data-driven insights to urban management.
						</Text>
					</Box>

					{/* Quick Links */}
					<Box>
						<Text fontWeight="bold" mb={2}>
							Quick Links
						</Text>
						<Stack gap={1}>
							{navItems.map((item) => (
								<Link
									key={item.to}
									asChild
									fontSize="sm"
									color="fg.muted"
									transition="all 0.2s"
									_hover={{
										color: "accent.fg",
										transform: "translateX(4px)",
									}}
								>
									<NavLink to={item.to}>{item.label}</NavLink>
								</Link>
							))}
						</Stack>
					</Box>

					{/* Contact */}
					<Box>
						<Text fontWeight="bold" mb={2}>
							Contact
						</Text>
						<Stack gap={2}>
							<Flex align="center" gap={2}>
								<Icon as={FaEnvelope} boxSize={4} color="fg.muted" />
								<Text color="fg.muted" fontSize="sm">
									info@smartcity.com
								</Text>
							</Flex>

							<Flex align="center" gap={2}>
								<Icon as={FaPhone} boxSize={4} color="fg.muted" />
								<Text color="fg.muted" fontSize="sm">
									+389 70 123 456
								</Text>
							</Flex>

							<Text color="fg.muted" fontSize="sm">
								Skopje, North Macedonia
							</Text>

							<HStack gap={3} mt={2}>
								{[FaFacebook, FaTwitter, FaInstagram].map((IconComp, i) => (
									<Link
										key={i}
										href="#"
										target="_blank"
										rel="noopener noreferrer"
									>
										<Icon
											as={IconComp}
											boxSize={5}
											color="fg.muted"
											cursor="pointer"
											transition="all 0.2s"
											_hover={{
												color: "accent.fg",
												transform: "scale(1.15)",
											}}
										/>
									</Link>
								))}
							</HStack>
						</Stack>
					</Box>
				</Flex>

				{/* Bottom */}
				<Text
					textAlign="center"
					color="fg.muted"
					fontSize="xs"
					opacity={0.8}
					mt={10}
				>
					© {new Date().getFullYear()} Smart City Monitoring Platform. All
					rights reserved.
				</Text>
			</Container>
		</Box>
	);
}
