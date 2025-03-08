'use client'

import { useEffect, useState, useTransition } from 'react'
import DAppCard from './DappCard'
import { DAppService, DAppsFilterParams } from '@/services/ao/dappService'
// import { useAuth } from '@/context/AuthContext';
import { AppData } from '@/types/dapp';
import PaginationControls from '../PaginationControls';
import { DEFAULT_PAGE_SIZE } from '@/config'
import DappCardsSkeleton from './Skeletons/DappCardsSkeleton';
import { useSafeUser } from '@/hooks/useSafeUser';


export function FavoriteDAppsList({ params }: { params: DAppsFilterParams }) {
    const [favoriteDapps, setFavoriteDapps] = useState<AppData[]>([]);
    const [totalItems, setTotalItems] = useState<number>(0);
    const { user, isAuthenticated, isLoading: isAuthLoading } = useSafeUser();
    // const { isAuthenticated } = useSafeUser();

    const [fetching, StartTransition] = useTransition();

    useEffect(() => {
        // Only fetch if user is authenticated and wallet address exists
        if (!isAuthLoading && isAuthenticated && user?.walletAddress) {
            const abortController = new AbortController();

            StartTransition(async () => {
                try {
                    const { data: dapps, total: totalItems } = await DAppService.getFavoriteDApps(
                        user.walletAddress,
                        params,
                        false
                    );
                    setFavoriteDapps(dapps);
                    setTotalItems(totalItems);
                } catch (error) {
                    console.error("Failed to fetch favorite dApps:", error);
                }
            });

            return () => abortController.abort();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user?.walletAddress, params.fv_page, params.protocol, params.category, isAuthLoading, isAuthenticated]);

    // useEffect(() => {
    //     StartTransition(
    //         async () => {
    //             const { data: dapps, total: totalItems } = await DAppService.getFavoriteDApps(user!.walletAddress || '', params);
    //             setFavoriteDapps(dapps)
    //             setTotalItems(totalItems)
    //         }
    //     );
    //     // eslint-disable-next-line react-hooks/exhaustive-deps
    // }, [user, params.fv_page, params.protocol, params.category])

    // Show combined loading states
    if (isAuthLoading || fetching) {
        return <DappCardsSkeleton n={4} />;
    }

    // Show empty state if no favorites
    if (!favoriteDapps.length && !isAuthLoading) {
        return (
            <div className="text-center py-12">
                <p className="text-muted-foreground">
                    {isAuthenticated
                        ? "No favorite dApps found"
                        : "Please login to view your favorites"}
                </p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {favoriteDapps.map(dapp => (
                    <DAppCard key={dapp.appId} dapp={dapp} />
                ))}
            </div>
            {favoriteDapps &&
                <PaginationControls
                    totalPages={Math.ceil(totalItems / DEFAULT_PAGE_SIZE)}
                    paramName='fv_page'
                />}
        </div>
    )
}