'use client'

import { createContext, useContext, useEffect, useState, useCallback, useTransition } from 'react';
import { Message } from '@/types/message';
import { createDataItemSigner } from '@permaweb/aoconnect';
import { AnimatePresence } from 'framer-motion';
import { User } from '@/types/user';
import DownloadModal from '@/app/ui/wander/DownloadModal';
import { UserService } from '@/services/ao/UserService';
import { AddUserForm } from '@/app/ui/AddUserForm';
import { useRouter } from 'next/navigation';

type userValueTypes = string | Message | object | null;

interface AuthContextType {
    user: User | null; // Now stores just the wallet address
    login: () => Promise<void>;
    logout: () => Promise<void>;
    updateUserData: (key: string, value: userValueTypes) => void;
    setUserData: (userData: User) => void;
    isConnected: boolean;
    isLoading: boolean;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    signTransaction: (transaction: any) => Promise<any>;
    getDataItemSigner: () => Promise<ReturnType<typeof createDataItemSigner>>;
    requireAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [isFirstTimeUser, setIsFirstTimeUser] = useState(false);
    const [isConnected, setIsConnected] = useState<boolean>(false);
    const [isLoading, startTransition] = useTransition();
    const [showArConnectPopup, setShowArConnectPopup] = useState(false);
    const router = useRouter();

    // Check for ArConnect installation
    const checkArConnectInstalled = useCallback(() => {
        return typeof window !== 'undefined' && !!window.arweaveWallet;
    }, []);

    const handleAuthState = useCallback(async () => {
        if (!checkArConnectInstalled()) {
            setShowArConnectPopup(true);
            return;
        }

        try {
            const address = await window.arweaveWallet.getActiveAddress();

            if (address) {
                const userdetails = await getUserDetails();
                if (userdetails) {
                    setUser(userdetails);
                    setIsConnected(true);
                } else {
                    setUser(null);
                    setIsConnected(false);
                }
            }
        } catch (error) {
            console.error('Error checking ArConnect connection:', error);
            setUser(null);
            setIsConnected(false);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [checkArConnectInstalled]);

    const getUserDetails = useCallback(async () => {
        const res = await fetch("/api/session");
        if (res.ok) {
            const data = await res.json(); // expected format: { user: UserDetails }
            if (data?.user) {
                return data.user;
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
        return null;

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user]);

    useEffect(() => {
        startTransition(() => {
            handleAuthState();
        });
    }, [handleAuthState]);

    const login = useCallback(async () => {
        if (!checkArConnectInstalled()) {
            setShowArConnectPopup(true);
            return;
        }

        try {
            await window.arweaveWallet.connect(['ACCESS_ADDRESS', 'SIGNATURE', 'SIGN_TRANSACTION', 'DISPATCH'], {
                name: "AoStore",
                logo: "OVJ2EyD3dKFctzANd0KX_PCgg8IQvk0zYqkWIj-aeaU",
            });
            const address = await window.arweaveWallet.getActiveAddress();

            const userDetails = await UserService.fetchUser();

            if (userDetails) {
                setUser({
                    walletAddress: address,
                    username: userDetails.username,
                    avatar: userDetails.avatar,
                });
                setIsFirstTimeUser(false);
                setIsConnected(true);

                // Update your server session if needed
                await fetch('/api/login', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ user: userDetails }),
                });

            } else {
                setUser({
                    walletAddress: address,
                    username: "Guest",
                });
                setIsFirstTimeUser(true);
            }

        } catch (error) {
            console.error('Login failed:', error);
            await logout();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [checkArConnectInstalled]);

    const logout = useCallback(async () => {
        // redirect to home page
        if (checkArConnectInstalled()) {
            try {
                await window.arweaveWallet.disconnect();
                await fetch('/api/logout', { method: 'POST' });

                setUser(null);
                setIsConnected(false);
                router.push('/');
            } catch (error) {
                console.error('Error disconnecting:', error);
                router.push('/');
            }
        }

    }, [checkArConnectInstalled, router]);

    const updateUserData = (key: string, value: userValueTypes) => {
        if (!user) return;
        const updatedUser = { ...user, [key]: value };
        setUser(updatedUser);
    };

    const setUserData = (userData: User) => {
        if (!userData) return;
        setUser(userData);
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const signTransaction = useCallback(async (transaction: any) => {
        if (!checkArConnectInstalled()) {
            setShowArConnectPopup(true);
            throw new Error('ArConnect not installed');
        }

        try {
            return await window.arweaveWallet.sign(transaction);
        } catch (error) {
            console.error('Signing failed:', error);
            throw error;
        }
    }, [checkArConnectInstalled]);

    const getDataItemSigner = useCallback(async () => {
        if (!checkArConnectInstalled()) {
            setShowArConnectPopup(true);
            throw new Error('ArConnect not installed');
        }

        return createDataItemSigner(window.arweaveWallet);
    }, [checkArConnectInstalled]);

    const requireAuth = useCallback(async () => {
        if (!isConnected) {
            await login();
        }
    }, [isConnected, login]);

    return (
        <AuthContext.Provider
            value={{
                user,
                login,
                logout,
                updateUserData,
                setUserData,
                isConnected,
                isLoading,
                signTransaction,
                getDataItemSigner,
                requireAuth
            }}
        >
            {children}

            <AnimatePresence>
                {
                    showArConnectPopup && (
                        <DownloadModal onClose={() => setShowArConnectPopup(false)} />
                    )}
                {
                    isFirstTimeUser && (
                        <AddUserForm isFirstTimeUser={isFirstTimeUser} />
                    )
                }
            </AnimatePresence>
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