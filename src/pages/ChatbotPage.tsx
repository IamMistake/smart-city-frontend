import { Heading, Text, VStack } from "@chakra-ui/react";

export function ChatbotPage() {
	return (
		<VStack align="stretch" gap="3">
			<Heading size="lg">Chatbot</Heading>
			<Text color="fg.muted">LLM assistant interface entry point.</Text>
		</VStack>
	);
}
