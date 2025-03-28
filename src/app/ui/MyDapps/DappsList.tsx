'use client'

import { Suspense, useState, useEffect, useTransition } from 'react'

import { DappList } from '@/types/dapp'
import { DAppCard } from './DappCard'
import PaginationControls from '../PaginationControls'
import { AddDAppModal } from './AddAppModal'

import { DEFAULT_PAGE_SIZE } from '@/config/page'
import DappCardsSkeleton from './skeletons/DappsCardsSkeleton'
import { EmptyState } from '../EmptyState'
import { DAppService, DAppsFilterParams } from '@/services/ao/dappService'
import { useAuth } from '@/context/AuthContext'

export function DAppsList({ filterParams }: { filterParams: DAppsFilterParams }) {
    const [dapps, setDapps] = useState<DappList[]>([]);
    const [totalItems, setTotalItems] = useState(0);
    const [isLoading, startTransition] = useTransition();
    const { isConnected, isLoading: isAuthLoading } = useAuth();

    useEffect(() => {
        startTransition(
            async () => {
                if (!isAuthLoading && isConnected) {
                    const { data, total } = await DAppService.getMyDApps(filterParams, true);

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
    }, [isConnected, filterParams.page, filterParams.protocol, filterParams.search, filterParams.category])

    if (isLoading) {
        return <DappCardsSkeleton />
    }

    if (!isLoading && dapps.length === 0) {
        return (
            <div>
                <AddDAppModal />

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
            <AddDAppModal />

            <Suspense fallback={<DappCardsSkeleton />}>
                <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {dapps.map(dapp => (
                            <div key={dapp.appId}>
                                {
                                    dapp.appId &&
                                    <DAppCard key={dapp.appId} dapp={dapp} isOptimistic={dapp.appId.startsWith('temp')} />
                                }
                            </div>

                        ))}
                    </div>

                    {dapps &&
                        <PaginationControls
                            totalPages={Math.ceil(totalItems / DEFAULT_PAGE_SIZE)}
                        />}
                </div>
            </Suspense>
        </div>

    )
}