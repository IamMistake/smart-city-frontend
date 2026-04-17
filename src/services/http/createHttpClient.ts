import axios, {
	AxiosHeaders,
	type AxiosInstance,
	type InternalAxiosRequestConfig,
} from "axios";
import { normalizeApiError } from "@/types/api";
import { getAccessToken } from "@/services/http/authToken";

async function attachBearerToken(config: InternalAxiosRequestConfig) {
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

/* 	client.interceptors.request.use(async (config) => attachBearerToken(config)); */
client.interceptors.request.use((config) => {
  const token = getAccessToken(); // sync

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});
	client.interceptors.response.use(
		(response) => response,
		(error) => Promise.reject(normalizeApiError(error)),
	);

	return client;
}
