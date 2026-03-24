import axios, {
	AxiosHeaders,
	type AxiosInstance,
	type InternalAxiosRequestConfig,
} from "axios";
import { normalizeApiError } from "@/types/api";
import { getAccessToken } from "@/utils/storage";

function attachBearerToken(config: InternalAxiosRequestConfig) {
	const token = getAccessToken();

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

	client.interceptors.request.use((config) => attachBearerToken(config));
	client.interceptors.response.use(
		(response) => response,
		(error) => Promise.reject(normalizeApiError(error)),
	);

	return client;
}
