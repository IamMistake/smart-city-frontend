import {
	createContext,
	useContext,
	useEffect,
	useMemo,
	useState,
	type PropsWithChildren,
} from "react";
import { useAuth } from "@clerk/react";
import {
	checkSpringAuthenticatedUser,
	type AuthenticatedUserResponse,
} from "@/services/api/authService";

type AppContextValue = {
	selectedCity: string;
	setSelectedCity: (city: string) => void;
	userProfile: AuthenticatedUserResponse | null;
	isUserLoading: boolean;
	role: string | null;
};

const AppContext = createContext<AppContextValue | null>(null);

export function AppContextProvider({ children }: PropsWithChildren) {
	const [selectedCity, setSelectedCity] = useState("Skopje");
	const { isSignedIn, isLoaded: isAuthLoaded } = useAuth();
	const [userProfile, setUserProfile] =
		useState<AuthenticatedUserResponse | null>(null);
	const [isUserLoading, setIsUserLoading] = useState(false);

	useEffect(() => {
		let active = true;

		if (isAuthLoaded && isSignedIn) {
			Promise.resolve().then(() => {
				if (active) setIsUserLoading(true);
			});
			checkSpringAuthenticatedUser()
				.then((profile) => {
					if (active) setUserProfile(profile);
				})
				.catch((err) => {
					console.error("Failed to fetch user profile", err);
				})
				.finally(() => {
					if (active) setIsUserLoading(false);
				});
		} else if (isAuthLoaded && !isSignedIn) {
			Promise.resolve().then(() => {
				if (active) {
					setUserProfile(null);
					setIsUserLoading(false);
				}
			});
		}

		return () => {
			active = false;
		};
	}, [isSignedIn, isAuthLoaded]);

	const role = userProfile?.role ?? null;

	const value = useMemo(
		() => ({
			selectedCity,
			setSelectedCity,
			userProfile,
			isUserLoading,
			role,
		}),
		[selectedCity, userProfile, isUserLoading, role],
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
