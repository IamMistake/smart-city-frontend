import type { PropsWithChildren } from "react";
import { Provider } from "@/components/ui/provider";
import { AppContextProvider } from "@/context/AppContext";

export function AppProviders({ children }: PropsWithChildren) {
	return (
		<Provider>
			<AppContextProvider>{children}</AppContextProvider>
		</Provider>
	);
}
