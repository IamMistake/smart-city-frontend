import { createHttpClient } from "@/services/http/createHttpClient";
import { getDefaultAccessToken } from "@/services/http/authToken";

const baseURL =
	import.meta.env.VITE_FASTAPI_API_BASE_URL?.trim() || "http://localhost:8000";

export const fastapiClient = createHttpClient(baseURL, {
	getAccessToken: getDefaultAccessToken,
});
