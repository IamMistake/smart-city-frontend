import { useAuth } from "@clerk/react";
import { Center, Spinner } from "@chakra-ui/react";
import type { PropsWithChildren } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { ROUTES } from "@/constants/routes";

export function RequireSignedInRoute({ children }: PropsWithChildren) {
	const { isLoaded, isSignedIn } = useAuth();
	const location = useLocation();

	if (!isLoaded) {
		return (
			<Center py="12">
				<Spinner colorPalette="accent" />
			</Center>
		);
	}

	if (!isSignedIn) {
		return <Navigate to={ROUTES.login} replace state={{ from: location.pathname }} />;
	}

	return children;
}
