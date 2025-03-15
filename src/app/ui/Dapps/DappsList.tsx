'use client'

import DAppCard from './DappCard'
import { DEFAULT_PAGE_SIZE } from '@/config/page'
import InfinityScrollControls from '../InfinityScrollControls'
import { DAppService, DAppsFilterParams } from '@/services/ao/dappService'
import { useEffect, useState, useTransition } from 'react'
import { useAuth } from '@/context/AuthContext'
import { AppData } from '@/types/dapp'
import DappCardsSkeleton from './Skeletons/DappCardsSkeleton'
import { EmptyState } from '../EmptyState'

export function DAppsList({ filterParams }: { filterParams: DAppsFilterParams }) {
    const [dapps, setDapps] = useState<AppData[]>([]);
    const [totalItems, setTotalItems] = useState(0);

    const [isLoading, startTransition] = useTransition();
    const { getDataItemSigner, isConnected, isLoading: isAuthLoading } = useAuth();

    useEffect(() => {

        startTransition(
            async () => {
                try {
                    if (!isAuthLoading && isConnected) {
                        const signer = await getDataItemSigner();

                        const { data, total } = await DAppService.getDApps(filterParams, signer, true);

                        if (data) {
                            setDapps(data);
                            setTotalItems(total)
                        }
                    } else {
                        setDapps([]);
                        setTotalItems(0)
                    }
                } catch (error) {
                    setDapps([]);
                    setTotalItems(0);
                    console.log(error)
                }
            })
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [getDataItemSigner, filterParams.page, filterParams.protocol, filterParams.search, filterParams.category])

    if (isLoading) {
        return <DappCardsSkeleton n={8} />
    }

    if (dapps.length == 0) {
        return (
            <EmptyState
                title="No Dapps Found"
                description="We couldn't find any dapps from the results"
                interactive
                className="my-8"
            />
        )
    }

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {dapps.map(dapp => (
                    <DAppCard key={dapp.appId} dapp={dapp} />
                ))}
            </div>

            {totalItems > DEFAULT_PAGE_SIZE && dapps &&
                <InfinityScrollControls
                    totalPages={Math.ceil(totalItems / DEFAULT_PAGE_SIZE)}
                />}
        </div>
    )
}