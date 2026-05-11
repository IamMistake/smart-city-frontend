import { useAuth } from "@clerk/react";
import { useEffect } from "react";
import {
	setDefaultAccessTokenGetter,
	setTemplateAccessTokenGetter,
} from "@/services/http/authToken";

const clerkJwtTemplate = import.meta.env.VITE_CLERK_JWT_TEMPLATE?.trim();

export function ClerkAuthBridge() {
	const { getToken } = useAuth();

	useEffect(() => {
		setDefaultAccessTokenGetter(() => getToken());
		setTemplateAccessTokenGetter(() => {
			if (!clerkJwtTemplate) {
				return getToken();
			}

			return getToken({ template: clerkJwtTemplate });
		});

		return () => {
			setDefaultAccessTokenGetter(async () => null);
			setTemplateAccessTokenGetter(async () => null);
		};
	}, [getToken]);

	return null;
}
