import { Heading, Text, VStack, Box, Icon } from "@chakra-ui/react";
import { useAppContext } from "@/context/AppContext";
import { LuShieldCheck } from "react-icons/lu";

export function PollutionPage() {
	const { role } = useAppContext();
	const isAdmin = role === "ADMIN" || role === "OPERATOR";

	return (
		<VStack align="stretch" gap="6">
			<Box>
				<Heading size="lg">Pollution</Heading>
				<Text color="fg.muted">Pollution monitoring dashboard entry point.</Text>
			</Box>

			{isAdmin ? (
				<Box p="4" bg="blue.subtle" borderRadius="md" border="1px solid" borderColor="blue.muted">
					<VStack align="start" gap="2">
						<Heading size="sm" display="flex" alignItems="center" gap="2">
							<Icon as={LuShieldCheck} /> Operator Controls
						</Heading>
						<Text fontSize="sm">
							You have access to detailed history and sensor calibration tools.
						</Text>
					</VStack>
				</Box>
			) : (
				<Box p="4" bg="gray.subtle" borderRadius="md">
					<Text fontSize="sm" color="fg.muted">
						You are viewing public data. Operators can access advanced sensor statistics.
					</Text>
				</Box>
			)}
		</VStack>
	);
}
