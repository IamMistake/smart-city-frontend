import { Heading, Text, VStack } from "@chakra-ui/react";

export function PollutionPage() {
	return (
		<VStack align="stretch" gap="3">
			<Heading size="lg">Pollution</Heading>
			<Text color="fg.muted">Pollution monitoring dashboard entry point.</Text>
		</VStack>
	);
}
