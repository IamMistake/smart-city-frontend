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

			if (!res.ok) throw new Error("Server error");

			const data = await res.json();

			setMessages((prev) => [
				...prev,
				{ role: "bot", text: data.reply },
			]);
		} catch (error) {
			setMessages((prev) => [
				...prev,
				{ role: "bot", text: "⚠️ Cannot reach backend" },
			]);
		}

		setLoading(false);
	};

	return (
		<VStack h="100vh" gap={0} bg="#F2F2F7">
			{/* Header */}
			<Box w="100%" p="4" bg="white" boxShadow="sm">
				<Heading size="md">💬 Smart City Chat</Heading>
			</Box>

			{/* Messages */}
			<VStack
				flex="1"
				w="100%"
				maxW="700px"
				mx="auto"
				p="4"
				gap="3"
				overflowY="auto"
			>
				{messages.length === 0 && (
					<Text color="gray.500">Start chatting 👋</Text>
				)}

				{messages.map((m, i) => (
					<Box
						key={i}
						alignSelf={m.role === "user" ? "flex-end" : "flex-start"}
						bg={m.role === "user" ? "#007AFF" : "#E5E5EA"}
						color={m.role === "user" ? "white" : "black"}
						px="4"
						py="2"
						borderRadius="18px"
						maxW="70%"
						fontSize="14px"
						lineHeight="1.4"
						boxShadow="sm"
					>
						{m.text}
					</Box>
				))}

				{loading && (
					<Box
						alignSelf="flex-start"
						bg="#E5E5EA"
						px="4"
						py="2"
						borderRadius="18px"
						fontSize="14px"
					>
						Typing...
					</Box>
				)}
			</VStack>

			{/* Input */}
			<Box w="100%" p="3" bg="white" borderTop="1px solid #eee">
				<Box display="flex" gap="2" maxW="700px" mx="auto">
					<Input
						value={input}
						onChange={(e) => setInput(e.target.value)}
						placeholder="iMessage..."
						borderRadius="full"
						bg="gray.100"
						px="4"
						onKeyDown={(e) => e.key === "Enter" && sendMessage()}
					/>
					<Button
						onClick={sendMessage}
						borderRadius="full"
						colorScheme="blue"
						px="5"
						isDisabled={loading}
					>
						Send
					</Button>
				</Box>
			</Box>
		</VStack>
	);
}