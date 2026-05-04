import { Box, VStack, Heading, Text, Button } from "@chakra-ui/react";
import { NavLink } from "react-router-dom";
import { keyframes } from "@emotion/react";
import { ROUTES } from "@/constants/routes";

// Animations
const revealAnimation = keyframes`
  from { opacity: 0; transform: translateY(24px); }
  to { opacity: 1; transform: translateY(0); }
`;

const bounceAnimation = keyframes`
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.1); }
`;

export function NotFoundPage() {
	return (
		<Box
			as="section"
			display="flex"
			alignItems="center"
			justifyContent="center"
			minH="80vh"
			px={{ base: "5", md: "8", lg: "12" }}
			py={{ base: "16", md: "20" }}
			textAlign="center"
			bg="bg.panel"
			borderRadius={{ base: "2xl", md: "3xl" }}
			borderWidth="1px"
			borderColor="border"
		>
			<VStack gap={6} animation={`${revealAnimation} 600ms ease-out forwards`}>
				{/* Big 404 with bounce on hover */}
				<Heading
					size="4xl"
					bgGradient="linear(to-r, accent.subtle, accent.default)"
					bgClip="text"
					_hover={{ animation: `${bounceAnimation} 0.6s ease-in-out` }}
				>
					404
				</Heading>

				{/* Page not found */}
				<Heading
					size="lg"
					animation={`${revealAnimation} 700ms ease-out forwards`}
				>
					Page not found
				</Heading>

				{/* Description */}
				<Text
					color="fg.muted"
					maxW="60ch"
					animation={`${revealAnimation} 800ms ease-out forwards`}
				>
					The page you are looking for does not exist. Please check the URL or
					go back to the home page.
				</Text>

				{/* Go to Home button with hover scale */}
				<Button
					asChild
					colorPalette="accent"
					borderRadius="full"
					px={8}
					py={4}
					animation={`${revealAnimation} 900ms ease-out forwards`}
					_hover={{
						transform: "scale(1.05)",
						boxShadow: "0 8px 20px rgba(0,0,0,0.2)",
					}}
					transition="all 0.2s ease-in-out"
				>
					<NavLink to={ROUTES.home}>Go to Home</NavLink>
				</Button>
			</VStack>
		</Box>
	);
}
