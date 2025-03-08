'use client';

import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { User } from '@/types/user';
import { Message } from '@/types/message';
import { AppInfo, Othent, UserDetails } from '@othent/kms';
import { createDataItemSigner } from '@permaweb/aoconnect';
import { WaveLoader } from '@/app/ui/animations/WaveLoader';


type userValueTypes = string | Message | object | null;

const appInfo: AppInfo = {
    name: "aostore",
    version: "1.0.0",
    env: "production",
};

// Define our context type, including a function to get the data item signer.
interface AuthContextType {
    user: User | null;
    login: () => Promise<void>;
    logout: () => Promise<void>;
    updateUserData: (key: string, value: userValueTypes) => void;
    isConnected: boolean;
    isLoading: boolean;
    signTransaction: (transaction: any) => Promise<any>;
    getDataItemSigner: () => ReturnType<typeof createDataItemSigner>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [othent, setOthent] = useState<Othent | null>(null);
    const [isConnected, setIsConnected] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    // This callback handles Othent auth events.
    // Note: We only store minimal non-sensitive info in state.
    const handleAuthEvent = useCallback((userDetails: UserDetails | null, isAuthenticated: boolean) => {
        // console.log("Auth event:", userDetails, isAuthenticated);
        if (userDetails && isAuthenticated) {
            const userData: User = {
                username: userDetails.name,
                walletAddress: userDetails.walletAddress,
                avatar: userDetails.picture,
            };
            setUser(userData);
            setIsConnected(true);
        } else {
            setUser(null);
            setIsConnected(false);
        }
        setIsLoading(false);
    }, []);

    useEffect(() => {
        if (typeof window === "undefined") return;

        const initializeAuth = async () => {
            try {
                const instance = new Othent({
                    appInfo,
                    persistLocalStorage: true
                });

                // Add event listener first
                instance.addEventListener("auth", handleAuthEvent);

                // Validate session with Othent
                try {
                    await instance.requireAuth();
                    const currentUser = await instance.getSyncUserDetails();
                    if (currentUser) {
                        handleAuthEvent(currentUser, true);
                    }
                } catch (error) {
                    console.log("No active session found", error);
                    handleAuthEvent(null, false);
                }

                // Start tab synchronization
                const cleanupFn = instance.startTabSynching();

                setOthent(instance);
                return () => {
                    cleanupFn();
                    instance.removeEventListener("auth", handleAuthEvent);
                };
            } catch (error) {
                console.error("Auth initialization error:", error);
                setIsLoading(false);
            }
        };

        initializeAuth();
    }, [handleAuthEvent]);

    // useEffect(() => {
    //     // Run only on client.
    //     if (typeof window === "undefined") return;

    //     // Initialize Othent with persistence enabled.
    //     // (Note: Avoid storing sensitive data in localStorage; consider using secure cookies for tokens.)
    //     const instance = new Othent({ appInfo, persistLocalStorage: true });
    //     instance.addEventListener("auth", (userDetails: UserDetails | null, isAuthenticated: boolean) => {
    //         handleAuthEvent(userDetails, isAuthenticated);
    //     });

    //     // Start tab synchronization so that session state is maintained across refreshes.
    //     const cleanupFn = instance.startTabSynching();


    //     // Rehydrate the session using requireAuth.
    //     instance.requireAuth()
    //         .then(async () => {
    //             console.log(instance?.isAuthenticated);
    //             console.log("Session rehydrated.");
    //         })
    //         .catch((error) => {
    //             console.error("Error rehydrating session:", error);
    //         })
    //         .finally(() => {
    //             setIsLoading(false);
    //         });

    //     setOthent(instance);
    //     return () => {
    //         cleanupFn();
    //     };
    // }, [handleAuthEvent]);

    // Login method: triggers Othent's connect flow.
    const login = async () => {
        if (!othent) return;
        try {
            const res = await othent.connect();
            if (!res) throw new Error("Othent login failed!");
            // The auth event listener will update state.
        } catch (error) {
            console.error("Error during login:", error);
            throw error;
        }
    };

    // Logout method: disconnects the session.
    const logout = async () => {
        if (!othent) return;
        try {
            await othent.disconnect();
            setUser(null);
            setIsConnected(false);
        } catch (error) {
            console.error("Error during logout:", error);
        }
    };

    // Update non-sensitive user data.
    const updateUserData = (key: string, value: userValueTypes) => {
        if (!user) return;
        const updatedUser = { ...user, [key]: value };
        setUser(updatedUser);
        // Optionally, update details on your server.
    };

    // Function to sign a transaction using Othent.
    const signTransaction = async (transaction: any) => {
        if (!othent) throw new Error("Othent is not initialized");
        try {
            const signedTransaction = await othent.sign(transaction);
            return signedTransaction;
        } catch (error) {
            console.error("Error signing transaction:", error);
            throw error;
        }
    };

    // Function to create a data item signer using @permaweb/aoconnect.
    // This signer will be used to sign transactions (data items) for the blockchain.
    const getDataItemSigner = () => {
        if (!othent) throw new Error("Othent instance is not available");
        return createDataItemSigner(othent);
    };

    if (isLoading) {
        // Optionally show a loading indicator while rehydrating the session.
        return <WaveLoader />;
    }

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
