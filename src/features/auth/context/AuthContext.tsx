import { createContext, useEffect, useState, useContext, useCallback, useMemo } from "react";
import { authServices } from "../../../services/authServices";
import type { User, LoginCredentials, SignupCredentials } from "../../../services/authServices";
import { setAccessToken, setAuthFailureHandler } from "../../../services/apiInstance";

interface AuthContextType {
    login: (credential: LoginCredentials) => Promise<void>;
    signup: (credential: SignupCredentials) => Promise<void>;
    user: User | null;
    isInitializing: boolean;
    isAuthenticated: boolean;
    logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {

    const [user, setUser] = useState<User | null>(null);
    const [isInitializing, setIsInitializing] = useState<boolean>(true);

    useEffect(() => {
        let cancelled = false; // ignores results from the discarded StrictMode run

        const initializeAuth = async () => {
            try {
                await authServices.refreshToken(); // sets the access token internally
                const userDetails = await authServices.getCurrentUser();
                if (!cancelled) setUser(userDetails);
            } catch (error) {
                console.error('Session restore failed:', error);
                if (!cancelled) setUser(null); // no active session -> public screens
            } finally {
                if (!cancelled) setIsInitializing(false);
            }
        };

        initializeAuth();
        return () => {
            cancelled = true;
        };
    }, []);

    useEffect(() => {
        setAuthFailureHandler(() => setUser(null));
        return () => setAuthFailureHandler(null);
    }, []);

    const login = useCallback(async (credentials: LoginCredentials) => {
        const data = await authServices.login(credentials);
        setUser(data.user);
    }, []);


     const signup = useCallback(async (credentials: SignupCredentials) => {
        return authServices.signup(credentials);
    }, []);

     const logout = useCallback(async () => {
        try {
            await authServices.logout();
        } finally {
            setUser(null); // always clear local state, even if the request fails
        }
    }, []);

    const value = useMemo<AuthContextType>(
        () => ({
            user,
            isInitializing,
            isAuthenticated: !!user,
            login,
            signup,
            logout,
        }),
        [user, isInitializing, login, signup, logout]
    );



    return (
        <AuthContext.Provider
            value={value}
        >
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used inside Auth Provider");
    }
    return context;
}