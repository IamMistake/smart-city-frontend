import { Center, Spinner } from "@chakra-ui/react";
import type { PropsWithChildren } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { ROUTES } from "@/constants/routes";
import { useAppContext } from "@/context/AppContext";

type RequireRoleRouteProps = PropsWithChildren<{
	allowedRoles: readonly string[];
}>;

export function RequireRoleRoute({
	children,
	allowedRoles,
}: RequireRoleRouteProps) {
	const { isUserLoading, role, userProfile } = useAppContext();
	const location = useLocation();

	if (isUserLoading) {
		return (
			<Center py="12">
				<Spinner colorPalette="accent" />
			</Center>
		);
	}

	if (!userProfile) {
		return (
			<Navigate to={ROUTES.login} replace state={{ from: location.pathname }} />
		);
	}

	if (role && !allowedRoles.includes(role)) {
		return <Navigate to={ROUTES.error} replace />;
	}

	return children;
}
