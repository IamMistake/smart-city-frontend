import {
	createContext,
	useContext,
	useMemo,
	useState,
	type PropsWithChildren,
} from "react";

type AppContextValue = {
	selectedCity: string;
	setSelectedCity: (city: string) => void;
};

const AppContext = createContext<AppContextValue | null>(null);

export function AppContextProvider({ children }: PropsWithChildren) {
	const [selectedCity, setSelectedCity] = useState("Skopje");
	const value = useMemo(
		() => ({ selectedCity, setSelectedCity }),
		[selectedCity],
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
