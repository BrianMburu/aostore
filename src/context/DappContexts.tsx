/* src/context/AppContext.tsx */
'use client';

import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';
import { Dapp } from '@/types/dapp';
import { DAppService } from '@/services/ao/dappService';

// Define the shape of our context
interface AppContextValue {
    appData: Dapp | null;
    loading: boolean;
    refreshAppData: () => Promise<void>;
}

// Create context with default values
const AppContext = createContext<AppContextValue>({
    appData: null,
    loading: false,
    refreshAppData: async () => { },
});

// Provider component that fetches and provides app data
export function AppContextProvider({ children }: { children: ReactNode }) {
    const [appData, setAppData] = useState<Dapp | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const params = useSearchParams();
    const appId = params.get('appId');

    // Centralized fetch logic
    const fetchApp = useCallback(async () => {
        setLoading(true);
        try {
            if (!appId) {
                setLoading(false);
                return;
            }

            const dapp = await DAppService.getDApp(appId);
            setAppData(dapp);
        } catch (error) {
            console.error('Failed to fetch app data:', error);
        } finally {
            setLoading(false);
        }
    }, [appId]);

    // Initial fetch and refresh on appId change
    useEffect(() => {
        fetchApp();
    }, [fetchApp]);

    return (
        <AppContext.Provider value={{ appData, loading, refreshAppData: fetchApp }}>
            {children}
        </AppContext.Provider>
    );
}

// Custom hook for consuming the context
export const useAppContext = () => useContext(AppContext);