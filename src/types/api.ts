import axios from "axios";

export type ApiError = {
	status?: number;
	message: string;
};

export function normalizeApiError(error: unknown): ApiError {
	if (axios.isAxiosError(error)) {
		const detail = error.response?.data?.detail;
		const detailMessage =
			typeof detail === "string"
				? detail
				: typeof detail?.message === "string"
					? detail.message
					: undefined;

		return {
			status: error.response?.status,
			message:
				detailMessage ??
				error.response?.data?.message ??
				error.message ??
				"Request failed",
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
