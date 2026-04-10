import { useAuth } from "@clerk/react";
import { useEffect } from "react";
import { setAccessTokenGetter } from "@/services/http/authToken";

const clerkJwtTemplate = import.meta.env.VITE_CLERK_JWT_TEMPLATE?.trim();

export function ClerkAuthBridge() {
	const { getToken } = useAuth();

	useEffect(() => {
		setAccessTokenGetter(() => {
			if (clerkJwtTemplate) {
				return getToken({ template: clerkJwtTemplate });
			}

			return getToken();
		});

		return () => {
			setAccessTokenGetter(async () => null);
		};
	}, [getToken]);

	return null;
}
