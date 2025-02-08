// context/AuthContext.tsx
'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { User } from '@/types/user';

interface UserContextType {
    user: User | null;
    updateUserData: (key: string, value: string) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(
        () => JSON.parse(localStorage.getItem('aostore-user') || 'null')
    );

    useEffect(() => {
        const storedUser = localStorage.getItem('aostore-user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
    }, []);


    const updateUserData = (key: string, value: string) => {
        const updatedUser = { ...user, [key]: value };
        setUser(updatedUser);
        localStorage.setItem('aostore-user', JSON.stringify(updatedUser));
    }


    return (
        <UserContext.Provider value={{ user, updateUserData }}>
            {children}
        </UserContext.Provider>
    );
}

export function useUser() {
    const context = useContext(UserContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}