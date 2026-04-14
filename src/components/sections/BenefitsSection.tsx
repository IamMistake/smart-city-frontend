import { Box, Grid, Heading, Text } from "@chakra-ui/react";
import { keyframes } from "@emotion/react";

const reveal = keyframes`
	from { opacity: 0; transform: translateY(24px) scale(0.98); }
	to { opacity: 1; transform: translateY(0) scale(1); }
`;

const benefits = [
	"Faster emergency response with real-time alerts",
	"Data-driven decision making for city authorities",
	"Improved environmental awareness and monitoring",
	"Optimized infrastructure and resource usage",
];

export function BenefitsSection() {
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
			{/* blur */}
			<Box
				position="absolute"
				bottom="-20"
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
				animation={`${reveal} 600ms ease-out forwards`}
			>
				Why this platform matters
			</Heading>

			<Grid templateColumns={{ base: "1fr", md: "repeat(2, 1fr)" }} gap={6}>
				{benefits.map((b, i) => (
					<Box
						key={i}
						p={6}
						borderRadius="2xl"
						bg="bg"
						borderWidth="1px"
						borderColor="whiteAlpha.200"
						transition="all 0.3s ease"
						_hover={{
							transform: "translateY(-4px)",
							borderColor: "accent.300",
							boxShadow: "0 16px 32px rgba(0,0,0,0.2)",
						}}
						animation={`${reveal} 600ms ease-out forwards ${i * 120}ms`}
					>
						<Text fontSize="lg">{b}</Text>
					</Box>
				))}
			</Grid>
		</Box>
	);
}
