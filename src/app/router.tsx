import { createBrowserRouter } from "react-router-dom";
import { AppLayout } from "@/app/layouts/AppLayout";
import { RequireRoleRoute } from "@/components/auth/RequireRoleRoute";
import { ROUTES } from "@/constants/routes";
import { ChatbotPage } from "@/pages/ChatbotPage";
import { EmergenciesPage } from "@/pages/EmergenciesPage";
import { LandingPage } from "@/pages/LandingPage";
import { LoginPage } from "@/pages/LoginPage";
import { MapPage } from "@/pages/MapPage";
import { NotFoundPage } from "@/pages/NotFoundPage";
import { PollutionPage } from "@/pages/PollutionPage";
import { RegisterPage } from "@/pages/RegisterPage";

const ALL_ROLES = ["CITIZEN", "OPERATOR", "AUTHORITY", "ADMIN"];

export const router = createBrowserRouter([
	{
		path: ROUTES.home,
		element: <AppLayout />,
		children: [
			{ index: true, element: <LandingPage /> },
			{ path: ROUTES.map, element: <MapPage /> },
			{
				path: ROUTES.emergencies,
				element: (
					<RequireRoleRoute allowedRoles={ALL_ROLES}>
						<EmergenciesPage />
					</RequireRoleRoute>
				),
			},
			{ path: ROUTES.pollution, element: <PollutionPage /> },
			{
				path: ROUTES.chatbot,
				element: (
					<RequireRoleRoute allowedRoles={ALL_ROLES}>
						<ChatbotPage />
					</RequireRoleRoute>
				),
			},
			{ path: ROUTES.login, element: <LoginPage /> },
			{ path: ROUTES.register, element: <RegisterPage /> },
			{ path: "*", element: <NotFoundPage /> },
		],
	},
]);
