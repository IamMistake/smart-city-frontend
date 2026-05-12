import axios, {
	AxiosHeaders,
	type AxiosInstance,
	type InternalAxiosRequestConfig,
} from "axios";
import { normalizeApiError } from "@/types/api";

type CreateHttpClientOptions = {
	getAccessToken?: () => Promise<string | null>;
};

async function attachBearerToken(
	config: InternalAxiosRequestConfig,
	getAccessToken?: () => Promise<string | null>,
) {
	if (!getAccessToken) {
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

export function createHttpClient(
	baseURL: string,
	options: CreateHttpClientOptions = {},
): AxiosInstance {
	const client = axios.create({
		baseURL,
		timeout: 15000,
		headers: {
			"Content-Type": "application/json",
		},
	});

	client.interceptors.request.use((config) =>
		attachBearerToken(config, options.getAccessToken),
	);
	client.interceptors.response.use(
		(response) => response,
		(error) => Promise.reject(normalizeApiError(error)),
	);

	return client;
}
