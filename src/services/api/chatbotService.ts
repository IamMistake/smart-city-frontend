import type {
	ChatMessage,
	ChatbotModelsResponse,
	ChatbotReplyResponse,
} from "@/models/chatbot";
import { fastapiClient } from "@/services/http/fastapiClient";

type ChatbotApiMessage = {
	role: "user" | "assistant";
	text: string;
};

function toApiMessage(message: ChatMessage): ChatbotApiMessage {
	return {
		role: message.role === "bot" ? "assistant" : "user",
		text: message.text,
	};
}

export async function fetchChatbotModels(): Promise<ChatbotModelsResponse> {
	const { data } = await fastapiClient.get<ChatbotModelsResponse>(
		"/api/chatbot/models",
	);
	return data;
}

export async function sendChatbotMessage(payload: {
	messages: ChatMessage[];
	model?: string;
}): Promise<ChatbotReplyResponse> {
	const { data } = await fastapiClient.post<ChatbotReplyResponse>(
		"/api/chatbot/messages",
		{
			messages: payload.messages.map(toApiMessage),
			...(payload.model ? { model: payload.model } : {}),
		},
	);

	return data;
}
