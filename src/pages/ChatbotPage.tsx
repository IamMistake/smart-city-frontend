import {
	Box,
	Button,
	Flex,
	Heading,
	HStack,
	Icon,
	IconButton,
	SimpleGrid,
	Spinner,
	Text,
	Textarea,
} from "@chakra-ui/react";
import { useEffect, useRef, useState } from "react";
import { FaRobot } from "react-icons/fa";
import { LuArrowUp } from "react-icons/lu";

import type { ChatMessage } from "@/models/chatbot";
import type { PollutionData, PollutionMetric } from "@/models/pollution";
import {
	fetchChatbotModels,
	sendChatbotMessage,
} from "@/services/api/chatbotService";
import { fetchPollutionData } from "@/services/api/pollutionService";
import { normalizeApiError } from "@/types/api";

const SUGGESTED_PROMPTS = [
	"What's the air quality right now?",
	"Show me active emergencies",
	"Which areas have high pollution?",
	"Give me Skopje's temperature and pollution stats today",
	"Is there anything critical happening?",
];

const SUMMARY_METRICS: PollutionMetric[] = ["temperature", "pm25", "pm10"];

function BotAvatar(props: { boxSize?: string | number }) {
	return (
		<Flex
			align="center"
			justify="center"
			boxSize={props.boxSize ?? "10"}
			borderRadius="full"
			bg="accent.subtle"
			color="accent.fg"
			flexShrink={0}
		>
			<Icon as={FaRobot} boxSize="55%" />
		</Flex>
	);
}

export function ChatbotPage() {
	const [messages, setMessages] = useState<ChatMessage[]>([]);
	const [input, setInput] = useState("");
	const [isSending, setIsSending] = useState(false);
	const [errorText, setErrorText] = useState<string | null>(null);
	const [selectedModel, setSelectedModel] = useState<string>("");
	const messagesEndRef = useRef<HTMLDivElement | null>(null);

	useEffect(() => {
		messagesEndRef.current?.scrollIntoView({
			behavior: "smooth",
			block: "end",
		});
	}, [messages, isSending]);

	useEffect(() => {
		let isMounted = true;

		void fetchChatbotModels()
			.then((response) => {
				if (!isMounted) {
					return;
				}

				setSelectedModel(response.defaultModel);
			})
			.catch(() => {
				if (!isMounted) {
					return;
				}

				setSelectedModel("");
			});

		return () => {
			isMounted = false;
		};
	}, []);

	const sendMessage = async (messageText = input) => {
		const text = messageText.trim();
		if (!text || isSending) {
			return;
		}

		const nextMessages = [
			...messages,
			{ role: "user", text } satisfies ChatMessage,
		];

		setMessages(nextMessages);
		setInput("");
		setErrorText(null);
		setIsSending(true);

		try {
			const localReply = await buildLocalCitySummaryReply(text);
			if (localReply) {
				setMessages((prev) => [...prev, { role: "bot", text: localReply }]);
				return;
			}

			const response = await sendChatbotMessage({
				messages: nextMessages,
				...(selectedModel ? { model: selectedModel } : {}),
			});

			setMessages((prev) => [...prev, { role: "bot", text: response.reply }]);
		} catch (error) {
			const apiError = normalizeApiError(error);
			const message =
				apiError.message || "The assistant is unavailable right now.";

			setErrorText(message);
			setMessages((prev) => [
				...prev,
				{
					role: "bot",
					text: `I couldn't reach the smart city assistant right now. ${message}`,
				},
			]);
		} finally {
			setIsSending(false);
		}
	};

	const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
		if (event.key !== "Enter" || event.shiftKey) {
			return;
		}

		event.preventDefault();
		void sendMessage();
	};

	const showCharacterCount = input.length > 100;
	const showEmptyState = messages.length === 0;

	return (
		<Box
			minH={{ base: "calc(100vh - 12rem)", md: "calc(100vh - 13rem)" }}
			borderWidth="1px"
			borderColor="border"
			borderRadius="2xl"
			bg="bg.panel"
			overflow="hidden"
			display="flex"
			flexDirection="column"
		>
			<Flex
				align="center"
				justify="space-between"
				gap="4"
				px={{ base: "4", md: "5" }}
				py="4"
				borderBottom="1px solid"
				borderColor="border"
			>
				<HStack gap="3" align="center">
					<BotAvatar />
					<Box>
						<Heading size="md" letterSpacing="-0.2px">
							Smart City Chatbot
						</Heading>
						<Text fontSize="sm" color="fg.muted">
							Ask about Skopje's city conditions and events
						</Text>
					</Box>
				</HStack>
			</Flex>

			<Box
				flex="1"
				minH="0"
				overflowY="auto"
				px={{ base: "4", md: "5" }}
				py="5"
			>
				{showEmptyState ? (
					<Flex minH="100%" align="center" justify="center" py="10">
						<Box maxW="560px" textAlign="center">
							<Flex justify="center" mb="4">
								<BotAvatar boxSize="48px" />
							</Flex>
							<Heading fontSize="18px" fontWeight="500" mb="2">
								Ask me about Skopje
							</Heading>
							<Text fontSize="14px" color="fg.muted" mb="6">
								I can help with air quality, active incidents, pollution data,
								and more.
							</Text>
							<SimpleGrid columns={{ base: 1, sm: 2 }} gap="3">
								{SUGGESTED_PROMPTS.map((prompt) => (
									<Button
										key={prompt}
										variant="outline"
										borderColor="border"
										borderRadius="full"
										fontSize="13px"
										fontWeight="500"
										px="4"
										py="2"
										h="auto"
										whiteSpace="normal"
										onClick={() => {
											setInput(prompt);
											void sendMessage(prompt);
										}}
									>
										{prompt}
									</Button>
								))}
							</SimpleGrid>
						</Box>
					</Flex>
				) : (
					<Box>
						{messages.map((message, index) => (
							<Flex
								key={`${message.role}-${index}-${message.text.slice(0, 16)}`}
								justify={message.role === "user" ? "flex-end" : "flex-start"}
								mb="4"
							>
								<Box
									maxW={{ base: "85%", md: "75%" }}
									bg={message.role === "user" ? "accent.solid" : "bg.subtle"}
									color={message.role === "user" ? "accent.contrast" : "fg"}
									borderRadius="2xl"
									px="4"
									py="3"
									boxShadow="sm"
									whiteSpace="pre-wrap"
								>
									{message.text}
								</Box>
							</Flex>
						))}

						{isSending ? (
							<Flex justify="flex-start" mb="2">
								<HStack
									gap="3"
									bg="bg.subtle"
									borderRadius="2xl"
									px="4"
									py="3"
									color="fg.muted"
								>
									<Spinner size="sm" color="accent.fg" />
									<Text fontSize="sm">Thinking...</Text>
								</HStack>
							</Flex>
						) : null}
					</Box>
				)}

				<Box ref={messagesEndRef} />
			</Box>

			<Box
				borderTop="1px solid"
				borderColor="border"
				bg="bg.panel"
				px={{ base: "4", md: "5" }}
				py="3"
				flexShrink={0}
				position="sticky"
				bottom="0"
			>
				<HStack align="center" gap="2">
					<Textarea
						value={input}
						onChange={(event) => setInput(event.target.value)}
						onKeyDown={handleKeyDown}
						placeholder="Ask about Skopje..."
						resize="none"
						rows={1}
						minH="40px"
						maxH="120px"
						borderRadius="xl"
						bg="bg.subtle"
						flex="1"
						disabled={isSending}
					/>
					<IconButton
						aria-label="Send message"
						onClick={() => void sendMessage()}
						disabled={isSending || !input.trim()}
						bg="brand"
						color="white"
						size="sm"
						minW="40px"
						h="40px"
						_hover={{ bg: "accent.fg" }}
					>
						<LuArrowUp />
					</IconButton>
				</HStack>

				{showCharacterCount ? (
					<Text mt="2" textAlign="right" fontSize="11px" color="fg.muted">
						{input.length} characters
					</Text>
				) : null}

				{errorText ? (
					<Text mt="2" fontSize="11px" color="fg.muted">
						{errorText}
					</Text>
				) : null}
			</Box>
		</Box>
	);
}

async function buildLocalCitySummaryReply(message: string) {
	if (!isCitySummaryPrompt(message)) {
		return null;
	}

	const results = await Promise.allSettled(
		SUMMARY_METRICS.map((metric) => fetchPollutionData(metric)),
	);

	const byMetric = Object.fromEntries(
		results.map((result, index) => [
			SUMMARY_METRICS[index],
			result.status === "fulfilled" ? result.value : null,
		]),
	) as Record<PollutionMetric, PollutionData | null>;

	const temperature = byMetric.temperature;
	const pm25 = byMetric.pm25;
	const pm10 = byMetric.pm10;

	if (!temperature && !pm25 && !pm10) {
		return null;
	}

	const parts = ["Skopje city update for today:"];

	if (temperature?.summary.cityValue != null) {
		parts.push(
			`Temperature: ${temperature.summary.cityValue} ${temperature.unit} (${temperature.summary.statusText.toLowerCase()}).`,
		);
	}

	if (pm25?.summary.cityValue != null) {
		parts.push(
			formatMetricSummary("PM2.5", pm25, {
				includeStations: true,
			}),
		);
	}

	if (pm10?.summary.cityValue != null) {
		parts.push(
			formatMetricSummary("PM10", pm10, {
				includeStations: false,
			}),
		);
	}

	const fetchedAt = [temperature, pm25, pm10]
		.find((item) => item?.fetchedAt)
		?.fetchedAt;
	if (fetchedAt) {
		parts.push(
			`Last updated at ${new Date(fetchedAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}.`,
		);
	}

	const missingMetrics = SUMMARY_METRICS.filter((metric) => !byMetric[metric]);
	if (missingMetrics.length > 0) {
		parts.push(
			`Some data could not be loaded right now: ${missingMetrics.join(", ")}.`,
		);
	}

	return parts.join(" ");
}

function isCitySummaryPrompt(message: string) {
	const normalized = message.toLowerCase();
	const asksForTemperature =
		normalized.includes("temperature") || normalized.includes("weather");
	const asksForPollution =
		normalized.includes("pollution") ||
		normalized.includes("air quality") ||
		normalized.includes("pm2.5") ||
		normalized.includes("pm25") ||
		normalized.includes("pm10");
	const asksForSummary =
		normalized.includes("stats") ||
		normalized.includes("summary") ||
		normalized.includes("today") ||
		normalized.includes("current") ||
		normalized.includes("right now");

	return asksForTemperature && (asksForPollution || asksForSummary);
}

function formatMetricSummary(
	label: string,
	data: PollutionData,
	options: { includeStations: boolean },
) {
	const parts = [
		`${label}: ${data.summary.cityValue} ${data.unit} (${data.summary.statusText.toLowerCase()})`,
	];

	if (options.includeStations) {
		parts.push(`across ${data.coverage.activeStationCount} active stations`);
	}

	return `${parts.join(" ")}.`;
}
