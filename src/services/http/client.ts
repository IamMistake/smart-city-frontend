import axios, {
	AxiosHeaders,
	type AxiosInstance,
	type InternalAxiosRequestConfig,
} from "axios";
import { normalizeApiError } from "@/types/api";
import { getAccessToken } from "@/utils/storage";

const API_BASE_URL =
	import.meta.env.VITE_API_BASE_URL?.trim() || "http://localhost:8080";

class HttpClient {
	private readonly axiosInstance: AxiosInstance;

	constructor() {
		this.axiosInstance = axios.create({
			baseURL: API_BASE_URL,
			timeout: 15000,
			headers: {
				"Content-Type": "application/json",
			},
		});

		this.initializeInterceptors();
	}

	private initializeInterceptors() {
		this.axiosInstance.interceptors.request.use((config) => {
			return this.attachBearerToken(config);
		});

		this.axiosInstance.interceptors.response.use(
			(response) => response,
			(error) => Promise.reject(normalizeApiError(error)),
		);
	}

	private attachBearerToken(config: InternalAxiosRequestConfig) {
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

	public get instance() {
		return this.axiosInstance;
	}
}

export const httpClient = new HttpClient().instance;
