'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { RankService } from '@/services/ao/rankService';
import { Rank } from '@/types/rank';
import { useAuth } from './AuthContext';

type RankContextType = {
    rank: Rank;
    isfetchingRank: boolean
};

const RankContext = createContext<RankContextType | undefined>(undefined);

export function RankProvider({ children }: { children: React.ReactNode }) {
    const [rank, setRank] = useState<Rank>({ rank: "BluePill", aosPoints: 0 });
    const [isfetchingRank, setIsFetchingRank] = useState(true);
    const { isConnected } = useAuth();

    useEffect(() => {
        const fetchRankData = async () => {
            try {
                if (isConnected) {
                    const rank = await RankService.fetchRanks();
                    if (rank) {
                        setRank(rank)
                    }
                }
            } catch (error) {
                console.error("Rank Fetch failed with Error: ", error);
            } finally {
                setIsFetchingRank(false)
            }
        };

        fetchRankData()
    }, [isConnected]);

    return (
        <RankContext.Provider value={{ rank, isfetchingRank }}>
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
