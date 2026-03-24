import { keyframes } from "@emotion/react";
import {
	Badge,
	Box,
	Button,
	Grid,
	GridItem,
	Heading,
	HStack,
	Text,
	VStack,
} from "@chakra-ui/react";
import { NavLink } from "react-router-dom";
import { ROUTES } from "@/constants/routes";

// Aesthetic direction: editorial civic-tech - asymmetric grid, layered cards, and sharp diagonal accents.

const headlineReveal = keyframes`
	from {
		opacity: 0;
		transform: translateY(24px);
	}
	to {
		opacity: 1;
		transform: translateY(0);
	}
`;

const subtextReveal = keyframes`
	from {
		opacity: 0;
		transform: translateY(18px);
	}
	to {
		opacity: 1;
		transform: translateY(0);
	}
`;

const ctaReveal = keyframes`
	from {
		opacity: 0;
		transform: translateY(14px) scale(0.98);
	}
	to {
		opacity: 1;
		transform: translateY(0) scale(1);
	}
`;

const panelReveal = keyframes`
	from {
		opacity: 0;
		transform: translateX(36px) translateY(-18px);
	}
	to {
		opacity: 1;
		transform: translateX(0) translateY(0);
	}
`;

type HeroSectionProps = {
	city: string;
};

export function HeroSection({ city }: HeroSectionProps) {
	return (
		<Box
			as="section"
			aria-labelledby="hero-title"
			position="relative"
			overflow="hidden"
			borderWidth="1px"
			borderColor="border"
			borderRadius={{ base: "2xl", lg: "3xl" }}
			bg="bg.panel"
			px={{ base: "5", md: "8", lg: "12" }}
			py={{ base: "8", md: "10", lg: "12" }}
		>
			<Box
				position="absolute"
				top={{ base: "-24", lg: "-28" }}
				right={{ base: "-24", lg: "-20" }}
				w={{ base: "52", lg: "72" }}
				h={{ base: "52", lg: "72" }}
				bgGradient="radial(circle at center, accent.subtle, transparent 70%)"
				pointerEvents="none"
			/>
			<Box
				position="absolute"
				left={{ base: "-28", lg: "-16" }}
				bottom={{ base: "10", lg: "16" }}
				w={{ base: "56", lg: "80" }}
				h="1px"
				bg="accent.emphasized"
				transform="rotate(-18deg)"
				opacity="0.6"
				pointerEvents="none"
			/>

			<Grid
				templateColumns={{ base: "1fr", lg: "minmax(0, 7fr) minmax(0, 5fr)" }}
				gap={{ base: "8", lg: "0" }}
			>
				<GridItem>
					<VStack align="start" gap={{ base: "5", md: "6" }} pr={{ lg: "14" }}>
						<Badge colorPalette="accent" borderRadius="full" px="3" py="1">
							City Pulse: Live
						</Badge>

						<Heading
							id="hero-title"
							as="h1"
							size={{ base: "2xl", md: "3xl", lg: "4xl" }}
							lineHeight={{ base: "1.1", lg: "1.02" }}
							maxW="14ch"
							opacity="0"
							animation={`${headlineReveal} 720ms cubic-bezier(0.2, 0.8, 0.2, 1) 80ms forwards`}
						>
							Command the city in
							<Text as="span" color="accent.fg">
								real time.
							</Text>
						</Heading>

						<Text
							fontSize={{ base: "md", md: "lg" }}
							color="fg.muted"
							maxW="56ch"
							opacity="0"
							animation={`${subtextReveal} 680ms cubic-bezier(0.2, 0.8, 0.2, 1) 260ms forwards`}
						>
							From traffic surges to emergency incidents, your operations room
							gets one clear, actionable picture. Monitoring currently focused
							on
							{` `}
							<Text as="span" color="fg" fontWeight="semibold">
								{city}
							</Text>
							.
						</Text>

						<HStack
							gap="3"
							flexWrap="wrap"
							opacity="0"
							animation={`${ctaReveal} 620ms cubic-bezier(0.2, 0.8, 0.2, 1) 430ms forwards`}
						>
							<Button
								asChild
								colorPalette="accent"
								size="lg"
								borderRadius="full"
								px="7"
								_focusVisible={{
									outline: "3px solid",
									outlineColor: "accent.focusRing",
									outlineOffset: "2px",
								}}
							>
								<NavLink to={ROUTES.map}>Explore Live Map</NavLink>
							</Button>
							<Button
								asChild
								variant="outline"
								size="lg"
								borderRadius="full"
								borderColor="accent.emphasized"
								color="fg"
								_focusVisible={{
									outline: "3px solid",
									outlineColor: "accent.focusRing",
									outlineOffset: "2px",
								}}
							>
								<NavLink to={ROUTES.emergencies}>View Incidents</NavLink>
							</Button>
						</HStack>
					</VStack>
				</GridItem>

				<GridItem>
					<Box
						position="relative"
						mt={{ base: "0", lg: "8" }}
						ml={{ lg: "8" }}
						opacity="0"
						animation={`${panelReveal} 760ms cubic-bezier(0.2, 0.8, 0.2, 1) 360ms forwards`}
					>
						<Box
							borderWidth="1px"
							borderColor="accent.emphasized"
							bg="bg"
							borderRadius="2xl"
							p={{ base: "5", md: "6" }}
							boxShadow="0 20px 45px -25px rgba(10, 30, 20, 0.45)"
						>
							<VStack align="start" gap="4">
								<Text color="fg.muted" fontSize="sm" letterSpacing="wide">
									Operation Snapshot
								</Text>
								<Heading as="h2" size={{ base: "lg", md: "xl" }}>
									3 critical streams,
									<Text as="span" color="accent.fg">
										1 command surface.
									</Text>
								</Heading>
								<HStack gap="2" flexWrap="wrap">
									<Badge
										colorPalette="accent"
										px="2.5"
										py="1"
										borderRadius="md"
									>
										Emergency
									</Badge>
									<Badge
										colorPalette="accent"
										px="2.5"
										py="1"
										borderRadius="md"
									>
										Pollution
									</Badge>
									<Badge
										colorPalette="accent"
										px="2.5"
										py="1"
										borderRadius="md"
									>
										Police Activity
									</Badge>
								</HStack>
							</VStack>
						</Box>

						<Box
							position="absolute"
							top={{ base: "-3", md: "-4" }}
							right={{ base: "-2", md: "-4" }}
							px="3"
							py="1"
							bg="accent.solid"
							color="accent.contrast"
							borderRadius="full"
							fontSize="xs"
							fontWeight="bold"
							textTransform="uppercase"
							letterSpacing="widest"
						>
							Live Feed
						</Box>

						<Box
							position="absolute"
							left={{ base: "2", md: "-6" }}
							bottom={{ base: "-4", md: "-6" }}
							px="4"
							py="2"
							bg="bg.panel"
							borderWidth="1px"
							borderColor="border"
							borderRadius="lg"
							boxShadow="lg"
							transform="rotate(-4deg)"
						>
							<Text fontSize="sm" fontWeight="semibold" color="fg">
								Response latency under 2s target
							</Text>
						</Box>
					</Box>
				</GridItem>
			</Grid>
		</Box>
	);
}
