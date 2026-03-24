import { Heading, Text, VStack } from "@chakra-ui/react";

export function NotFoundPage() {
	return (
		<VStack align="stretch" gap="3">
			<Heading size="lg">Page not found</Heading>
			<Text color="fg.muted">The route you requested does not exist.</Text>
		</VStack>
	);
}
