export type ChatMessageRole = "user" | "bot";

export type ChatMessage = {
	role: ChatMessageRole;
	text: string;
};

export type ChatbotModelOption = {
	id: string;
	label: string;
	provider: string;
	model: string;
	is_default: boolean;
};

export type ChatbotModelsResponse = {
	models: ChatbotModelOption[];
	defaultModel: string;
};

export type ChatbotReplyResponse = {
	reply: string;
	provider: string;
	model: string;
};
