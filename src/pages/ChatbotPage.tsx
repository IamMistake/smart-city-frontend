import { useState } from "react";
import { Box, VStack, Input, Button, Heading, Text } from "@chakra-ui/react";

type Message = {
	role: "user" | "bot";
	text: string;
};

export function ChatbotPage() {
	const [messages, setMessages] = useState<Message[]>([]);
	const [input, setInput] = useState("");
	const [loading, setLoading] = useState(false);

	const sendMessage = async () => {
		if (!input) return;

		const userMessage: Message = { role: "user", text: input };

		setMessages((prev) => [...prev, userMessage]);
		setInput("");
		setLoading(true);

		try {
			const res = await fetch("http://localhost:8000/api/chat", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ message: userMessage.text }),
			});

			if (!res.ok) {
				throw new Error("Server error");
			}

			const data = await res.json();

			setMessages((prev) => [
				...prev,
				{ role: "bot", text: data.reply },
			]);
		} catch (error) {
			console.error(error);

			setMessages((prev) => [
				...prev,
				{ role: "bot", text: "⚠️ Cannot reach backend" },
			]);
		}

		setLoading(false);
	};

	return (
		<VStack h="100vh" gap={0}>
			{/* Header */}
			<Box w="100%" p="4" bg="white">
				<Heading size="md">Chatbot</Heading>
			</Box>

			{/* Messages */}
			<VStack flex="1" w="100%" maxW="700px" mx="auto" p="4" gap="4">
				{messages.length === 0 && <Text>Start chatting 👋</Text>}

				{messages.map((m, i) => (
					<Box key={i}>{m.text}</Box>
				))}

				{loading && <Text>Typing...</Text>}
			</VStack>

			{/* Input */}
			<Box w="100%" p="4">
				<Box display="flex" gap="2" maxW="700px" mx="auto">
					<Input
						value={input}
						onChange={(e) => setInput(e.target.value)}
						placeholder="Type message..."
						onKeyDown={(e) => e.key === "Enter" && sendMessage()}
					/>
					<Button onClick={sendMessage} disabled={loading}>
						Send
					</Button>
				</Box>
			</Box>
		</VStack>
	);
}