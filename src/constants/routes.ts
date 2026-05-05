export const ROUTES = {
	home: "/",
	map: "/map",
	emergencies: "/emergencies",
	pollution: "/pollution",
	chatbot: "/chatbot",
	login: "/auth/login",
	register: "/auth/register",
	error: "/error",
} as const;

export const ALL_ROLES = ["CITIZEN", "OPERATOR", "AUTHORITY", "ADMIN"] as const;
