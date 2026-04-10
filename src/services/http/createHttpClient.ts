import axios, {
	AxiosHeaders,
	type AxiosInstance,
	type InternalAxiosRequestConfig,
} from "axios";
import { normalizeApiError } from "@/types/api";
import { getAccessToken } from "@/services/http/authToken";

async function attachBearerToken(config: InternalAxiosRequestConfig) {
	// Skip if explicitly requested or if it's a health check
	const skipAuth = config.headers.get("X-Skip-Auth") === "true";
	const isHealthCheck = config.url === "/health" || config.url === "/api/health/";

	if (skipAuth || isHealthCheck) {
		config.headers.delete("X-Skip-Auth");
		return config;
	}

	const token = await getAccessToken();

	if (!token) {
		return config;
	}

	const headers = AxiosHeaders.from(config.headers);

	if (!headers.has("Authorization")) {
		headers.set("Authorization", `Bearer ${token}`);
	}

	config.headers = headers;

	return config;
}

export function createHttpClient(baseURL: string): AxiosInstance {
	const client = axios.create({
		baseURL,
		timeout: 15000,
		headers: {
			"Content-Type": "application/json",
		},
	});

	client.interceptors.request.use(async (config) => attachBearerToken(config));
	client.interceptors.response.use(
		(response) => response,
		(error) => Promise.reject(normalizeApiError(error)),
	);

	return client;
}
