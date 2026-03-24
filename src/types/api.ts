import axios from "axios";

export type ApiError = {
	status?: number;
	message: string;
};

export function normalizeApiError(error: unknown): ApiError {
	if (axios.isAxiosError(error)) {
		return {
			status: error.response?.status,
			message:
				error.response?.data?.message ?? error.message ?? "Request failed",
		};
	}

	if (error instanceof Error) {
		return {
			message: error.message,
		};
	}

	return {
		message: "Unexpected error",
	};
}
