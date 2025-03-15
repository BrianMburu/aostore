'use client'

import { createContext, useContext, useEffect, useState, useCallback, useTransition } from 'react';
import { Message } from '@/types/message';
import { Othent, OthentOptions, UrlString, UserDetails } from '@othent/kms';
import { createDataItemSigner } from '@permaweb/aoconnect';
import { appInfo, TokenExpiry } from '@/config/auth';

type userValueTypes = string | Message | object | null;

interface AuthContextType {
    user: UserDetails | null;
    login: () => Promise<void>;
    logout: () => Promise<void>;
    updateUserData: (key: string, value: userValueTypes) => void;
    isConnected: boolean;
    isLoading: boolean;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    signTransaction: (transaction: any) => Promise<any>;
    getDataItemSigner: () => Promise<ReturnType<typeof createDataItemSigner>>;
    requireAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<UserDetails | null>(null);
    const [othent, setOthent] = useState<Othent | null>(null);
    const [isConnected, setIsConnected] = useState<boolean>(false);
    const [sessionChecked, setSessionChecked] = useState<boolean>(false);
    const [isLoading, startTransition] = useTransition();

    const handleAuthEvent = useCallback((userDetails: UserDetails | null, isAuthenticated: boolean) => {
        setUser(userDetails);
        setIsConnected(isAuthenticated);
    }, []);

    const handleError = useCallback((error: Error) => {
        console.error("onError =", error);
    }, []);

    const validateOthentSession = async (sessionUser: UserDetails, instance: Othent) => {
        try {
            const isAuthenticated = await instance.isAuthenticated;
            const currentUser = await instance.getSyncUserDetails();

            if (JSON.stringify(currentUser) === JSON.stringify(sessionUser)) {
                handleAuthEvent(currentUser, isAuthenticated);
            } else {
                console.log("Invalid session found!!");
                await logout();
            }
        } catch (error) {
            console.log("No active session found", error);
            handleAuthEvent(null, false);
        }
    };

    // Initialize Othent and store it in state.
    useEffect(() => {
        if (typeof window === "undefined") return;

        const options: OthentOptions = {
            appInfo,
            autoConnect: "lazy",
            persistLocalStorage: true,
            throwErrors: false,
            auth0RedirectURI: window.location.origin as UrlString,
            auth0ReturnToURI: window.location.origin as UrlString,
            auth0RefreshTokenExpirationMs: TokenExpiry
        };

        try {
            const instance = new Othent(options);
            setOthent(instance);
        } catch (error) {
            console.error("Failed to initialize Othent:", error);
        }
    }, []);

    useEffect(() => {
        if (typeof window === "undefined" || !othent || sessionChecked) return;

        let isMounted = true;

        othent.addEventListener("error", handleError);
        othent.addEventListener("auth", handleAuthEvent);
        const cleanupFn = othent.startTabSynching();

        startTransition(async () => {
            try {
                const res = await fetch("/api/session");
                if (res.ok) {
                    const data = await res.json(); // expected format: { user: UserDetails }
                    if (data?.user) {
                        await validateOthentSession(data.user, othent);
                    } else {
                        // Only call logout if the user isn’t already null.
                        if (user) {
                            await logout();
                        }
                    }
                } else {
                    if (user) {
                        await logout();
                    }
                }
            } catch (error) {
                console.error("Session fetch failed:", error);
                if (isMounted) {
                    setUser(null);
                    setIsConnected(false);
                }
            } finally {
                setSessionChecked(true);
            }
        });

        return () => {
            isMounted = false;
            othent.removeEventListener("auth", handleAuthEvent);
            othent.removeEventListener("error", handleError);
            cleanupFn();
        };

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [othent, sessionChecked, handleAuthEvent, handleError]);

    const login = useCallback(async () => {
        if (!othent) {
            console.error("Othent instance not initialized");
            return;
        }
        try {
            // Prevent re-login if already authenticated.
            if (othent.isAuthenticated) return;

            await othent.connect();
            const userDetails = othent.getSyncUserDetails();
            if (!userDetails) {
                console.error("User details are null after connection");
                return;
            }
            setUser(userDetails);
            setIsConnected(true);

            // Create the session on the server.
            const res = await fetch("/api/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ user: userDetails }),
            });
            if (!res.ok) {
                throw new Error("Failed to create session on server");
            }
        } catch (error) {
            console.error("Login failed:", error);
        }

    }, [othent]);

    const logout = useCallback(async () => {
        if (!othent) {
            console.error("Othent instance not initialized");
            return;
        }
        // Avoid circular refresh if already logged out.
        if (!user) return;
        try {
            await othent.disconnect();
            setUser(null);
            setIsConnected(false);

            // Delete the session cookie on the server.
            const res = await fetch("/api/logout", {
                method: "POST",
            });
            if (!res.ok) {
                throw new Error("Failed to delete session on server");
            }
        } catch (error) {
            console.error("Logout failed:", error);
        }
    }, [othent, user]);

    const updateUserData = (key: string, value: userValueTypes) => {
        if (!user) return;
        const updatedUser = { ...user, [key]: value };
        setUser(updatedUser);
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const signTransaction = async (transaction: any) => {
        if (!othent) {
            console.error("Othent instance not initialized");
            throw new Error("Othent instance not initialized");
        }
        try {
            if (!othent.isAuthenticated) {
                await othent.connect();
            }
            const signedTransaction = await othent.sign(transaction);
            return signedTransaction;
        } catch (error) {
            console.error("Error signing transaction:", error);
            throw error;
        }
    };

    const getDataItemSigner = async () => {
        if (!othent) {
            console.error("Othent instance not initialized");
            throw new Error("Othent instance not initialized");
        }
        if (!othent.isAuthenticated) {
            await othent.connect();
        }
        return createDataItemSigner(othent);
    };

    const requireAuth = useCallback(async () => {
        if (!othent) {
            console.error("Othent instance not initialized");
            return;
        }
        try {
            if (!othent.isAuthenticated) {
                await login();
            }
            setIsConnected(true);
        } catch (error) {
            console.error("Authentication failed:", error);
            await logout();
            throw error;
        }
    }, [othent, login, logout]);

    return (
        <AuthContext.Provider
            value={{
                user,
                login,
                logout,
                updateUserData,
                isConnected,
                isLoading,
                signTransaction,
                getDataItemSigner,
                requireAuth
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
