import {
	createElement,
	type ComponentType,
	type PropsWithChildren,
	StrictMode,
} from "react";
import { createRoot } from "react-dom/client";
import { ClerkProvider } from "@clerk/react";
import "@fontsource-variable/manrope/wght.css";
import "./index.css";
import App from "./App";
import { AppProviders } from "@/app/providers/AppProviders";
import 'leaflet/dist/leaflet.css';

type ViteClerkProviderProps = PropsWithChildren<{
	afterSignOutUrl?: string;
}>;

const clerkProvider = ClerkProvider as ComponentType<ViteClerkProviderProps>;

createRoot(document.getElementById("root")!).render(
	<StrictMode>
		{createElement(
			clerkProvider,
			{ afterSignOutUrl: "/" },
			<AppProviders>
				<App />
			</AppProviders>,
		)}
	</StrictMode>,
);
