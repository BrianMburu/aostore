'use client'

import { useOptimistic, Suspense, useState, useEffect, useTransition } from 'react'

import { AppData } from '@/types/dapp'
import { DAppCard } from './DappCard'
import PaginationControls from '../PaginationControls'
import { AddDAppModal } from './AddAppModal'

import { DEFAULT_PAGE_SIZE } from '@/config/page'
import DappCardsSkeleton from './skeletons/DappsCardsSkeleton'
import { EmptyState } from '../EmptyState'
import { DAppService, DAppsFilterParams } from '@/services/ao/dappService'
import { useAuth } from '@/context/AuthContext'

export function DAppsList({ filterParams }: { filterParams: DAppsFilterParams }) {
    const [dapps, setDapps] = useState<AppData[]>([]);
    const [totalItems, setTotalItems] = useState(0);
    const [isLoading, startTransition] = useTransition();

    const [optimisticDApps, addOptimisticDApp] = useOptimistic(
        dapps,
        (state, newDApp: AppData) => [newDApp, ...state]
    );
    const { getDataItemSigner, isConnected, isLoading: isAuthLoading } = useAuth();

    useEffect(() => {
        startTransition(
            async () => {
                if (!isAuthLoading && isConnected) {
                    const signer = await getDataItemSigner();

                    const { data, total } = await DAppService.getMyDApps(filterParams, signer, true);

                    if (data) {
                        setDapps(data);
                        setTotalItems(total)
                    }

                } else {
                    setDapps([]);
                    setTotalItems(0)
                }
            })
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [getDataItemSigner, filterParams.page, filterParams.protocol, filterParams.search, filterParams.category])

    if (isLoading) {
        return <DappCardsSkeleton />
    }

    if (dapps.length === 0) {
        return (
            <div>
                <AddDAppModal addOptimisticDApp={addOptimisticDApp} setDapps={setDapps} />

                <EmptyState
                    title="No Dapps Found"
                    icon="add"
                    description="We couldn't find any dapps from the results.  Add a new dapp using the add Dapp button below."
                    interactive
                    className="my-8"
                />
            </div>
        )
    }

    return (
        <div>
            {/* Add DApp Form Modal */}
            <AddDAppModal addOptimisticDApp={addOptimisticDApp} setDapps={setDapps} />

            <Suspense fallback={<DappCardsSkeleton />}>
                <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {optimisticDApps.map(dapp => (
                            <DAppCard key={dapp.appId} dapp={dapp} isOptimistic={dapp.appId.startsWith('temp')} />
                        ))}
                    </div>

                    {optimisticDApps &&
                        <PaginationControls
                            totalPages={Math.ceil(totalItems / DEFAULT_PAGE_SIZE)}
                        />}
                </div>
            </Suspense>
        </div>

    )
}