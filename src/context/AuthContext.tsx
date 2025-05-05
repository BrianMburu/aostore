'use client';

import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { Message } from '@/types/message';
import { createDataItemSigner } from '@permaweb/aoconnect';
import { AnimatePresence } from 'framer-motion';
import { User } from '@/types/user';
import DownloadModal from '@/app/ui/wander/DownloadModal';
import { UserService } from '@/services/ao/UserService';
import { AddUserForm } from '@/app/ui/AddUserForm';
import { useRouter } from 'next/navigation';
import { deleteFromLocalAndSession, getFromLocalOrSession, writeToLocalOrSession } from '@/helpers/session';
import { appInfo, ArweavePermissions } from '@/config/auth';
import { useSiteSettings } from './SettingsContext';

type UserValueTypes = string | Message | object | null;

interface AuthContextType {
    user: User | null;
    login: () => Promise<void>;
    logout: () => Promise<void>;
    updateUserData: (key: string, value: UserValueTypes) => void;
    setUserData: (userData: User) => void;
    isConnected: boolean;
    isLoading: boolean;
    signTransaction: <T>(transaction: T) => Promise<T>;
    getDataItemSigner: () => Promise<ReturnType<typeof createDataItemSigner>>;
    requireAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const { rememberMe } = useSiteSettings();
    const [user, setUser] = useState<User | null>(null);
    const [isFirstTimeUser, setIsFirstTimeUser] = useState(false);
    const [isConnected, setIsConnected] = useState(false);
    const [isPending, setIsPending] = useState(true);
    const [showArConnectPopup, setShowArConnectPopup] = useState(false);
    const router = useRouter();

    // Rehydrate user when rememberMe changes
    useEffect(() => {
        const rehydrateUser = () => {
            const storedUser = getFromLocalOrSession('user', rememberMe);
            setUser(storedUser ? JSON.parse(storedUser) : null);
        };

        rehydrateUser();
    }, [rememberMe]);

    const checkArConnectInstalled = useCallback(() => {
        return typeof window !== 'undefined' && !!window.arweaveWallet;
    }, []);

    const persistUser = useCallback((userData: User | null) => {
        if (userData) {
            writeToLocalOrSession('user', JSON.stringify(userData), rememberMe);
        } else {
            deleteFromLocalAndSession('user');
        }

        setUser(userData);
    }, [rememberMe]);

    const logout = useCallback(async () => {
        if (!checkArConnectInstalled()) return;

        try {
            await window.arweaveWallet.disconnect();
            persistUser(null);
            setIsConnected(false);
            router.push('/');

        } catch (error) {
            console.error('Logout failed:', error);
            router.push('/');
        }
    }, [checkArConnectInstalled, router, persistUser]);

    const validateSession = useCallback(async (address: string) => {
        if (!user) return false;

        if (user.walletAddress !== address) {
            console.warn('Session mismatch detected');
            await logout();
            return false;
        }

        return true;
    }, [user, logout]);

    const handleAuthState = useCallback(async () => {
        setIsPending(true);
        let address: string | null = null;

        if (!checkArConnectInstalled()) {
            setShowArConnectPopup(true);
            setIsPending(false);
            return;
        }

        try {
            address = await window.arweaveWallet.getActiveAddress().catch(() => {
                // logout();
                return null;
            });

            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
            console.error('Auth state error:', error);
            if (error.message.includes('Missing permission')) {
                await window.arweaveWallet.connect(ArweavePermissions, appInfo);
                address = await window.arweaveWallet.getActiveAddress();
            } else {
                logout();
            }
        } finally {
            if (address && (await validateSession(address))) {
                setIsConnected(true);
            }
            setIsPending(false);
        }
    }, [checkArConnectInstalled, validateSession, logout]);

    // Handle storage changes across tabs
    useEffect(() => {
        const handleStorageChange = (event: StorageEvent) => {
            if (event.key === 'user') {
                const newUser = getFromLocalOrSession('user', rememberMe);
                setUser(newUser ? JSON.parse(newUser) : null);
            }
        };

        window.addEventListener('storage', handleStorageChange);
        return () => window.removeEventListener('storage', handleStorageChange);
    }, [rememberMe]);

    useEffect(() => {
        handleAuthState();
    }, [handleAuthState]);

    const login = useCallback(async () => {
        if (!checkArConnectInstalled()) {
            setShowArConnectPopup(true);
            return;
        }

        try {
            await window.arweaveWallet.connect(ArweavePermissions, appInfo);
            const address = await window.arweaveWallet.getActiveAddress();

            if (!address) {
                console.error('Failed to get active address');
                setIsConnected(false);
                return;
            }

            const userDetails = await UserService.fetchUser();
            const userData = userDetails ? {
                walletAddress: address,
                username: userDetails.username,
                avatar: userDetails.avatar
            } : {
                walletAddress: address,
                username: 'Guest'
            };

            persistUser(userData);
            setIsFirstTimeUser(!userDetails);
            setIsConnected(true);

        } catch (error) {
            console.error('Login failed:', error);
            persistUser(null);
            setIsConnected(false);

        } finally {
            setIsPending(false);
        }
    }, [checkArConnectInstalled, persistUser]);

    const updateUserData = useCallback((key: string, value: UserValueTypes) => {
        setUser(prev => {
            if (!prev) return prev;
            const updatedUser = { ...prev, [key]: value };
            persistUser(updatedUser);
            return updatedUser;
        });
    }, [persistUser]);

    const setUserData = useCallback((userData: User) => {
        persistUser(userData);
    }, [persistUser]);

    const signTransaction = useCallback(async <T,>(transaction: T) => {
        if (!checkArConnectInstalled()) {
            setShowArConnectPopup(true);
            throw new Error('ArConnect required');
        }

        try {
            return await window.arweaveWallet.sign(transaction);
        } catch (error) {
            console.error('Transaction signing failed:', error);
            throw error;
        }
    }, [checkArConnectInstalled]);

    const getDataItemSigner = useCallback(async () => {
        if (!checkArConnectInstalled()) {
            setShowArConnectPopup(true);
            throw new Error('ArConnect required');
        }
        return createDataItemSigner(window.arweaveWallet);
    }, [checkArConnectInstalled]);

    const requireAuth = useCallback(async () => {
        if (!isConnected) await login();
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
                isLoading: isPending,
                signTransaction,
                getDataItemSigner,
                requireAuth
            }}
        >
            {children}

            <AnimatePresence>
                {showArConnectPopup && (
                    <DownloadModal onClose={() => setShowArConnectPopup(false)} />
                )}
                {isFirstTimeUser && (
                    <AddUserForm
                        isFirstTimeUser={isFirstTimeUser}
                    // onSuccess={() => {
                    //     setIsFirstTimeUser(false);
                    //     handleAuthState();
                    // }}
                    // onCancel={() => {
                    //     setIsFirstTimeUser(false);
                    //     logout();
                    // }}
                    />
                )}
            </AnimatePresence>
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within AuthProvider');
    }
    return context;
}