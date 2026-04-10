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

type FastapiAuthenticatedUserResponse = {
	id: string;
	clerk_user_id: string;
	email: string;
	full_name: string | null;
	role: string;
	avatar_url: string | null;
	is_active: boolean;
};

function normalizeAuthenticatedUser(
	response: AuthenticatedUserResponse | FastapiAuthenticatedUserResponse,
): AuthenticatedUserResponse {
	if ("clerkUserId" in response) {
		return response;
	}

	return {
		id: response.id,
		clerkUserId: response.clerk_user_id,
		email: response.email,
		fullName: response.full_name,
		role: response.role,
		avatarUrl: response.avatar_url,
		isActive: response.is_active,
	};
}

function resolveErrorMessage(error: unknown) {
	const apiError = error as ApiError;
	return apiError?.message || "Authenticated request failed";
}

export async function checkSpringAuthenticatedUser() {
	try {
		const { data } = await springClient.get<AuthenticatedUserResponse>(
			AUTH_ME_ENDPOINT,
		);
		return normalizeAuthenticatedUser(data);
	} catch (error) {
		throw new Error(resolveErrorMessage(error));
	}
}

export async function checkFastapiAuthenticatedUser() {
	try {
		const { data } = await fastapiClient.get<FastapiAuthenticatedUserResponse>(
			AUTH_ME_ENDPOINT,
		);
		return normalizeAuthenticatedUser(data);
	} catch (error) {
		throw new Error(resolveErrorMessage(error));
	}
}
