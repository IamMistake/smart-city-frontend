import type { PropsWithChildren } from "react";
import { Provider } from "@/components/ui/provider";
import { AppContextProvider } from "@/context/AppContext";
import { ClerkAuthBridge } from "@/app/providers/ClerkAuthBridge";
import { CurrentUserSync } from "@/app/providers/CurrentUserSync";
import { UserContextProvider } from "@/context/UserContext";

export function AppProviders({ children }: PropsWithChildren) {
	return (
		<Provider>
			<ClerkAuthBridge />
			<CurrentUserSync />
			<UserContextProvider>
				<AppContextProvider>{children}</AppContextProvider>
			</UserContextProvider>
		</Provider>
	);
}
