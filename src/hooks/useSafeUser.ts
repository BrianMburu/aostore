// hooks/useSafeUser.ts
'use client';

import { useAuth } from '@/context/AuthContext';


export const useSafeUser = () => {
    const { user, isLoading, isConnected } = useAuth();

    return {
        isLoading,
        isAuthenticated: isConnected,
        user: user ?? {
            username: 'Guest',
            walletAddress: '',
            avatar: '/default-avatar.png'
        }
    };
};