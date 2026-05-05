import { useAuth } from "@clerk/react";
import { Navigate } from "react-router-dom";
import { ROUTES } from "@/constants/routes";

interface RequireGuestRouteProps {
	children: React.ReactNode;
	redirectTo?: string;
}

export const RequireGuestRoute = ({
	children,
	redirectTo = ROUTES.home,
}: RequireGuestRouteProps) => {
	const { isSignedIn, isLoaded } = useAuth();

	if (!isLoaded) return null;

	if (isSignedIn) {
		return <Navigate to={redirectTo} replace />;
	}

	return <>{children}</>;
};
