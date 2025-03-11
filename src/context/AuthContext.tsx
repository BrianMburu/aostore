'use client';

import { createContext, useContext, useEffect, useState, useCallback, useTransition, useMemo } from 'react';
import { Message } from '@/types/message';
import { Othent, OthentOptions, UserDetails } from '@othent/kms';
import { createDataItemSigner } from '@permaweb/aoconnect';
import { WaveLoader } from '@/app/ui/animations/WaveLoader';
import { appInfo, TokenExpiry } from '@/config/auth';

type userValueTypes = string | Message | object | null;

// Define our context type, including a function to get the data item signer.
interface AuthContextType {
    user: UserDetails | null;
    login: () => Promise<void>;
    logout: () => Promise<void>;
    updateUserData: (key: string, value: userValueTypes) => void;
    isConnected: boolean;
    isLoading: boolean;
    signTransaction: (transaction: any) => Promise<any>;
    getDataItemSigner: () => Promise<ReturnType<typeof createDataItemSigner>>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<UserDetails | null>(null);
    // const [othent, setOthent] = useState<Othent | null>(null)
    const [isConnected, setIsConnected] = useState<boolean>(false);
    const [isLoading, startTransition] = useTransition();

    // This callback handles Othent auth events.
    const handleAuthEvent = useCallback((userDetails: UserDetails | null, isAuthenticated: boolean) => {
        // console.log("Auth event:", userDetails, isAuthenticated);
        if (userDetails && isAuthenticated) {
            setUser(userDetails);
            setIsConnected(true);
        } else {
            setUser(null);
            setIsConnected(false);
        }
    }, []);

    // This Function Validates if an othent session is valid / expired.
    const validateOthentSession = async (sessionUser: UserDetails, instance: Othent) => {
        // Validate session with Othent
        try {
            await instance.requireAuth();
            const currentUser = await instance.getSyncUserDetails();

            if (JSON.stringify(currentUser) === JSON.stringify(sessionUser)) {
                handleAuthEvent(currentUser, true);
            } else {
                console.log("Invalid session found!!");
                await logout()
            }
        } catch (error) {
            console.log("No active session found", error);
            handleAuthEvent(null, false);
        }
    }

    // Initialize Othent without using built-in cookie persistence
    const options: OthentOptions = {
        appInfo,
        persistLocalStorage: true,
        throwErrors: false,
        auth0RefreshTokenExpirationMs: TokenExpiry
    }

    const othent = useMemo(() => {
        return new Othent(options);
    }, [options]);

    useEffect(() => {
        if (typeof window === "undefined") return;

        startTransition(async () => {
            // Listen for errors from Othent
            othent.addEventListener("error", (err) => {
                console.error("Othent error:", err);
            });

            try {
                const res = await fetch("/api/session");

                if (res.ok) {
                    const data = await res.json(); // API returns { user: UserDetails }
                    handleAuthEvent(data.user, true);
                    await validateOthentSession(data.user, othent);
                }
                else {
                    handleAuthEvent(null, false);
                    await logout()
                }

            } catch (error) {
                console.error("Session fetch failed:", error);
                setUser(null);
            }
        });

        // Start tab synchronization
        const cleanupFn = othent.startTabSynching();

        return () => {
            cleanupFn();
        };
    }, [handleAuthEvent]);

    const login = async () => {
        try {
            await othent.connect();
            const userDetails = othent.getSyncUserDetails();
            setUser(userDetails);
            setIsConnected(true)

            // Call our login endpoint to create the session cookie
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
    };

    const logout = async () => {
        try {
            await othent.disconnect();
            setUser(null);
            setIsConnected(false)
            // Call our logout endpoint to delete the session cookie
            const res = await fetch("/api/logout", {
                method: "POST",
            });
            if (!res.ok) {
                throw new Error("Failed to delete session on server");
            }
        } catch (error) {
            console.error("Logout failed:", error);
        }
    };

    // Update non-sensitive user data.
    const updateUserData = (key: string, value: userValueTypes) => {
        if (!user) return;
        const updatedUser = { ...user, [key]: value };
        setUser(updatedUser);
    };

    // Function to sign a transaction using Othent.
    const signTransaction = async (transaction: any) => {
        try {
            if (!othent.isAuthenticated) {
                await othent.connect();
            }
            const signedTransaction = await othent!.sign(transaction);

            return signedTransaction;
        } catch (error) {
            console.error("Error signing transaction:", error);
            throw error;
        }
    };

    // Function to create a data item signer using @permaweb/aoconnect.
    // This signer will be used to sign transactions (data items) for the blockchain.
    const getDataItemSigner = async () => {
        // Manually make sure the user is authenticated, or prompt them to authenticate:
        if (!othent.isAuthenticated) {
            await othent!.connect();
        }
        return createDataItemSigner(othent);
    };

    // if (isLoading) {
    //     // Optionally show a loading indicator while rehydrating the session.
    //     return <WaveLoader />;
    // }

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
