const ACCESS_TOKEN_KEY = "smart-city-access-token";

function canUseStorage() {
	return typeof window !== "undefined" && typeof localStorage !== "undefined";
}

export function getAccessToken() {
	if (!canUseStorage()) {
		return null;
	}

	return localStorage.getItem(ACCESS_TOKEN_KEY);
}

export function setAccessToken(token: string) {
	if (!canUseStorage()) {
		return;
	}

	localStorage.setItem(ACCESS_TOKEN_KEY, token);
}

export function clearAccessToken() {
	if (!canUseStorage()) {
		return;
	}

	localStorage.removeItem(ACCESS_TOKEN_KEY);
}
