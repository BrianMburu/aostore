// context/AuthContext.tsx
'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { initializeOthent } from '@/services/auth/othent';
import { User } from '@/types/user';
import { Message } from '@/types/message';
import { Othent } from '@othent/kms';

type userValueTypes = string | Message | object | null;

interface AuthContextType {
    user: User | null;
    login: () => void;
    logout: () => void;
    updateUserData: (key: string, value: userValueTypes) => void;
    isConnected: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [othent, setOthent] = useState<Othent | null>(null);

    const [isConnected, setIsConnected] = useState<boolean>(false);

    useEffect(() => {
        const storedUser = localStorage.getItem('aostore-user');

        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }

        const initOthent = async () => {
            try {
                const instance = initializeOthent();
                setOthent(instance);

                // Check if there's an existing session
                // if (user) {
                //     const session = await instance.getSession();
                //     if (session) {
                //         setIsConnected(true);
                //     } else {
                //         setUser(null);
                //         setIsConnected(false);
                //         localStorage.removeItem('aostore-user');
                //     }
                // }

                // Check if user is logged in (from sign in data)
                if (user) setIsConnected(true);

            } catch (error) {
                console.error("Error initializing Othent:", error);
            }
        };

        initOthent();

        // Check if user is logged in
        // if (user) setIsConnected(true);
    }, []);


    const login = async () => {
        if (!othent) return;

        const res = await othent.connect();
        if (!res) throw new Error('Othent login failed!');;

        const user = {
            username: res.name,
            walletAddress: res.walletAddress,
            avatar: res.picture
        };

        setUser(user);
        setIsConnected(true);
        localStorage.setItem('aostore-user', JSON.stringify(user));
    };

    const logout = async () => {
        if (!othent) return;

        await othent.disconnect();

        setUser(null);
        setIsConnected(false);
        localStorage.removeItem('aostore-user');
    };

    const updateUserData = (key: string, value: userValueTypes) => {
        if (!user) return;

        const updatedUser = { ...user, [key]: value } as User;

        setUser(updatedUser);
        localStorage.setItem('aostore-user', JSON.stringify(updatedUser));
    }

    return (
        <AuthContext.Provider value={{ user, login, logout, updateUserData, isConnected }}>
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