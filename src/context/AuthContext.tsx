'use client';

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

    /**
     * Checks if ArConnect is installed.
     * @returns {boolean} True if installed, false otherwise.
     */
    const checkArConnectInstalled = useCallback(() => {
        return typeof window !== 'undefined' && !!window.arweaveWallet;
    }, []);

    /**
     * Logs the user out, disconnecting the wallet and clearing the session.
     */
    const logout = useCallback(async () => {
        if (checkArConnectInstalled()) {
            try {
                await window.arweaveWallet.disconnect();
                await fetch('/api/logout', { method: 'POST', credentials: 'include' });
                setUser(null);
                setIsConnected(false);
                router.push('/');
            } catch (error) {
                console.error('Error during disconnect:', error);
                router.push('/');
            }
        }
    }, [checkArConnectInstalled, router]);

    /**
     * Fetches user details from the session and logs out if the wallet address mismatches.
     * @param {string} address - The wallet address to validate.
     * @returns {Promise<User | null>} The user details if valid; otherwise null.
     */
    const getUserDetails = useCallback(
        async (address: string): Promise<User | null> => {
            const res = await fetch('/api/session', { credentials: 'include' });
            if (res.ok) {
                const data = await res.json(); // expected format: { user: UserDetails }
                if (data?.user) {
                    // If the wallet address in session doesn't match the active address, log out.
                    if (data.user.walletAddress !== address) {
                        console.warn('Wallet address mismatch. Logging out.');
                        await logout();
                        return null;
                    }
                    return data.user;
                } else {
                    // Session exists but no user, so logout if needed.
                    console.warn('Session exists but no user found. Logging out.');
                    await logout();
                }
            } else {
                console.warn('Session API call failed. Logging out.');
                await logout();
            }
            return null;
        },
        [logout] // relying on logout ensures we always call the latest version
    );

    /**
     * Handles the authentication state by checking the wallet connection and permissions.
     * If permissions are missing, attempts to reconnect.
     */
    const handleAuthState = useCallback(async () => {
        if (!checkArConnectInstalled()) {
            setShowArConnectPopup(true);
            return;
        }

        try {
            let address;
            try {
                address = await window.arweaveWallet.getActiveAddress();

                // eslint-disable-next-line @typescript-eslint/no-explicit-any
            } catch (error: any) {
                // Enhanced error handling for missing permissions
                if (error.message.includes('Missing permission')) {
                    console.warn('Missing ACCESS_ADDRESS permission. Attempting to reconnect...');
                    // Optionally, you might want to notify the user here via UI feedback.
                    await window.arweaveWallet.connect(['ACCESS_ADDRESS', 'SIGNATURE', 'SIGN_TRANSACTION', 'DISPATCH'], {
                        name: 'AoStore',
                        logo: 'OVJ2EyD3dKFctzANd0KX_PCgg8IQvk0zYqkWIj-aeaU'
                    });
                    address = await window.arweaveWallet.getActiveAddress();
                } else {
                    throw error;
                }
            }
            if (address) {
                const userdetails = await getUserDetails(address);
                if (userdetails) {
                    setUser(userdetails);
                    setIsConnected(true);
                } else {
                    setUser(null);
                    setIsConnected(false);
                }
            }
        } catch (error) {
            console.error('Error during auth state handling:', error);
            setUser(null);
            setIsConnected(false);
        }
    }, [checkArConnectInstalled, getUserDetails]);

    // Initiate auth state check on mount
    useEffect(() => {
        startTransition(() => {
            handleAuthState();
        });
    }, [handleAuthState]);

    /**
     * Initiates the login process by connecting the wallet and updating the session.
     */
    const login = useCallback(async () => {
        if (!checkArConnectInstalled()) {
            setShowArConnectPopup(true);
            return;
        }

        try {
            // Connect with the required permissions
            await window.arweaveWallet.connect(
                ['ACCESS_ADDRESS', 'SIGNATURE', 'SIGN_TRANSACTION', 'DISPATCH'],
                {
                    name: 'AoStore',
                    logo: 'OVJ2EyD3dKFctzANd0KX_PCgg8IQvk0zYqkWIj-aeaU'
                }
            );
            const address = await window.arweaveWallet.getActiveAddress();

            const userDetails = await UserService.fetchUser();

            if (userDetails) {
                setUser({
                    walletAddress: address,
                    username: userDetails.username,
                    avatar: userDetails.avatar
                });
                setIsFirstTimeUser(false);
                setIsConnected(true);

                // Update your server session (include credentials to handle cookies)
                await fetch('/api/login', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    credentials: 'include',
                    body: JSON.stringify({ user: userDetails })
                });
            } else {
                setUser({
                    walletAddress: address,
                    username: 'Guest'
                });
                setIsFirstTimeUser(true);
            }
        } catch (error) {
            console.error('Login failed:', error);
            await logout();
        }
    }, [checkArConnectInstalled, logout]);

    /**
     * Updates the current user object.
     * @param {string} key - The key to update.
     * @param {userValueTypes} value - The new value.
     */
    const updateUserData = (key: string, value: userValueTypes) => {
        if (!user) return;
        const updatedUser = { ...user, [key]: value };
        setUser(updatedUser);
    };

    /**
     * Replaces the current user object with new user data.
     * @param {User} userData - The new user data.
     */
    const setUserData = (userData: User) => {
        if (!userData) return;
        setUser(userData);
    };

    /**
     * Signs a transaction using ArConnect.
     * @param {any} transaction - The transaction to sign.
     * @returns {Promise<any>} The signed transaction.
     */
    const signTransaction = useCallback(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        async (transaction: any) => {
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
        },
        [checkArConnectInstalled]
    );

    /**
     * Returns a data item signer.
     * @returns {Promise<ReturnType<typeof createDataItemSigner>>} The signer.
     */
    const getDataItemSigner = useCallback(async () => {
        if (!checkArConnectInstalled()) {
            setShowArConnectPopup(true);
            throw new Error('ArConnect not installed');
        }
        return createDataItemSigner(window.arweaveWallet);
    }, [checkArConnectInstalled]);

    /**
     * Ensures the user is authenticated, triggering a login if needed.
     */
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
                {showArConnectPopup && (
                    <DownloadModal onClose={() => setShowArConnectPopup(false)} />
                )}
                {isFirstTimeUser && <AddUserForm isFirstTimeUser={isFirstTimeUser} />}
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
