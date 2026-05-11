type AccessTokenGetter = () => Promise<string | null> | string | null;

let defaultAccessTokenGetter: AccessTokenGetter = async () => null;
let templateAccessTokenGetter: AccessTokenGetter = async () => null;

export function setDefaultAccessTokenGetter(getter: AccessTokenGetter) {
	defaultAccessTokenGetter = getter;
}

export function setTemplateAccessTokenGetter(getter: AccessTokenGetter) {
	templateAccessTokenGetter = getter;
}

export async function getDefaultAccessToken() {
	return await defaultAccessTokenGetter();
}

export async function getTemplateAccessToken() {
	return await templateAccessTokenGetter();
}
