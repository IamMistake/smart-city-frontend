import { useAuth } from "@clerk/react";
import { useEffect } from "react";
import { setAccessTokenGetter } from "@/services/http/authToken";

export function ClerkAuthBridge() {
	const { getToken } = useAuth();

	useEffect(() => {
		setAccessTokenGetter(() => getToken());

		return () => {
			setAccessTokenGetter(async () => null);
		};
	}, [getToken]);

	return null;
}
