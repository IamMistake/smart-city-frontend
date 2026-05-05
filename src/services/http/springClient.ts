import { createHttpClient } from "@/services/http/createHttpClient";

const baseURL =
	import.meta.env.VITE_SPRING_API_BASE_URL?.trim() ||
	import.meta.env.VITE_API_BASE_URL?.trim() ||
	"http://localhost:8080";

export const springClient = createHttpClient(baseURL);
