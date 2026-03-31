import type { PropsWithChildren } from "react";
import { Provider } from "@/components/ui/provider";
import { AppContextProvider } from "@/context/AppContext";
import { ClerkAuthBridge } from "@/app/providers/ClerkAuthBridge";

export function AppProviders({ children }: PropsWithChildren) {
	return (
		<Provider>
			<ClerkAuthBridge />
			<AppContextProvider>{children}</AppContextProvider>
		</Provider>
	);
}
