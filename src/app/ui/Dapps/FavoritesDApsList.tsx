'use client'
import { useEffect, useState, useTransition } from 'react'
import DAppCard from './DappCard'
import { DAppService, DAppsFilterParams } from '@/services/ao/dappService'
import { useAuth } from '@/context/AuthContext';
import { AppData } from '@/types/dapp';
import PaginationControls from '../PaginationControls';
import { DEFAULT_PAGE_SIZE } from '@/config'
import DappCardsSkeleton from './Skeletons/DappCardsSkeleton';


export function FavoriteDAppsList({ params }: { params: DAppsFilterParams }) {
    const [favoriteDapps, setFavoriteDapps] = useState<AppData[]>([]);
    const [totalItems, setTotalItems] = useState<number>(0);
    const { user } = useAuth()

    const [fetching, StartTransition] = useTransition();

    useEffect(() => {
        StartTransition(
            async () => {
                const { data: dapps, total: totalItems } = await DAppService.getFavoriteDApps(user!.walletAddress || '', params);
                setFavoriteDapps(dapps)
                setTotalItems(totalItems)
            }
        );
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user, params.fv_page, params.protocol, params.category])


    return (
        <div>
            {/* Add DApp Form Modal */}
            {fetching ? <DappCardsSkeleton n={4} /> :
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
            }
        </div>

    )
}