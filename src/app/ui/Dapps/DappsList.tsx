'use client'

import DAppCard from './DappCard'
import { DEFAULT_PAGE_SIZE } from '@/config/page'
import InfinityScrollControls from '../InfinityScrollControls'
import { DAppService, DAppsFilterParams } from '@/services/ao/dappService'
import { Suspense, useEffect, useState, useTransition } from 'react'
import { useAuth } from '@/context/AuthContext'
import { DappList } from '@/types/dapp'
import DappCardsSkeleton from './Skeletons/DappCardsSkeleton'
import { EmptyState } from '../EmptyState'
import { useSearchParams } from 'next/navigation'

export function DAppsList() {
    const searchParams = useSearchParams();
    const filterParams = Object.fromEntries(searchParams.entries()) as DAppsFilterParams;

    const [dapps, setDapps] = useState<DappList[]>([]);
    const [totalItems, setTotalItems] = useState(0);

    const [isLoading, startTransition] = useTransition();
    const { isConnected } = useAuth();

    useEffect(() => {
        startTransition(
            async () => {
                try {
                    // if (!isAuthLoading && isConnected) {
                    const { data, total } = await DAppService.getDApps(filterParams, true);

                    if (data) {
                        setDapps(data);
                        setTotalItems(total)
                    }
                    // } else {
                    //     setDapps([]);
                    //     setTotalItems(0)
                    // }
                } catch (error) {
                    setDapps([]);
                    setTotalItems(0);
                    console.error(error)
                }
            })

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isConnected, filterParams.page, filterParams.protocol, filterParams.search, filterParams.category])

    if (isLoading) {
        return <DappCardsSkeleton n={8} />
    }

    if (!isLoading && dapps.length === 0) {
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
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {dapps.map(dapp => (
                    <div key={dapp.appId} >
                        {dapp.appId &&
                            <DAppCard key={dapp.appId} dapp={dapp} />
                        }
                    </div>
                ))}
            </div>

            {totalItems > DEFAULT_PAGE_SIZE && dapps &&
                <Suspense>
                    <InfinityScrollControls
                        totalPages={Math.ceil(totalItems / DEFAULT_PAGE_SIZE)}
                    />
                </Suspense>
            }
        </div>
    )
}