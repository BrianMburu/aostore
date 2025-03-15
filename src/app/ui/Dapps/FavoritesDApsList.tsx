'use client'

import { useEffect, useState, useTransition } from 'react'
import DAppCard from './DappCard'
import { DAppService, DAppsFilterParams } from '@/services/ao/dappService'
// import { useAuth } from '@/context/AuthContext';
import { AppData } from '@/types/dapp';
import PaginationControls from '../PaginationControls';
import { DEFAULT_PAGE_SIZE } from '@/config/page'
import DappCardsSkeleton from './Skeletons/DappCardsSkeleton';
import { useSafeUser } from '@/hooks/useSafeUser';
// import { useAuth } from '@/context/AuthContext';
import { EmptyState } from '../EmptyState';


export function FavoriteDAppsList({ filterParams }: { filterParams: DAppsFilterParams }) {
    const [favoriteDapps, setFavoriteDapps] = useState<AppData[]>([]);
    const [totalItems, setTotalItems] = useState<number>(0);
    const [isFetching, StartTransition] = useTransition();

    // const { getDataItemSigner } = useAuth();
    const { user } = useSafeUser()

    useEffect(() => {

        StartTransition(async () => {
            try {
                const { data, total: totalItems } = await DAppService.getFavoriteDApps(
                    user.walletAddress, filterParams, false);

                if (data) {
                    setFavoriteDapps(data);
                    setTotalItems(totalItems);
                }

            } catch (error) {
                console.error("Failed to fetch favorite dApps:", error);
            }
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [filterParams.fv_page]);


    // Show combined loading states
    if (isFetching) {
        return <DappCardsSkeleton n={4} />;
    }

    // Show empty state if no favorites
    if (favoriteDapps.length === 0) {
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