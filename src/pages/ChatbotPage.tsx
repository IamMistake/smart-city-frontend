import { useState } from "react";
import {
	Box,
	VStack,
	Input,
	Button,
	Heading,
	Text,
} from "@chakra-ui/react";

type Message = {
	role: "user" | "bot";
	text: string;
};

export function ChatbotPage() {
	const [messages, setMessages] = useState<Message[]>([]);
	const [input, setInput] = useState("");

	const replies = [
		"🌍 I'm here to help!",
		"🚦 Traffic looks clear!",
		"🌫 Air quality is moderate today",
	];

	const sendMessage = () => {
		if (!input) return;

		const randomReply =
			replies[Math.floor(Math.random() * replies.length)];

		setMessages((prev) => [
			...prev,
			{ role: "user", text: input },
		]);

		setTimeout(() => {
			setMessages((prev) => [
				...prev,
				{ role: "bot", text: randomReply },
			]);
		}, 500);

		setInput("");
	};

	return (
		<VStack h="100vh" spacing={0} bgGradient="linear(to-br, blue.50, purple.100)">

			{/* Header */}
			<Box w="100%" p="4" bg="white" boxShadow="sm">
				<Heading size="md">🤖 Smart City Chatbot</Heading>
				<Text fontSize="sm" color="gray.500">
					Ask me anything about your city
				</Text>
			</Box>

			{/* Messages */}
			<VStack
				flex="1"
				w="100%"
				maxW="700px"
				mx="auto"
				p="4"
				overflowY="auto"
				spacing="4"
			>
				{messages.map((m, i) => (
					<Box
						key={i}
						alignSelf={m.role === "user" ? "flex-end" : "flex-start"}
						bg={m.role === "user" ? "blue.500" : "white"}
						color={m.role === "user" ? "white" : "black"}
						px="4"
						py="2"
						borderRadius="20px"
						boxShadow="md"
						maxW="70%"
					>
						{m.text}
					</Box>
				))}
			</VStack>

			{/* Input */}
			<Box
				w="100%"
				p="4"
				bg="white"
				borderTop="1px solid #eee"
			>
				<Box display="flex" gap="2" maxW="700px" mx="auto">
					<Input
						value={input}
						onChange={(e) => setInput(e.target.value)}
						placeholder="💬 Type your message..."
						bg="gray.100"
						borderRadius="full"
						px="4"
						onKeyDown={(e) => e.key === "Enter" && sendMessage()}
					/>
					<Button
						colorScheme="blue"
						borderRadius="full"
						px="6"
						onClick={sendMessage}
					>
						Send 🚀
					</Button>
				</Box>
			</Box>
		</VStack>
	);
}