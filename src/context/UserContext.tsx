import {
	createContext,
	useContext,
	useEffect,
	useState,
	type PropsWithChildren,
} from "react";
import { useAuth } from "@clerk/react";
import { checkSpringAuthenticatedUser, type AuthenticatedUserResponse } from "@/services/api/authService";

type UserContextValue = {
	userProfile: AuthenticatedUserResponse | null;
	isLoading: boolean;
	role: string | null;
};

const UserContext = createContext<UserContextValue | null>(null);

export function UserContextProvider({ children }: PropsWithChildren) {
	const { isSignedIn, isLoaded: isAuthLoaded } = useAuth();
	const [userProfile, setUserProfile] = useState<AuthenticatedUserResponse | null>(null);
	const [isLoading, setIsLoading] = useState(false);

	useEffect(() => {
		if (isAuthLoaded && isSignedIn) {
			setIsLoading(true);
			checkSpringAuthenticatedUser()
				.then((profile) => {
					setUserProfile(profile);
				})
				.catch((err) => {
					console.error("Failed to fetch user profile", err);
				})
				.finally(() => {
					setIsLoading(false);
				});
		} else if (isAuthLoaded && !isSignedIn) {
			setUserProfile(null);
			setIsLoading(false);
		}
	}, [isSignedIn, isAuthLoaded]);

	const role = userProfile?.role ?? null;

	return (
		<UserContext.Provider value={{ userProfile, isLoading, role }}>
			{children}
		</UserContext.Provider>
	);
}

export function useUserContext() {
	const context = useContext(UserContext);
	if (!context) {
		throw new Error("useUserContext must be used within UserContextProvider");
	}
	return context;
}
