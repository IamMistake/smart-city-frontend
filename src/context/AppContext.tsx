import {
	createContext,
	useCallback,
	useContext,
	useMemo,
	useState,
	type PropsWithChildren,
} from "react";
import {
	clearAccessToken,
	getAccessToken,
	setAccessToken,
} from "@/utils/storage";

type AppContextValue = {
	selectedCity: string;
	setSelectedCity: (city: string) => void;
	accessToken: string | null;
	setToken: (token: string | null) => void;
};

const AppContext = createContext<AppContextValue | null>(null);

export function AppContextProvider({ children }: PropsWithChildren) {
	const [selectedCity, setSelectedCity] = useState("Skopje");
	const [accessToken, setAccessTokenState] = useState<string | null>(() =>
		getAccessToken(),
	);

	const setToken = useCallback((token: string | null) => {
		setAccessTokenState(token);

		if (token) {
			setAccessToken(token);
			return;
		}

		clearAccessToken();
	}, []);

	const value = useMemo(
		() => ({ selectedCity, setSelectedCity, accessToken, setToken }),
		[selectedCity, accessToken, setToken],
	);

	return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useAppContext() {
	const context = useContext(AppContext);

	if (!context) {
		throw new Error("useAppContext must be used within AppContextProvider");
	}

	return context;
}
