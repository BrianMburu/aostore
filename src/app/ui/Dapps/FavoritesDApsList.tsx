'use client'

import { useEffect, useState, useTransition } from 'react'
import DAppCard from './DappCard'
import { DAppService, DAppsFilterParams } from '@/services/ao/dappService'
import { useAuth } from '@/context/AuthContext';
import { DappList } from '@/types/dapp';
import PaginationControls from '../PaginationControls';
import { DEFAULT_PAGE_SIZE } from '@/config/page'
import DappCardsSkeleton from './Skeletons/DappCardsSkeleton';
import { EmptyState } from '../EmptyState';


export function FavoriteDAppsList({ filterParams }: { filterParams: DAppsFilterParams }) {
    const [favoriteDapps, setFavoriteDapps] = useState<DappList[]>([]);
    const [totalItems, setTotalItems] = useState<number>(0);
    const [isFetching, StartTransition] = useTransition();

    const { isLoading: isAuthLoading, isConnected } = useAuth();

    useEffect(() => {
        StartTransition(async () => {
            try {
                if (!isAuthLoading && isConnected) {
                    const { data, total: totalItems } = await DAppService.getFavoriteDApps(
                        filterParams, false);

                    if (data) {
                        setFavoriteDapps(data);
                        setTotalItems(totalItems);
                    }
                } else {
                    setFavoriteDapps([]);
                    setTotalItems(0)
                }

            } catch (error) {
                console.error("Failed to fetch favorite dApps:", error);
            }
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isConnected, filterParams.fv_page]);


    // Show combined loading states
    if (isFetching) {
        return <DappCardsSkeleton n={4} />;
    }

    // Show empty state if no favorites
    if (!isFetching && favoriteDapps.length === 0) {
        return (
            <EmptyState
                title="No Favorite DApps Found"
                description="Bookmark a Dapp to add it to your favorites."
                interactive
            />
        );
    }

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
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