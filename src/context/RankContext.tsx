'use client';

import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { RankService } from '@/services/ao/rankService';
import { Rank } from '@/types/rank';
import { useAuth } from './AuthContext';

type RankContextType = {
    rank: Rank;
    isfetchingRank: boolean;
    fetchRankData: () => Promise<void>;
};

const RankContext = createContext<RankContextType | undefined>(undefined);

export function RankProvider({ children }: { children: React.ReactNode }) {
    const [rank, setRank] = useState<Rank>({ rank: "BluePill", points: 0 });
    const [isfetchingRank, setIsFetchingRank] = useState(true);
    const { isConnected } = useAuth();

    const fetchRankData = useCallback(async () => {
        try {
            if (isConnected) {
                const rank = await RankService.fetchRanks();
                if (rank) {
                    setRank(rank);
                }
            }
        } catch (error) {
            console.error("Rank Fetch failed with Error: ", error);
        } finally {
            setIsFetchingRank(false);
        }
    }, [isConnected]);

    useEffect(() => {
        fetchRankData();
    }, [fetchRankData]);

    return (
        <RankContext.Provider value={{ rank, isfetchingRank, fetchRankData }}>
            {children}
        </RankContext.Provider>
    );
}

export function useRank() {
    const context = useContext(RankContext);
    if (!context) {
        throw new Error('useRank must be used within a RankProvider');
    }
    return context;
}
