import { useAuth } from "@clerk/react";
import { useEffect, useRef } from "react";
import { springClient } from "@/services/http/springClient";

const clerkJwtTemplate = import.meta.env.VITE_CLERK_JWT_TEMPLATE?.trim();

export function CurrentUserSync() {
	const { getToken, isLoaded, isSignedIn, userId } = useAuth();
	const syncedUserIdsRef = useRef(new Set<string>());
	const inFlightUserIdsRef = useRef(new Set<string>());

	useEffect(() => {
		if (!isLoaded || !isSignedIn || !userId) {
			return;
		}

		if (syncedUserIdsRef.current.has(userId)) {
			return;
		}

		if (inFlightUserIdsRef.current.has(userId)) {
			return;
		}

		inFlightUserIdsRef.current.add(userId);

		void (async () => {
			try {
				const token = clerkJwtTemplate
					? await getToken({ template: clerkJwtTemplate })
					: await getToken();

				if (!token) {
					return;
				}

				await springClient.get("/api/auth/me", {
					headers: {
						Authorization: `Bearer ${token}`,
					},
				});

				syncedUserIdsRef.current.add(userId);
			} catch (error) {
				console.error("Failed to sync current user profile", error);
			} finally {
				inFlightUserIdsRef.current.delete(userId);
			}
		})();
	}, [getToken, isLoaded, isSignedIn, userId]);

	return null;
}
