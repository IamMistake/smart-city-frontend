import { Heading, Text, VStack } from "@chakra-ui/react";

export function EmergenciesPage() {
	return (
		<VStack align="stretch" gap="3">
			<Heading size="lg">Emergencies</Heading>
			<Text color="fg.muted">Emergency incidents dashboard entry point.</Text>
		</VStack>
	);
}
