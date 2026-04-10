import { Box, VStack, Heading, Text, HStack } from "@chakra-ui/react";
import { keyframes } from "@emotion/react";

const reveal = keyframes`
	from { opacity: 0; transform: translateY(24px) scale(0.98); }
	to { opacity: 1; transform: translateY(0) scale(1); }
`;

const steps = [
	{
		title: "Collect Data",
		desc: "Sensors and city systems continuously gather real-time data.",
	},
	{
		title: "Analyze",
		desc: "AI processes the data to detect patterns and anomalies.",
	},
	{
		title: "Act",
		desc: "Authorities and citizens take action based on insights.",
	},
];

export function HowItWorksSection() {
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
				top="-20"
				left="-20"
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
				How it works
			</Heading>

			<VStack gap={6}>
				{steps.map((step, i) => (
					<Box
						key={i}
						w="100%"
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
						<HStack align="start" gap={4}>
							<Box
								minW="42px"
								h="42px"
								borderRadius="full"
								bg="accent.500"
								color="white"
								display="flex"
								alignItems="center"
								justifyContent="center"
								fontWeight="bold"
							>
								{i + 1}
							</Box>

							<Box>
								<Text fontWeight="bold" fontSize="lg">
									{step.title}
								</Text>
								<Text color="fg.muted">{step.desc}</Text>
							</Box>
						</HStack>
					</Box>
				))}
			</VStack>
		</Box>
	);
}
