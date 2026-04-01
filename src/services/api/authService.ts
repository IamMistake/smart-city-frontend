import { fastapiClient } from "@/services/http/fastapiClient";
import { springClient } from "@/services/http/springClient";
import type { ApiError } from "@/types/api";

const AUTH_ME_ENDPOINT = "/api/auth/me";

export type AuthenticatedUserResponse = {
	id: string;
	clerkUserId: string;
	email: string;
	fullName: string | null;
	role: string;
	avatarUrl: string | null;
	isActive: boolean;
};

function resolveErrorMessage(error: unknown) {
	const apiError = error as ApiError;
	return apiError?.message || "Authenticated request failed";
}

export async function checkSpringAuthenticatedUser() {
	try {
		const { data } = await springClient.get<AuthenticatedUserResponse>(
			AUTH_ME_ENDPOINT,
		);
		return data;
	} catch (error) {
		throw new Error(resolveErrorMessage(error));
	}
}

export async function checkFastapiAuthenticatedUser() {
	try {
		const { data } = await fastapiClient.get<AuthenticatedUserResponse>(
			AUTH_ME_ENDPOINT,
		);
		return data;
	} catch (error) {
		throw new Error(resolveErrorMessage(error));
	}
}
