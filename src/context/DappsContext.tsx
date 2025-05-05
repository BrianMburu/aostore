/* src/context/AppContext.tsx */
'use client';

import { createContext, useContext, useState, useEffect, ReactNode, useCallback, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import { DappList } from '@/types/dapp';
import { DAppService } from '@/services/ao/dappService';

// Define the shape of our context
interface DappsContextValue {
    dapps: DappList[];
    loading: boolean;
    refreshDapps: () => Promise<void>;
}

// Create context with default values
const AppContext = createContext<DappsContextValue>({
    dapps: [],
    loading: false,
    refreshDapps: async () => { },
});

// Provider component that fetches and provides app data
export function DappsContextProvider({ children }: { children: ReactNode }) {
    const [dapps, setDapps] = useState<DappList[]>([]);
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

            const { data: dapps } = await DAppService.getDApps({});
            setDapps(dapps);

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

    const contextValue = useMemo(
        () => ({
            dapps,
            loading,
            refreshDapps: fetchApp
        }),
        [dapps, loading, fetchApp]
    );

    return (
        <AppContext.Provider value={contextValue}>
            {children}
        </AppContext.Provider>
    );
}

// Custom hook for consuming the context
export const useDappsContext = () => useContext(AppContext);