type AccessTokenGetter = () => Promise<string | null> | string | null;

let accessTokenGetter: AccessTokenGetter = async () => null;

export function setAccessTokenGetter(getter: AccessTokenGetter) {
	accessTokenGetter = getter;
}

export async function getAccessToken() {
	return await accessTokenGetter();
}
