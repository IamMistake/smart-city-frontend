import { createBrowserRouter } from "react-router-dom";
import { AppLayout } from "@/app/layouts/AppLayout";
import { ROUTES } from "@/constants/routes";
import { ChatbotPage } from "@/pages/ChatbotPage";
import { EmergenciesPage } from "@/pages/EmergenciesPage";
import { LandingPage } from "@/pages/LandingPage";
import { LoginPage } from "@/pages/LoginPage";
import { MapPage } from "@/pages/MapPage";
import { NotFoundPage } from "@/pages/NotFoundPage";
import { PollutionPage } from "@/pages/PollutionPage";
import { RegisterPage } from "@/pages/RegisterPage";

export const router = createBrowserRouter([
	{
		path: ROUTES.home,
		element: <AppLayout />,
		children: [
			{ index: true, element: <LandingPage /> },
			{ path: ROUTES.map, element: <MapPage /> },
			{ path: ROUTES.emergencies, element: <EmergenciesPage /> },
			{ path: ROUTES.pollution, element: <PollutionPage /> },
			{ path: ROUTES.chatbot, element: <ChatbotPage /> },
			{ path: ROUTES.login, element: <LoginPage /> },
			{ path: ROUTES.register, element: <RegisterPage /> },
			{ path: "*", element: <NotFoundPage /> },
		],
	},
]);
